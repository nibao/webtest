import * as React from 'react';
import { assign, map, cloneDeep, uniq } from 'lodash';
import * as WebUploader from '../../libs/webuploader';
import { ShareMgnt, EACP, getConfig } from '../../core/thrift/thrift';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { FormStatus } from './helper';
import __ from './locale';

interface Props {
    /**
     *  swf文件路径
     */
    swf: string;
    /**
     * 上传地址
     */
    server: string;
}

interface State {
    //第三方认证配置
    editingAuthConfig: {

        //唯一标识第三方认证系统
        thirdPartyId: string;

        //第三方认证系统名称
        thirdPartyName: string;

        //开启状态
        enabled: boolean;

        //需要单独配置的信息，采用json string来保存
        config: string;
    };

    //文本是否发生改变
    change: boolean;

    //认证模块插件是否上传
    pluginUploadStatus: boolean;

    //上传文件名
    fileName: string;

    //插件是否在上传中
    uploading: boolean;

    //表单状态
    formStatus: number;

    //错误信息
    errorMsg: any;

    //选择非tar.gz文件
    illegal: boolean;

    // 第三方插件信息是否已经获取过
    thirdPartyAuthHasGot: boolean;
}

export default class ThirdConfigBase extends React.Component<Props, any> {

    // WebUploader 实例
    uploader = null;

    originConfig = {
        thirdPartyId: '',
        thirdPartyName: '',
        enabled: false,
        config: ''
    };
    originPluginUploadStatus = false;

    props: Props;

    state = {
        editingAuthConfig: {
            thirdPartyId: '',
            thirdPartyName: '',
            enabled: false,
            config: ''


        },
        change: false,
        pluginUploadStatus: false,
        fileName: '',
        uploading: false,
        formStatus: FormStatus.NORMAL,
        errorMsg: '',
        illegal: false,
        thirdPartyAuthHasGot: false
    }

    componentDidMount() {
        this.getThirdPartyAuth();
        this.initWebUpload();
    }

    /**
     * 获取第三方插件信息
     */
    getThirdPartyAuth() {
        Promise.all([
            ShareMgnt('Usrm_GetThirdPartyAuth'),
            ShareMgnt('GetThirdPartyPluginStatus')
        ]).then(([authConfig, pluginUploadStatus]) => {

            this.originConfig = cloneDeep(authConfig);
            this.originPluginUploadStatus = pluginUploadStatus;

            this.setState({
                thirdPartyAuthHasGot: true,
                editingAuthConfig: cloneDeep(authConfig),
                pluginUploadStatus
            });
        });
    }


    /**
     * 初始化上传组件
     */
    initWebUpload() {
        const self = this;
        self.uploader = new WebUploader.Uploader({
            swf: self.props.swf,
            server: self.props.server,
            auto: true,
            threads: 1,
            duplicate: true,
            fileVal: 'package',
            pick: {
                id: self.refs.select,
                innerHTML: __('选择'),
                multiple: false
            },
            accept: {
                extensions: 'tar.gz',
                //mimeTypes: 'application/gzip'
            },
            //当文件被加入队列之前触发
            onBeforeFileQueued: function (file) {
                self.uploader.reset();
                if (!/\.tar\.gz$/.test(file.name)) {
                    self.setState({
                        illegal: true
                    })
                }
            },
            //当文件被加入队列以后触发。
            onFileQueued: function (file) {
                self.setState({
                    fileName: file.name
                });
            },
            onUploadBeforeSend: function (object, data, headers) {
                assign(headers, {
                    'X-CSRFToken': getConfig('CSRFToken')
                });
                data.filename = self.state.fileName;
            },
            //当开始上传流程时触发。
            onStartUpload: function (file) {
                self.setState({
                    uploading: true
                });
            },
            //当文件上传成功时触发。
            onUploadSuccess: function (file, response) {
                self.setState({
                    uploading: false,
                    pluginUploadStatus: true
                });
                manageLog(ManagementOps.SET, __('上传 认证模块插件 ${filename} 成功', { filename: this.state.fileName }), '', Level.WARN);

                EACP('EACP_RestartGlobalShareMgntServer');
            },
            //当文件上传出错时触发。
            onUploaderError: function (file, reason) {
                self.setState({
                    uploading: false,
                    fileName: ''
                });
            },
            //当某个文件上传到服务端响应后，询问服务端响应是否有效
            onUploadAccept: function (object, ret) {
                if (ret.error) {
                    self.setState({
                        uploading: false,
                        errorMsg: ret.error.errMsg,
                        fileName: ''
                    });
                }

            }

        })
    }


