import * as React from 'react'
import cookie from 'react-cookie';
import { assign, noop } from 'lodash'
import '../../../gen-js/EACPLog_types';
import { manageLog } from '../../../core/log2/log2'
import { ErrorCode } from '../../../core/siteupgrade/siteupgrade'
import { ECMSManagerClient, createEVFSClient } from '../../../core/thrift2/thrift2'
import * as WebUploader from '../../../libs/webuploader'
import __ from './locale'

export default class UploadBase extends React.Component<Console.ServerUpgrade.Upload.Props, Console.ServerUpgrade.Upload.State> {

    static defaultProps = {
        hide: false,

        onUploadError: noop,

        onUploadSuccess: noop,

        onUploadProgress: noop
    }

    state = {
        /**
         * 上传的包文件
         */
        packageFile: undefined,

        errorCode: ErrorCode.None
    }

    uploader: null

    csrftoken: string = ''

    componentDidMount() {
        this.initUploader(this.refs.select)
    }

    componentWillReceiveProps({ hide }) {
        if (this.props.hide && !hide) {
            this.csrftoken = ''

            this.setState({
                packageFile: undefined
            })

            this.initUploader(this.refs.select)
        }
    }

    /**
     * 初始化上传组件
     */
    initUploader(picker) {
        const self = this;

        self.uploader = new WebUploader.create({
            swf: '/libs/webuploader/dist/Uploader.swf',
            server: '/interface/upload/serverupload/',
            auto: false,
            pick: {
                id: picker,
                innerHTML: __('浏览'),
                multiple: false
            },
            accept: {
                extensions: 'gz',
                mimeTypes: 'application/x-gzip'
            },
            fileVal: 'package',
            timeout: 0,
            onBeforeFileQueued: () => {
                self.uploader.reset();
            },
            onFileQueued: (file) => {
                self.setState({
                    packageFile: file
                })

                return true
            },
            onUploadBeforeSend: (object, data, headers) => {
                assign(headers, {
                    'X-CSRFToken': self.csrftoken,
                    'x-tclient-addr': '127.0.0.1'
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
                        msg: __('上传 服务器升级包 成功'),
                        exMsg: __('升级包名称：“${packagename}”', { packagename: self.state.packageFile.name }),
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
        // 获取应用主节点
        const ip = await ECMSManagerClient.get_app_master_node_ip()
        // 判断本地存储和第三方存储
        const [storage, { accessId }] = await Promise.all([
            ECMSManagerClient.is_storage_pool_inited(),
            createEVFSClient({ ip }).GetThirdPartyOSSInfo()
        ])

        if (!storage && !accessId) {
            // 没有存储设备
            this.setState({
                errorCode: ErrorCode.NoStorageDevice
            })
        } else {
            // 获取csrftoken
            this.csrftoken = cookie.load('csrftoken')

            this.uploader.upload()
        }
    }
}