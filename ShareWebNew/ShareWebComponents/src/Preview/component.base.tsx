/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { pick, assign, indexOf, isFunction, noop } from 'lodash';
import { previewOSS } from '../../core/preview/preview';
import { findType } from '../../core/extension/extension';
import { canCADPreview, docname } from '../../core/docs/docs';
import { watermarkFactory } from '../../core/watermark/watermark';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { userAgent, OSType, Browser } from '../../util/browser/browser';
import { checkPermItem, SharePermission, LinkSharePermission, checkLinkPerm } from '../../core/permission/permission';
import { download } from '../../core/download/download'
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import WebComponent from '../webcomponent';
import { Status } from './helper';

export default class PreviewBase extends WebComponent<Components.Preview.Props, any> implements Components.Preview.Base {

    static defaultProps = {
        // 检查登录
        onCheckLogin: noop,

        // 登录成功
        onLoginSuccess: noop,
        // 查看
        onRedirect: noop,

        // ie8时
        onIncompatiable: noop,

        illegalContentQuarantine: false,

        skipPermissionCheck: false,

        onError: noop
    }

    constructor(props, context) {
        super(props, context);
        this.fetchPDF = this.fetchPDF.bind(this);
    }

    state = {
        pdf: null,
        width: 0,
        watermark: noop,
        downloadEnabled: false,
        password: '',
        status: Status.PENDING,
        showPasswordError: false
    }

    tryPasswordCount = 0

    async componentDidMount() {
        const { link, doc } = this.props
        const name = link ? (link.size === -1 ? docname(doc) : link.name) : docname(doc)

        // cad预览
        if (findType(name) === 'CAD' && await canCADPreview()) {
            if (this.props.illegalContentQuarantine) {
                // 隔离区预览，不支持CAD预览
                this.setState({
                    status: Status.INVALID_FORMAT
                })
            } else {
                // 非隔离区的CAD预览
                this.setState({
                    status: Status.CADPreview
                })

                this.checkEnableDownload()
            }
        } else {
            this.checkCapable()
            this.checkEnableDownload()
            watermarkFactory({ ...(link || {}), ...(doc || {}) }).then(watermark => {
                this.setState({
                    watermark,
                    width: window.innerWidth
                })
            })

            this.checkSupport(link ? (link.size === -1 ? docname(doc) : link.name) : docname(doc)).then(() => {
                if (this.state.status !== Status.BROWSER_INCOMPATIABLE && this.state.status !== Status.INVALID_FORMAT) {
                    this.fetchPDF()
                }
            })
        }

        window.addEventListener('orientationchange', this.orientationChangeHandler)
    }

    componentWillUnmount() {
        window.removeEventListener('orientationchange', this.orientationChangeHandler)
    }

    orientationChangeHandler = () => {
        setTimeout(() => {
            this.setState({
                width: window.innerWidth
            })
        }, 100)
    }

    /**
     * 下载权限
     * @param downloadEnabled 
     */
    checkEnableDownload() {
        let { doc, link } = this.props
        let userid = getOpenAPIConfig('userid')
        if (userAgent().os === OSType.IOS && userAgent().app !== Browser.WeChat) {
            this.setState({
                downloadEnabled: false
            })
        } else {
            (link && link.link ? checkLinkPerm(assign(link, { perm: LinkSharePermission.DOWNLOAD })) : checkPermItem(doc.docid, SharePermission.COPY, userid)).then(downloadEnabled => {
                this.setState({
                    downloadEnabled
                })
            })
        }
    }

    /**
     * 开始下载
     */
    handleDownload() {
        const { doc = {}, link = {} } = this.props
        download({ ...link, ...doc })
    }

    /**
     * 检查浏览器是否支持预览
     */
    checkCapable() {
        if (navigator.userAgent.indexOf('MSIE 8.0') !== -1) {
            this.setState({ status: Status.BROWSER_INCOMPATIABLE });
            this.props.onIncompatiable();
        }
    }

    /**
     * 检查文件格式是否支持
     */
    checkSupport(name) {
        return canCADPreview().then(cadpreview => {
            if (!((indexOf(['WORD', 'EXCEL', 'PPT', 'PDF', 'TXT'], findType(name)) !== -1) || (findType(name) === 'CAD' && cadpreview))) {
                this.setState({
                    status: Status.INVALID_FORMAT
                });
            }
        })
    }

    /**
     * 获取PDF
     */
    fetchPDF() {
        const self = this;
        const { link, doc, illegalContentQuarantine } = this.props;

        this.setState({
            status: Status.FETCHING
        });

        previewOSS(assign({ illegalContentQuarantine }, pick(link, ['link', 'password']), pick(doc, ['docid', 'rev']))).then(({ url }) => {
            PDFJS.getDocument(url, null, (updatePassword, reason) => {
                this.setState({
                    status: Status.PASSWORD_REQUIRED,
                    showPasswordError: this.tryPasswordCount > 0
                });
                this.tryPassword = function (password) {
                    this.tryPasswordCount++;
                    updatePassword(password);
                    this.setState({ status: Status.OK });
                };
            }).then(pdf => {
                this.tryPasswordCount = 0
                this.setState({
                    showPasswordError: false,
                    pdf,
                    status: Status.OK
                })
            }, ({ status }) => {
                this.tryPasswordCount = 0
                this.setState({
                    showPasswordError: false,
                    status: Status.FAILED
                });

                if (status === 0) {
                    const onNetworkError = getOpenAPIConfig('onNetworkError');
                    if (isFunction(onNetworkError)) {
                        onNetworkError();
                    }
                }
            })
        }, function ({ errcode }) {
            switch (errcode) {
                case 503002:
                    setTimeout(self.fetchPDF, 2000);
                    break;

                case 403026:
                    self.setState({
                        status: Status.INVALID_FORMAT
                    });
                    break;

                case 403002:
                    self.setState({
                        status: Status.NO_PERMISSION
                    });
                    break;

                case 403170:
                    self.setState({
                        status: Status.WATERMARKING_FAILED
                    });
                    break;

                case 503005:
                    self.setState({
                        status: Status.MAKING_WATERMARK
                    });
                    break;

                case 404006:
                    self.setState({
                        status: Status.GNS_NOT_EXIST
                    });
                    break;

                // 外链密码不正确
                case ErrorCode.LinkAuthFailed:
                // 外链关闭
                case ErrorCode.LinkInaccessable:
                    self.props.onError(errcode)
                    break

                default:
                    self.setState({
                        status: errcode
                    });
                    break;
            }
        })
    }

    /**
     * 更新文档密码
     */
    updatePassword(password) {
        this.setState({
            showPasswordError: false,
            password
        });
    }

    /**
     * 尝试密码
     */
    tryPassword(password) {
    }
}