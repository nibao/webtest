import * as React from 'react';
import { noop } from 'lodash';
import WebComponent from '../webcomponent';
import { attribute as fileAttribute } from '../../core/apis/efshttp/file/file';
import { attribute as dirAttribute } from '../../core/apis/efshttp/dir/dir';
import { getDownloadURL, getBatchDownloadURL } from '../../core/docs/docs';
import { docname, isDir } from '../../core/docs/docs';
import { findType } from '../../core/extension/extension';
import session from '../../util/session/session';
import { shareToResCenter, shareToPersonSpace, shareToClassSpace } from '../../core/apis/thirdparty/resourceshare/resourceshare';
import { SelectTargetType, ShareTip } from './help';


export default class ResourceShareBase extends WebComponent<Components.ResourceShare.Props, any> {
    static defaultProps = {
        onSuccess: noop,
        onCancel: noop,
    }

    state: Components.ResourceShare.State = {
        selected: SelectTargetType.SHARE_TO_SELF,
        params: null,
        doc: null,
        url: '',
        creator: '',
        uploader: '',
        showLoading: false,
        shareStatus: ShareTip.DISABLED,
        tipDir: '',
        errorMsg: '',
        disableShare: false,
        shareSlow: false,
    }

    componentWillMount() {
        // 获取文档对象
        // 获取文档属性 创建者
        // 如果是路径或者多选，弹出不允许分享的提示
        if (isDir(this.props.docs[0]) || this.props.docs.length >= 2) {
            this.setState({
                disableShare: true
            })
            return;
        }
        this.setState({
            doc: this.props.docs[0],
            uploader: session.get('account'),
            // FIXME:测试
            // uploader: '7990886176000000004'
        }, async () => {
            const { doc } = this.state;
            let attr = await fileAttribute({ docid: doc['docid'] });
            let url = await getDownloadURL({ docid: doc['docid'], rev: doc['rev'], savename: docname(doc) });
            this.setState({
                url,
                // FIXME:测试(url会过期)
                // url: 'http://pan.njqhjy.net:9028/anyshares3accesstestbucket/92FD164430C24749BF1E86FD270D58A6/161BFFCF76E845ED9D0037857E3A7169-i?response-content-disposition=attachment%3b%20filename%3d%22ssss.zip%22%3b%20filename*%3dutf%2d8%27%27ssss.zip&x-eoss-length=743732533&userid=AKIAI6IFWLK557WYM23A&Expires=1508229104&Signature=jC2xE7%2fxmM7flGuxxedoVlgELzI%3d&x-as-userid=741c2802-4cd3-11e7-97ad-001b21bbfb28',
                creator: attr['creator']
            });
        });

    }

    /**
     * 处理子组件选择改变，保存选项数据
     * @protected
     * @param {number} selected 
     * @param {object} data 
     * @memberof ResourceShareBase
     */
    protected handleSelectChange(selected: number, data: object) {
        this.setState({
            params: { ...data },
            selected
        });
    }

    protected async handleSubmitUnit() {
        // 发送保存资源请求。
        const { params, doc, url, creator, uploader } = this.state;
        this.setState({
            showLoading: true
        });
        let postParams = {
            access_token: params['access_token'],
            url,
            filename: isDir(doc) ? `${docname(doc)}.zip` : docname(doc),
            creator,
            uploader,
            type: ['0300'],
            volume: [params['volume']['code']],
            book: params['book'][params['bookIndex']]['code'],
            grade: [params['grade']['code']],
            subject: [params['subject']['code']],
            phase: [params['phase']['code']],
            edition: [params['edition']['code']],
        }
        let index = 1;
        while (params['unit' + index]) {
            postParams['unit' + index] = [params['unit' + index]['code']];
            index++;
        }
        const shareTimer = setTimeout(() => this.setState({ shareSlow: true }), 20000);
        const { status, response } = await shareToResCenter(postParams);
        this.setState({ shareSlow: false });
        clearTimeout(shareTimer);
        if (status >= 400) {
            throw new Error('分享失败,请稍后重试。');
        } else {
            const res = JSON.parse(response);
            if (parseInt(res.code) !== 1) {
                throw new Error(res.msg);
            }
        }
    }
    /**
     * 分享到个人空间
     * @private
     * @memberof ResourceShareBase
     */
    private async handleSubmitPersonSpace() {
        const { params, doc, uploader } = this.state;
        this.setState({
            showLoading: true
        });
        const shareTimer = setTimeout(() => this.setState({ shareSlow: true }), 20000);
        const { status, response } = await shareToPersonSpace({
            user: uploader,
            docid: doc['docid'],
            name: docname(doc),
            key: params['key'],
            type: params['type']
        });
        this.setState({ shareSlow: false });
        clearTimeout(shareTimer);
        if (status >= 400) {
            throw new Error('分享失败,请稍后重试。');
        } else {
            const res = JSON.parse(response);
            if (parseInt(res.status) !== 1) {
                throw new Error(res.msg);
            }
        }
    }