    /**
     * 设置第三方用户系统认证启用状态
     * @param enabled 
     */
    setEnabledStatus(enabled) {
        this.setState({
            editingAuthConfig: assign({}, this.state.editingAuthConfig, { enabled }),
            change: true
        });

    }

    /**
     * 重置数据
     */
    reset() {
        this.setState({
            editingAuthConfig: cloneDeep(this.originConfig),
            change: false,
            fileName: '',
            pluginUploadStatus: this.originPluginUploadStatus,
            formStatus: FormStatus.NORMAL

        });
    }


    /**
    * 修改认证参数
    * @param value 
    */
    setConfig(key, value) {
        this.setState({
            editingAuthConfig: assign({}, this.state.editingAuthConfig, { [key]: value }),
            change: true
        });

    }

    /**
     * 保存第三方配置信息
     */
    saveConfig() {
        if (this.state.editingAuthConfig.enabled) {
            let saveData = {
                ncTThirdPartyAuthConf: this.state.editingAuthConfig
            }

            ShareMgnt('Usrm_OpenThirdPartyAuth', [saveData]).then(() => {

                this.setState({
                    change: false,
                    formStatus: FormStatus.NORMAL
                });

                manageLog(ManagementOps.SET, __('启用 第三方用户系统认证 成功'), '', Level.WARN);

                if (this.state.editingAuthConfig.config !== this.originConfig.config) {
                    manageLog(
                        ManagementOps.SET,
                        __('设置 “${name}” 的系统参数 成功', { name: this.state.editingAuthConfig.thirdPartyName }),
                        this.state.pluginUploadStatus ?
                            __('认证服务ID：${id}；认证模块插件 已上传;${config}', { id: this.state.editingAuthConfig.thirdPartyId, config: this.state.editingAuthConfig.config })
                            :
                            __('认证服务ID：${id}；认证模块插件 未上传;${config}', { id: this.state.editingAuthConfig.thirdPartyId, config: this.state.editingAuthConfig.config })
                        ,
                        Level.WARN
                    );
                }

            }, ({error}) => {
                this.setState({
                    errorMsg: error.errMsg,
                });
            });
        } else {
            ShareMgnt('Usrm_CloseThirdPartyAuth').then(() => {
                this.setState({
                    change: false,
                    formStatus: FormStatus.NORMAL
                });
                manageLog(ManagementOps.SET, __('禁用 第三方用户系统认证 成功'), '', Level.WARN);
            });
        }

    }


    /**
     * 点击保存事件
     */
    saveHandle() {
        if (!this.validata()) {
            return;
        }

        this.saveConfig();
    }

    /**
     * 校验表单输入
     */
    validata() {
        if (!this.state.editingAuthConfig.thirdPartyId) {
            this.setState({
                formStatus: FormStatus.ERR_MISSING_ID
            });
            return false;
        }

        if (!this.state.editingAuthConfig.thirdPartyName) {
            this.setState({
                formStatus: FormStatus.ERR_MISSING_NAME
            });
            return false;
        }

        if (!this.state.editingAuthConfig.config) {
            this.setState({
                formStatus: FormStatus.ERR_MISSING_CONFIG
            });
            return false;
        }

        this.setState({
            formStatus: FormStatus.NORMAL
        });
        return true;


    }

    /**
     * 重置错误信息
     */
    resetError() {
        this.setState({
            errorMsg: ''
        });
    }

    /**
     * 重置选取非法文件提示
     */
    resetIllegalTip() {
        this.setState({
            illegal: false
        });
    }


}