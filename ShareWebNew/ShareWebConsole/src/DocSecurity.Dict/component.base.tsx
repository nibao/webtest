import * as React from 'react';
import { filter } from 'lodash'
import * as WebUploader from '../../libs/webuploader';
import { buildDownloadDictHref } from '../../core/thrift/illegalcontrol/illegalcontrol';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { open } from '../../util/browser/browser';
import { ESearchMgnt } from '../../core/thrift/thrift';
import WebComponent from '../webcomponent';
import __ from './locale';


interface Props {
    swf: string;

}

interface State {
    // 用户自定义词库信息
    userDictInfo: Array<any>;

    // 词库内容
    dictContent: string;

    // 词库标题
    dictTitle: string;

    // 预览敏感词库
    preview: boolean;

    // 是否批量上传词库
    isBatchOperation: boolean;

    // 默认操作处理
    setDefault: boolean;

    // 上传出错
    uploadError: boolean;

    // 上传错误信息
    uploadErrMsg: string;

    // 当前上传出错的文件
    fileInError: any;

    // 不合法文件队列
    invalidFiles: Array<any>;

}


export default class DictManagementBase extends WebComponent<Props, any> {

    static defaultProps = {
        swf: ''
    }

    state = {
        userDictInfo: [],
        dictContent: '',
        dictTitle: '',
        preview: false,
        setDefault: false,
        uploadError: false,
        uploadErrMsg: '',
        isBatchOperation: false,
        fileInError: null,
        invalidFiles: [],
    }

    // WebUploader 实例
    uploader = null;

    /**
     * 获取所有自定义词库信息
     */
    componentWillMount() {
        ESearchMgnt('Keyscan_GetAllUserDictInfo').then(dictInfo => {
            this.setState({ userDictInfo: dictInfo })
        })
    }

    componentDidMount() {
        this.initUploader(this.refs.select);
    }

    /**
     * 预览敏感词范例
     */
    previewDefaultDict() {
        // 获取默认词库内容
        ESearchMgnt('Keyscan_GetDefUserDictContent').then(content => {
            this.setState({ dictContent: content, dictTitle: __('敏感词库范例') }, () => {
                this.setState({ preview: true });
                manageLog(ManagementOps.PREVIEW, __('预览 敏感词库“${file}” 成功', { file: __('敏感词库范例') }), '', Level.INFO)
            })
        })
    }

    /**
     * 下载敏感词范例
     */
    downloadDefaultDict() {
        // 获取默认词库内容
        buildDownloadDictHref(encodeURIComponent(`${__('敏感词库范例')}.txt`)).then(url => {
            this.setState({ dict: url }, () => {
                location.assign(this.state.dict)
                // 记日志
                manageLog(ManagementOps.DOWNLOAD, __('下载 敏感词库“${file}” 成功', { file: `${__('敏感词库范例')}.txt` }), '', Level.INFO)
            })
        })

    }

    /**
     * 预览用户自定义词库
     */
    previewUserDict(name, file) {
        // 获取自定义词库内容
        ESearchMgnt('Keyscan_GetUserDictContent', [file.id]).then(content => {
            this.setState({ dictContent: content, dictTitle: name }, () => {
                this.setState({ preview: true });
                manageLog(ManagementOps.PREVIEW, __('预览 敏感词库“${file}” 成功', { file: name }), '', Level.INFO)
            })
        })
    }

    /**
     * 关闭预览
     */
    closePreview() {
        this.setState({ preview: false });
    }

    /**
     * 下载用户自定义词库
     */
    downloadUserDict(name, file) {
        // 获取自定义词库内容
        buildDownloadDictHref(encodeURIComponent(name), encodeURIComponent(file.id)).then(url => {
            this.setState({ dict: url }, () => {
                location.assign(this.state.dict);
                manageLog(ManagementOps.DOWNLOAD, __('下载 敏感词库“${file}” 成功', { file: name }), '', Level.INFO);
            })
        })
    }

