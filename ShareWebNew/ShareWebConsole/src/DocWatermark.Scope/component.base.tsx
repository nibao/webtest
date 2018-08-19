import * as React from 'react'
import { ShareMgnt } from '../../core/thrift/thrift'
import { manageLog, Level, ManagementOps } from '../../core/log/log'
import { PureComponent } from '../../ui/decorators'
import { getTypeNameByDocType } from '../../core/entrydoc/entrydoc'
import __ from './locale'

@PureComponent
export default class DocWatermarkScope extends React.Component<any, Components.DocWatermarkScope.State>{
    state = {
        watermarkInfos: [],
        page: 1,
        key: '',
        count: 0,
        adding: null
    }

    PageSize = 200

    componentWillMount() {
        this.getWatermarkDocByPage()
    }

    /**
     * 点击添加按钮
     */
    async addLibs() {
        try {
            const libs = await new Promise((confirm, cancel) => {
                this.setState({
                    adding: { confirm, cancel }
                })
            })
            this.addWatermarkDoc(libs)
        } catch (e) {

        } finally {
            this.setState({
                adding: null
            })
        }
    }

    /**
     * 添加水印文档库
     * @param libs 
     */
    async addWatermarkDoc(libs) {
        for (let lib of libs) {
            try {
                await ShareMgnt('AddWatermarkDoc', [lib.docId, 3])
                manageLog(
                    ManagementOps.SET,
                    __('添加 文档范围 ${type} “${name}” 成功', { type: getTypeNameByDocType(typeof lib.typeName === 'undefined' ? 5 : 3), name: lib.name }),
                    __('预览水印/下载水印'),
                    Level.INFO
                )
            } catch (e) {
                continue
            }
        }
        if (libs.length) {
            this.getWatermarkDocByPage()
        }
    }

    /**
     * 删除水印文档库
     * @param id 
     */
    async deleteWatermarkDoc(obj) {
        try {
            await ShareMgnt('DeleteWatermarkDoc', [obj.objId])
            manageLog(
                ManagementOps.SET,
                __('删除 文档范围 ${type} “${name}” 成功', { name: obj.objName, type: getTypeNameByDocType(obj.objType) }),
                '',
                Level.INFO
            )
        } catch (e) {

        } finally {
            this.getWatermarkDocByPage()
        }
    }

    /**
     * 更新水印文档库配置
     * @param id 
     * @param watermarkType 
     */
    async updateWatermarkDoc(obj, watermarkType) {
        try {
            await ShareMgnt('UpdateWatermarkDoc', [obj.objId, watermarkType])
            manageLog(
                ManagementOps.SET,
                __(
                    '修改水印策略 文档范围 ${type} “${name}” ${watermarkType} 成功',
                    {
                        type: getTypeNameByDocType(obj.objType),
                        name: obj.objName,
                        watermarkType: __(['无水印', '预览水印', '下载水印', '预览水印/下载水印'][watermarkType])
                    }
                ),
                '',
                Level.INFO
            )
        } catch (e) {
        } finally {
            this.getWatermarkDocByPage()
        }
    }

    /**
     * 分页获取水印文档库
     */
    async getWatermarkDocByPage() {
        const { page, key } = this.state
        let count = 0, watermarkInfos: Array<any> = []
        if (key) {
            count = await ShareMgnt('SearchWatermarkDocCnt', [key])
            watermarkInfos = await ShareMgnt('SearchWatermarkDocByPage', [key, (page - 1) * this.PageSize, this.PageSize])
        } else {
            count = await ShareMgnt('GetWatermarkDocCnt')
            watermarkInfos = await ShareMgnt('GetWatermarkDocByPage', [(page - 1) * this.PageSize, this.PageSize])
        }
        this.setState({
            count, watermarkInfos
        })
    }

    /**
     * 输入关键字
     * @param key 
     */
    handleSearchKeyChange(key) {
        this.setState({
            key,
            page: 1
        }, this.getWatermarkDocByPage.bind(this))
    }

    /**
     * 翻页
     * @param page 
     */
    handlePageChange(page) {
        this.setState({
            page
        }, this.getWatermarkDocByPage.bind(this))
    }
}