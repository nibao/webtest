import * as React from 'react';
import { map, noop, find } from 'lodash'
import WebComponent from '../webcomponent';
import { getSiteInfo, getLocalSiteInfo } from '../../core/thrift/sharesite/sharesite';
import { editDocLibrarySiteId } from '../../core/thrift/eacp/eacp';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import __ from './locale';

export enum Status {
    /**
     *配置文档库或归档库状态
     */
    Config,

    /**
     * 配置进行中
     */
    Setting
}


export default class DocListSiteBase extends WebComponent<Console.DocListSite.Props, Console.DocListSite.State> {
    static defaultProps = {
        libraries: [],
        type: 'library',
        userInfo: null,
        onComplete: noop,
        onSiteSetSuccess: noop
    }

    state = {
        siteInfos: [],
        selectedSite: this.props.userInfo.user.siteInfo,
        status: Status.Config,
        progress: 0,
        errorStatus: 0
    }

    localSiteInfo

    async componentWillMount() {

        let siteInfos = map((await getSiteInfo()), ({ id, name, linkStatus }) => {
            if (linkStatus === 0) {
                return {
                    id,
                    name: name + __('（离线）')
                }

            } else {
                return {
                    id,
                    name
                }
            }
        })

        this.localSiteInfo = await getLocalSiteInfo()

        if (!find(siteInfos, (siteInfo => {
            return siteInfo.id === this.state.selectedSite.id
        }))) {
            this.setState({
                selectedSite: {
                    id: this.localSiteInfo.id,
                    name: this.localSiteInfo.name
                }
            })
        }
        this.setState({
            siteInfos: [{ id: '', name: __('未归属（跟随文件上传者）') }, ...siteInfos]
        })
    }

    /**
     * 选择站点
     * @param site 
     */
    protected onSelectedSite(site) {
        this.setState({
            selectedSite: site
        })
    }

    /**
     * 设置站点
     */
    protected async onConfirm() {
        this.setState({
            status: Status.Setting
        })
        for (let i = 0; i < this.props.libraries.length; i++) {
            try {
                await editDocLibrarySiteId([this.props.libraries[i].docId, this.state.selectedSite.id])
                this.setState({
                    progress: i / this.props.libraries.length * 100
                })
                await manageLog(
                    ManagementOps.SET,
                    __('设置归档库“${name}”的归属站点为“${siteName}”成功',
                        {
                            'name': this.props.libraries[i].name,
                            'siteName': this.state.selectedSite.name
                        }),
                    null,
                    Level.INFO
                )

            } catch (ex) {
                this.setState({
                    errorStatus: ex.error.errID
                })
                if (ex.error.errID) {
                    this.setState({
                        siteInfos: this.state.siteInfos.filter(value => {
                            return value.id !== this.state.selectedSite.id
                        }),
                        selectedSite: {
                            id: this.localSiteInfo.id,
                            name: this.localSiteInfo.name
                        }
                    })
                }
                throw (ex);
            }
        }
        this.props.onSiteSetSuccess()
    }

    /**
     * 关闭错误弹窗
     */
    protected async closeError() {
        this.setState({
            errorStatus: 0,
            status: Status.Config
        })
    }
}