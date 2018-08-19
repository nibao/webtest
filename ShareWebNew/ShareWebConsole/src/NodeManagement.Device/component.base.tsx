import * as React from 'react'
import { reduce, map, values } from 'lodash'
import { ECMSManagerClient } from '../../core/thrift2/thrift2'
import { USAGE } from './helper'

export default class DeviceBase extends React.Component<Console.NodeManagementDevice.Props, Console.NodeManagementDevice.State> {

    static defaultProps = {
        node: {},
    }

    state = {
        processingInit: true,
        openSystem: true,
        openDisk: false,
        cpuUsage: 0,
        memoryInfo: {},
        networkOutgoingRate: 0,
        networkIncomingRate: 0,
        sysVolume: {},
        cacheVolume: {},
        diskDevices: null,
    }

    /**
     * 页面初始化时加载系统设备信息
     */
    async componentDidMount() {
        const { node } = this.props
        try {
            const [
                cpuUsage,
                memoryInfo,
                networkOutgoingRate,
                networkIncomingRate,
            ] = await Promise.all([
                ECMSManagerClient.get_cpu_usage(node.node_uuid),
                ECMSManagerClient.get_memory_info(node.node_uuid),
                ECMSManagerClient.get_network_outgoing_rate(node.node_uuid),
                ECMSManagerClient.get_network_incoming_rate(node.node_uuid),
            ])

            this.setState({
                cpuUsage,
                memoryInfo,
                networkOutgoingRate,
                networkIncomingRate,
            })
        } catch (error) {
            this.setState({
                cpuUsage: -1,
                memoryInfo: { usage: -1 },
                networkOutgoingRate: -1,
                networkIncomingRate: -1,
            })
        }

        try {
            const [
                sysVolume,
                cacheVolume
            ] = await Promise.all([
                ECMSManagerClient.get_sys_volume(node.node_uuid),
                ECMSManagerClient.get_cache_volume(node.node_uuid)
            ])
            this.setState({
                sysVolume,
                cacheVolume,
            })
        } catch (error) {
            throw error
        }

        this.setState({
            processingInit: false,
        })
    }

    /**
     * 点击磁盘设备栏目时触发
     */
    protected async handleDiskDevicesToggle() {
        const { node } = this.props
        const { diskDevices, sysVolume, cacheVolume, openDisk } = this.state

        // 根据是否拼接过diskDevices数组，判断是否请求过磁盘信息
        if (diskDevices === null) {
            // 当没有请求过数据时，请求相关数据，并根据缓存盘的'disk_dev_path'属性判断是否具有缓存盘
            if (cacheVolume['disk_dev_path'] !== '') {
                try {
                    const [
                        sysDisk,
                        cacheDisk,
                        dataDisks,
                        freeDataDisks,
                        sysvolDisk,
                    ] = await Promise.all([
                        ECMSManagerClient.get_disk_info(node.node_uuid, sysVolume['disk_dev_path']),
                        ECMSManagerClient.get_disk_info(node.node_uuid, cacheVolume['disk_dev_path']),
                        ECMSManagerClient.get_data_disks(node.node_uuid),
                        ECMSManagerClient.get_free_data_disks(node.node_ip),
                        ECMSManagerClient.get_sysvol_volume(node.node_uuid),
                    ])

                    this.setState({
                        diskDevices: this.spliceArr({ dataDisks: dataDisks, freeDataDisks: freeDataDisks, sysDisk: sysDisk, cacheDisk: cacheDisk, sysvolDisk: sysvolDisk }),
                        openDisk: !openDisk,
                    })
                } catch (error) {
                    throw error
                }
            } else {
                try {
                    const [
                        sysDisk,
                        dataDisks,
                        freeDataDisks,
                        sysvolDisk,
                    ] = await Promise.all([
                        ECMSManagerClient.get_disk_info(node.node_uuid, sysVolume['disk_dev_path']),
                        ECMSManagerClient.get_data_disks(node.node_uuid),
                        ECMSManagerClient.get_free_data_disks(node.node_ip),
                        ECMSManagerClient.get_sysvol_volume(node.node_uuid),
                    ])

                    this.setState({
                        diskDevices: this.spliceArr({ dataDisks: dataDisks, freeDataDisks: freeDataDisks, sysDisk: sysDisk, cacheDisk: null, sysvolDisk: sysvolDisk }),
                        openDisk: !openDisk,
                    })
                } catch (error) {
                    throw error
                }
            }
        } else {
            // 当请求过数据时，直接用原来的数据填充
            this.setState({
                openDisk: !openDisk,
            })
        }
    }

    /**
     * 将对象拼接为目标数组，用于渲染DataGrid
     * @param {any} { dataDisks -- 所有磁盘信息（存储和空闲）, freeDataDisks -- 空闲磁盘信息, sysDisk -- 系统盘信息, cacheDisk -- 缓存盘信息 , sysvolDisk -- sysvol卷信息 } 
     * @returns {ReadonlyArray<object>} 
     */
    private spliceArr({ dataDisks, freeDataDisks, sysDisk, cacheDisk, sysvolDisk }): ReadonlyArray<object> {
        // 从所有磁盘列表（由dataDisks返回）中过滤掉空闲磁盘列表（由freeDataDisks返回）中的数据，得到存储盘storageDisks
        const storageDisks = reduce(dataDisks, (dataDiskRes, dataDisk, dataDiskindex) => {
            return freeDataDisks[dataDiskindex] ?
                dataDiskRes
                :
                { ...dataDiskRes, [dataDiskindex]: dataDisk }
        }, {})

        const storageVolume: ReadonlyArray<object> = this.getData(storageDisks)

        let diskDevices: ReadonlyArray<object> = []

        if (sysDisk) {
            diskDevices = diskDevices.concat({ ...sysDisk, capacity_gb: parseFloat(sysDisk['capacity_gb']), use: USAGE.System })
        }

        if (cacheDisk) {
            diskDevices = diskDevices.concat({ ...cacheDisk, capacity_gb: parseFloat(cacheDisk['capacity_gb']), use: USAGE.Cache })
        }

        if (storageVolume && storageVolume.length !== 0) {
            const newUsedDataVolume = map(storageVolume, item => {
                return { ...item, use: USAGE.Storage }
            })
            diskDevices = diskDevices.concat(...newUsedDataVolume)
        }

        if (freeDataDisks) {
            const newFreeDataVolume = values(freeDataDisks).map((item => {
                return { ...item, used_size_gb: -1, use: USAGE.Free }
            }))
            diskDevices = diskDevices.concat(...newFreeDataVolume)
        }

        if (sysvolDisk['disk_dev_path'] !== '') {
            diskDevices = diskDevices.concat({ ...sysvolDisk, use: USAGE.Sysvol })
        }

        return diskDevices
    }

    /**
    * 遍历数据盘，返回其中的数据卷信息
    * @param {object} dataDisks 系统数据盘
    * @returns 数据卷对象
    */
    private getData(dataDisks: object): ReadonlyArray<object> {
        return reduce(dataDisks, (pre, disk) => {
            return [...pre, ...(reduce(disk.volumes, (preVol, volume) => {
                return [...preVol, { ...volume, disk_model: disk.disk_model }]
            }, []))]
        }, [])
    }
}