    /**
     * 删除用户自定义词库
     */
    delUserDict(id, file) {
        ESearchMgnt('Keyscan_DelUserDict', [id]).then(() => {
            this.updateDictInfo([...filter(this.state.userDictInfo, (value) => value.id !== id)]);
            manageLog(ManagementOps.DELETE, __('删除 敏感词库“${file}” 成功', { file: file.name }), '', Level.INFO)
        })
    }

    /**
     * 更新所有词库信息
     */
    updateDictInfo(dictInfo) {
        this.setState({ userDictInfo: dictInfo })
    }

    onUploadError(file, errID) {
        this.skipFile(file);
        if (!this.state.setDefault) {
            this.setState({ fileInError: file }, () => {
                if (errID === 200002 || errID === 200003 || errID === 200004) {
                    this.setState({ uploadError: true, uploadErrMsg: __('${file}上传失败，文件格式不合法', { file: file.name }) })
                } else if (errID === 200006) {
                    this.setState({ uploadError: true, uploadErrMsg: __('您最多只能上传32个词库') })
                } else if (errID === 200007) {
                    this.setState({ uploadError: true, uploadErrMsg: __('${file}上传失败，单个词库大小不能超过4MB', { file: file.name }) })
                }
            })
        } else {
            this.uploader.retry();
        }
    }

    /**
     * 跳过文件
     */
    skipFile(file) {
        this.uploader.removeFile(file, true);
    }


    comfirmUploadFailed() {
        this.setState({ uploadError: false }, () => {
            this.skipFile(this.state.fileInError);
            this.uploader.retry();
        })
    }

    setDefault() {
        this.setState({ setDefault: true })
    }

    /**
     * 结束上传
     */
    endUpload() {
        // 刷新列表信息
        ESearchMgnt('Keyscan_GetAllUserDictInfo').then(dictInfo => {
            this.setState({ userDictInfo: dictInfo, setDefault: false })
        })
    }

    initUpload() {
        this.setState({ upload: true })
    }

    /**
     * 验证文件合法性
     */
    validateFile(file) {
        if (file.ext !== 'txt') {
            this.setState({
                uploadErrMsg: __('${file}上传失败，文件格式不合法', { file: file.name }),
                invalidFiles: [file, ...this.state.invalidFiles]
            });
            // 延时将文件出队
            setTimeout(() => {
                this.setState({
                    invalidFiles: this.state.invalidFiles.slice(1, this.state.invalidFiles.length)
                })
            }, this.state.invalidFiles.length * 1500);
            return false;
        } else {
            return true;
        }
    }

    /**
     * 上传初始化
     */
    initUploader(picker) {
        const self = this;
        self.uploader = new WebUploader.Uploader({
            swf: self.props.swf,
            server: '/interface/userdict/upload/',
            compress: null,
            auto: true,
            pick: {
                id: picker,
                innerHTML: __('上传'),
                multiple: true
            },
            accept: {
                extensions: 'txt',
                mimeTypes: 'text/plain'
            },
            threads: 1,
            duplicate: true,
            chunked: false,
            onBeforeFileQueued: function (file) {
                return self.validateFile(file);
            },
            onFilesQueued: function (file) {
                if (file.length > 1) {
                    self.setState({ isBatchOperation: true })
                } else {
                    self.setState({ isBatchOperation: false })
                }
            },
            onUploadBeforeSend: function (object, data, headers) {
                Object.assign(headers, {
                    'X-CSRFToken': $.cookie('csrftoken')
                });
            },
            onUploadAccept: function (obj, ret) {
                if (ret.error) {
                    self.uploader.stop();
                    self.onUploadError(obj.file, ret.error.errID);
                }
            },
            onUploadSuccess: function (file, response) {
                // 记日志
                manageLog(ManagementOps.UPLOAD, __('上传 敏感词库“${file}” 成功', { file: file.name }), '', Level.INFO)
            },
            onUploadFinished: function () {
                // 当所有文件上传结束时触发
                self.endUpload();
            }
        });


    }

}