import * as React from 'react'
import cookie from 'react-cookie';
import { assign, noop } from 'lodash'
import '../../../gen-js/EACPLog_types';
import { useHTTPS } from '../../../util/browser/browser';
import { manageLog } from '../../../core/log2/log2'
import { Mode, clients, testPackageNamePattern, ErrorCode } from '../../../core/siteupgrade/siteupgrade'
import { ECMSManagerClient, createEVFSClient } from '../../../core/thrift2/thrift2'
import * as WebUploader from '../../../libs/webuploader'
import __ from './locale'

export default class UploadBase extends React.Component<Console.ClientUpgrade.Upload.Props, Console.ClientUpgrade.Upload.State> {

    static defaultProps = {
        hide: false,

        onUploadError: noop,

        onUploadSuccess: noop,

        onUploadProgress: noop
    }

    state = {
        packageFile: undefined,

        mode: Mode.None,

        errorCode: ErrorCode.None
    }

    uploader: null

    file: any;  // 选中待上传的文件

    nodeIp: string = ''  // 主节点IP

    csrftoken: string = ''

    useHttps: boolean = false  // 是否使用https

    componentDidMount() {
        this.initUploader(this.refs.select)
    }

    componentWillReceiveProps({ hide }) {
        if (this.props.hide && !hide) {
            this.file = null
            this.nodeIp = ''
            this.csrftoken = ''

            this.setState({
                packageFile: undefined,
                mode: Mode.None
            })

            this.initUploader(this.refs.select)
        }
    }

    /**
     * 初始化上传组件
     */
    async initUploader(picker) {
        // 获取应用主节点
        this.nodeIp = await ECMSManagerClient.get_app_master_node_ip()
        this.useHttps = useHTTPS()
        const self = this;

        self.uploader = new WebUploader.create({
            // 为了解决IE9 flash跨域上传，如果不跨域，直接写'/libs/webuploader/dist/Uploader.swf'
            swf: `${self.useHttps ? 'https' : 'http'}://${self.nodeIp}:8080/libs/webuploader/dist/Uploader.swf`,
            server: `${self.useHttps ? 'https' : 'http'}://${self.nodeIp}:8080/interface/upload/clientupload/`,
            auto: false,
            pick: {
                id: picker,
                innerHTML: __('浏览'),
                multiple: false
            },
            accept: clients[self.props.osType].accept,
            fileVal: 'package',
            timeout: 0,
            onBeforeFileQueued: () => {
                self.uploader.reset();
            },
            onFileQueued: (file) => {
                self.file = file

                self.setState({
                    packageFile: file
                })

                return true
            },
            onUploadBeforeSend: (object, data, headers) => {
                assign(headers, {
                    'X-CSRFToken': self.csrftoken,
                    'x-tclient-addr': self.nodeIp
                });
            },
            onUploadProgress: (file, percentage) => {
                self.props.onUploadProgress(percentage.toFixed(2))
            },
            onUploadAccept: (object, ret) => {
                // 上传出错了
                if (ret.expMsg) {
                    self.props.onUploadError({
                        type: ErrorCode.UploadError,
                        message: ret.expMsg
                    })
                } else {
                    // 记录上传日志
                    manageLog({
                        level: ncTLogLevel['NCT_LL_INFO'],
                        opType: ncTManagementType['NCT_MNT_ADD'],
                        msg: __('上传${ostypename}客户端升级包“${packagename}” 成功', { ostypename: clients[self.props.osType].text, packagename: self.state.packageFile.name }),
                        exMsg: __('升级模式：') + (self.state.mode === Mode.Force ? __('强制') : __('非强制')),
                    })

                    self.props.onUploadSuccess()
                }
            },
            onUploadError: (file, reason) => {
                if (reason === 'abort') {
                    self.props.onUploadError({
                        type: ErrorCode.UploadError,
                        message: reason
                    })
                }
            }
        });
    }

    /**
     * 点击“上传”按钮
     */
    protected async upload() {
        // 判断本地存储和第三方存储
        const [storage, { accessId }] = await Promise.all([
            ECMSManagerClient.is_storage_pool_inited(),
            createEVFSClient({ ip: this.nodeIp }).GetThirdPartyOSSInfo()
        ])

        if (!storage && !accessId) {
            // 没有存储设备
            this.setState({
                errorCode: ErrorCode.NoStorageDevice
            })
        } else {
            // 根据强制/非强制模式更改包的名字
            this.file.name = this.modeTypeChange(this.file.name, this.state.mode)
            // 获取csrftoken
            this.csrftoken = cookie.load('csrftoken')

            this.uploader.upload()
        }
    }

    /**
     * 根据不同的升级模式返回不同的包名称
     **/
    private modeTypeChange(name: string, mode: Mode): string {
        let filename;

        switch (mode) {
            // 非强制升级
            case Mode.NoForce:
                if (name.indexOf('release') === -1 && name.indexOf('Terminator') !== -1) {
                    filename = name.replace(/Terminator/g, 'release');
                }

                break

            // 强制升级
            case Mode.Force:
                if (name.indexOf('release') !== -1 && name.indexOf('Terminator') === -1) {
                    filename = name.replace(/release/g, 'Terminator');
                }

                break

            default:
        }

        return filename || name;
    }

    /**
     * 选择“强制模式”或者“非强制”模式
     */
    protected changeMode(mode: Mode) {
        switch (mode) {
            // 强制升级
            case Mode.Force:
                this.setState({
                    mode: Mode.Force
                })

                break

            // 非强制升级
            case Mode.NoForce:
                this.setState({
                    mode: Mode.NoForce
                })

        }
    }

    /**
     * 检测上传按钮是否禁用
     * (1)未选择 强制模式 or 非强制模式  -- 禁用
     * (2)没有选择文件 -- 禁用
     * (3)选中的包名字不符合规则 -- 禁用
     * @returns  true -- 禁用; false -- 可用
     */
    protected checkBtnDisable() {
        // 没有选择文件
        if (!this.file) {
            return true
        }

        // 没有选择“强制模式”或者“非强制模式”
        if (this.state.mode === Mode.None) {
            return true
        }

        // 检测名字的规范性
        return !testPackageNamePattern(this.state.packageFile.name, this.props.osType)
    }
}