    /**
     * 分享到班级空间
     * @private
     * @memberof ResourceShareBase
     */
    private async handleSubmitClassSpace() {
        const { params, doc, url } = this.state;
        const extension = this.getExtension(doc);
        this.setState({
            showLoading: true
        });
        const shareTimer = setTimeout(() => this.setState({ shareSlow: true }), 20000);
        const { status, response } = await shareToClassSpace({
            extension,
            cyuid: params['cyuid'],
            fileName: isDir(doc) ? `${docname(doc)}.zip` : docname(doc),
            url,
            class_id: params['class_id'],
        });
        this.setState({ shareSlow: false });
        clearTimeout(shareTimer);
        if (status >= 400) {
            throw new Error('分享失败,请稍后重试。');
        } else {
            const res = JSON.parse(response);
            if (parseInt(res.code) !== 1) {
                throw new Error(res.msg);
            }
        }
    }

    /**
     * 处理确认分享
     * @protected
     * @memberof ResourceShareBase
     */
    protected async handleSubmit() {
        const { params, doc } = this.state;
        const extension = this.getExtension(doc);
        const size = doc.size;
        switch (this.state.selected) {
            case SelectTargetType.SHARE_TO_SELF:
                try {
                    await this.handleSubmitPersonSpace();
                    this.setState({
                        showLoading: false,
                        shareStatus: ShareTip.SUCCESS,
                        tipDir: params['dirname'],
                    });
                } catch (error) {
                    this.setState({
                        showLoading: false,
                        shareStatus: ShareTip.ERROR,
                        errorMsg: error.message
                    })
                }
                break;

            case SelectTargetType.SHARE_TO_CLASS:
                try {
                    if (extension === '') {
                        throw new Error('班级空间和资源中心不允许分享不带扩展名的文件。')
                    }
                    await this.handleSubmitClassSpace();
                    this.setState({
                        showLoading: false,
                        shareStatus: ShareTip.SUCCESS,
                        tipDir: params['dirname'],
                    });
                } catch (error) {
                    this.setState({
                        showLoading: false,
                        shareStatus: ShareTip.ERROR,
                        errorMsg: error.message
                    })
                }
                break;

            case SelectTargetType.SHARE_TO_RESOUCRE_CENTER:
                try {
                    if (extension === '') {
                        throw new Error('班级空间和资源中心不允许分享不带扩展名的文件。')
                    }
                    await this.handleSubmitUnit();
                    let index = 1;
                    let tipDir = '';
                    while (params['unit' + index]) {
                        tipDir += (' / ' + params['unit' + index]['name']);
                        index++;
                    }
                    this.setState({
                        showLoading: false,
                        shareStatus: ShareTip.SUCCESS,
                        tipDir,
                    });
                } catch (error) {
                    this.setState({
                        showLoading: false,
                        shareStatus: ShareTip.ERROR,
                        errorMsg: error.message
                    })
                }
                break;
            default:
                break;
        }
    }

    /**
     * 处理取消分享
     * @protected
     * @memberof ResourceShareBase
     */
    protected handleCancel() {
        this.props.onCancel();
    }

    /**
     * 隐藏提示信息
     * @protected
     * @memberof ResourceShareBase
     */
    protected handleCloseTipDiaglog() {
        this.setState({
            shareStatus: ShareTip.DISABLED,
        })
    }
    /**
     * 获取文件扩展名，没有返回''
     * @private
     * @param {any} doc 
     * @returns {string}
     * @memberof ResourceShareBase
     */
    private getExtension(doc) {
        const dotIndex = docname(doc).lastIndexOf('.');
        return dotIndex === -1 ? '' : docname(doc).slice(dotIndex + 1);
    }
}