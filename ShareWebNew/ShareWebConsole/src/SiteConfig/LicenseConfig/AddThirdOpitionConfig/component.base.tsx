
import * as React from 'react';
import cookie from 'react-cookie';
import { assign } from 'lodash';
import * as WebUploader from '../../../../libs/webuploader'
import { ECMSManagerClient, EVFSClient } from '../../../../core/thrift2/thrift2'
import { manageLog } from '../../../../core/log2/log2'
import { useHTTPS } from '../../../../util/browser/browser';
import WebComponent from '../../../webcomponent';
import __ from './locale';

interface Props {

    /**
     * 添加第三方选件成功回调
     */
    oAddThirdOpitionSuccess: () => void;

    /** 
     * 添加第三方选件关闭回调
     */
    oAddThirdOpitionCancel: () => void
}

interface State {
    /**
     * 文档摘要提取包文件
     */
    summaryFile: undefined | File;

    /**
      * 文档关键词提取选件
      */
    keyExtractFile: undefined | File;


    /**
      * 文档智能分类选件
      */
    deepclassifierFile: undefined | File;

    /** 
     * 错误信息
     */
    errormsg: string;

    /**
     * 正在加载
     */
    loading: boolean;

}

export default class AddThirdOpitionConfigBase extends WebComponent<Props, State> {

    state = {

        summaryFile: undefined,

        keyExtractFile: undefined,

        deepclassifierFile: undefined,

        errormsg: '',

        loading: false
    }

    summaryUploader: null;

    keyExtractUploader: null;

    deepclassifierUploader: null;

    nodeIp: string = ''  // 主节点IP

    csrftoken: string = ''

    executeTaskCnt: number = 0

    executeSuccessCnt: number = 0

    useHttps: boolean = useHTTPS()

    async componentDidMount() {
        // 获取nodeIp和csrftoken
        this.nodeIp = await ECMSManagerClient.get_app_master_node_ip()
        this.csrftoken = cookie.load('csrftoken')
        this.summaryUploader = this.initUploader(this.refs.summary)
        this.keyExtractUploader = this.initUploader(this.refs.keyExtract)
        this.deepclassifierUploader = this.initUploader(this.refs.deepclassifier)
    }

    onConfirm() {
        if (this.state.summaryFile) {
            this.summaryUploader.upload()
            this.executeTaskCnt++
        }
        if (this.state.keyExtractFile) {
            this.keyExtractUploader.upload()
            this.executeTaskCnt++
        }
        if (this.state.deepclassifierFile) {
            this.deepclassifierUploader.upload()
            this.executeTaskCnt++
        }
        this.setState({
            loading: true
        })
    }

    private initUploader(picker) {
        const self = this;
        return new WebUploader.create({
            server: `${self.useHttps ? 'https' : 'http'}://${self.nodeIp}:8080/interface/thirdpartyoptions/upload/`,
            swf: `${self.useHttps ? 'https' : 'http'}://${self.nodeIp}:8080/libs/webuploader/dist/Uploader.swf`,

            pick: {
                id: picker,
                label: __('浏览'),
                multiple: false
            },
            accept: {
                title: '*.user',
                extensions: 'user',
                mimeTypes: '.user'
            },

            onBeforeFileQueued: (file) => {
                if (picker === self.refs.summary) {
                    if (file.name === 'summary.user') {
                        self.setState({
                            summaryFile: file
                        })
                    } else {
                        self.setState({
                            errormsg: __('您选择的文件与选件类别不匹配'),
                            summaryFile: undefined,
                            loading: false
                        })
                        self.summaryUploader.reset()
                        return false
                    }
                }
                if (picker === self.refs.keyExtract) {
                    if (file.name === 'keyExtract.user') {
                        self.setState({
                            keyExtractFile: file
                        })
                    } else {
                        self.setState({
                            errormsg: __('您选择的文件与选件类别不匹配'),
                            keyExtractFile: undefined,
                            loading: false
                        })
                        self.keyExtractUploader.reset()
                        return false
                    }
                }
                if (picker === self.refs.deepclassifier) {
                    if (file.name === 'deepclassifier.user') {
                        self.setState({
                            deepclassifierFile: file
                        })
                    } else {
                        self.setState({
                            errormsg: __('您选择的文件与选件类别不匹配'),
                            deepclassifierFile: undefined,
                            loading: false
                        })
                        self.deepclassifierUploader.reset()
                        return false
                    }
                }
            },

            onUploadBeforeSend: (object, data, headers) => {
                assign(headers, {
                    'X-CSRFToken': self.csrftoken,
                    'x-tclient-addr': self.nodeIp
                });
            },

            onUploadAccept: function (obj, ret) {
                if (ret.expMsg) {
                    if (ret.error && ret.error.errMsg == '0') {
                        self.setState({
                            errormsg: __('检测到索引服务未运行。'),
                            loading: false
                        })
                    } else {
                        self.setState({
                            errormsg: ret.expMsg,
                            loading: false
                        })
                    }
                    self.reset()

                } else {
                    manageLog({
                        level: ncTLogLevel['NCT_LL_INFO'],
                        opType: ncTManagementType['NCT_MNT_SET'],
                        msg: __('添加并激活 ${name} 成功', { 'name': obj && obj.file ? obj.file.name : '---' }),
                        exMsg: __('授权文件名:${name}', { 'name': obj && obj.file ? obj.file.name : '---' }),
                    })
                    self.onUploadSuccess()
                }
            },

        });
    }

    private onUploadSuccess() {
        this.executeSuccessCnt++
        if (this.executeSuccessCnt === this.executeTaskCnt) {
            this.executeSuccessCnt = 0;
            this.executeTaskCnt = 0;
            this.props.oAddThirdOpitionSuccess()
            this.setState({
                loading: false
            })
        }
    }

    private reset() {
        if (this.state.summaryFile) {
            this.summaryUploader.reset()
            this.setState({
                summaryFile: undefined
            })
        }
        if (this.state.keyExtractFile) {
            this.keyExtractUploader.reset()
            this.setState({
                keyExtractFile: undefined
            })
        }
        if (this.state.deepclassifierFile) {
            this.deepclassifierUploader.reset()
            this.setState({
                deepclassifierFile: undefined
            })
        }
        this.executeTaskCnt = 0;
        this.executeSuccessCnt = 0
    }

    onErrorConfirm() {
        this.setState({ errormsg: '' })
    }

}