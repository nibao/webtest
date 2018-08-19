import * as React from 'react';
import { merge, isObject, findIndex } from 'lodash';
import session from '../../util/session/session';
import { open } from '../../util/browser/browser';
import { getDownloadURL as getLinkDownloadURL } from '../../core/link/link';
import { getDownloadURL as getFileDownloadURL } from '../../core/docs/docs';
import { buildImageSrc, buildLinkImageSrc } from '../../core/image/image';
import { Status } from './helper';
import { checkPermItem, SharePermission } from '../../core/permission/permission';
import { checkCsfLevel } from '../../core/csf/csf';
import { docname } from '../../core/docs/docs';
import { findPictrueType } from '../../core/extension/extension';
import WebComponent from '../webcomponent';

export default class ImageBase extends WebComponent<Components.Image.Props, any> implements Components.Image.Base {
    static defaultProps = {
        /**
         * 直接传递图片url
         */
        url: '',

        /**
         * 传递图片文档对象
         */
        doc: null,

        /**
         * 传递外链对象
         */
        link: null,

        /**
         * 图片列表
         */
        list: [],

        /**
         * 缩略图文档列表
         */
        gallery: [],

        /**
         * 权限信息
         */
        perm: 1,

        /**
         * 缩略图分组大小
         */
        groupSize: 8
    }

    state = {
        /**
         * 图片资源
         */
        src: '',

        /**
         * 状态
         */
        status: -1,

        /**
         * 当前图片文档 移动端切换图片时使用
         */
        currentDoc: null,

        /**
         * 下载地址
         */
        downloadURL: '',

        previewError: false
    }

    componentDidMount() {
        this.load(this.props.doc);
    }

    /**
     * 图片文档对象或者外链对象改变时 重新加载 获取下载地址
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.doc && nextProps.doc.docid !== this.props.doc.docid) {
            this.load(nextProps.doc);

            // 这里需要清空一下图裂的state，要不然一旦出现图裂，切换其他图片时会一直显示图裂
            this.setState({
                previewError: false
            })
        }
    }

    load(doc) {

        if (!doc) {
            // 文件不存在
            this.setState({ status: Status.FILE_NOT_EXISTED });
        } else if (!findPictrueType(docname(doc))) {
            // 不支持的图片格式
            this.setState({
                status: Status.INVALID_FORMAT
            });
        } else {
            if (this.props.link) {
                // 外链预览
                this.setState({
                    status: Status.OK,
                    src: buildLinkImageSrc(merge({}, this.props.link, doc))
                })
            } else if (doc) {
                // 不是外链预览 检查预览权限
                this.check(doc).then(() => {
                    this.setState({
                        status: Status.OK,
                        src: buildImageSrc(doc)
                    })
                });
            }
        }


        if (doc && this.props.list) {
            this.setState({
                currentDoc: doc
            });
        }
    }

    /**
     * 检查预览权限 检查密级
     */
    check(doc) {
        let self = this;
        return new Promise((resolve, reject) => {
            Promise.all([
                checkPermItem(doc.docid, SharePermission.PREVIEW, session.get('userid')),
                checkCsfLevel(doc.docid)
            ]).then(([permission, csf]) => {
                if (permission) {
                    resolve(1);
                } else {
                    self.setState({ status: Status.NO_PERMISSION });
                    reject(1);
                }
            }).catch((response) => {
                if (response.errcode) {
                    switch (response.errcode) {
                        case 403002:
                            self.setState({ status: Status.NO_PERMISSION });
                            break;

                        case 404006:
                            self.setState({ status: Status.FILE_NOT_EXISTED });
                            break;

                        default:
                            self.setState({ status: Status.FAILED });
                            break;
                    }
                }
                reject(1);
            });
        })
    }

    /**
     * gallery切换当前图片
     */
    switchImage(target) {
        let self = this;
        return function () {
            self.props.applyImage(target);
        }
    }

    /**
     * 获取缩略图位置
     */
    getIndex() {
        let index = findIndex(this.props.gallery, (item, i) => {
            return item.docid === this.props.doc.docid;
        });

        return Math.floor(index / this.props.groupSize);
    }

    /**
     * 处理预览图片出错
     */
    protected handleError(e: React.SyntheticEvent<any>) {
        this.setState({
            previewError: true
        })
    }
}