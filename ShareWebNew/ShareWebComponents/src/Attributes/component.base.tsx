import * as React from 'react';
import { pairs, map, isEqual, isFunction, reduce, some, isNumber } from 'lodash';
import { CSFBtnStatus } from '../../core/csf/csf'
import { attribute as getDocAttribute, metaData, getAppmetadata } from '../../core/apis/efshttp/file/file';
import { attribute as getDirAttribute } from '../../core/apis/efshttp/dir/dir';
import { getByDocId } from '../../core/apis/eachttp/entrydoc/entrydoc';
import { getLockInfo } from '../../core/apis/eachttp/autolock/autolock';
import { getConfig, buildWebClientURI } from '../../core/config/config';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { openUrlByChrome } from '../../core/apis/client/tmp/tmp';
import { isVirtual } from '../../core/entrydoc/entrydoc';
import { isDir } from '../../core/docs/docs';
import { isUserId } from '../../core/user/user';
import { isCID } from './helper';
import { CSFSYSID } from '../../core/csf/csf';
import __ from './locale';

export default class AttributesBase extends React.Component<Components.Attributes.Props, Components.Attributes.State> {
    static defaultProps = {
        size: 0,

        cdflevel: 0,

        doApprovalCheck: () => {
            location.replace('#/home/apvreq');
        }
    }

    state = {
        panelVisible: false,

        csfBtnShow: false,

        attributes: {
            creator: '---',
            create_time: 0,
            editor: '---',
            modified: 0,
            csflevel: 0,
            site: '',
            client_mtime: 0
        },

        lockername: null,

        size: null,

        csfSysId: '',

        csfDetailsBtnShow: false,

        csfTextArray: [],

        csfIsNull: false,

        csfBtnStatus: CSFBtnStatus.None
    }

    static initStatus: Components.Attributes.InitStatus = {
        panelVisible: false,

        attributes: {
            creator: '---',
            create_time: 0,
            editor: '---',
            modified: 0,
            csflevel: 0,
            site: '',
            client_mtime: 0
        },

        lockername: null
    }
    componentWillMount() {
        this.showAttributePanel(this.props.docs);
        this.getThirdCsfConfig();
        this.getCsfLevels();
        this.getSize(this.props.docs);
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps.docs, this.props.docs)) {
            this.setState({ ...AttributesBase.initStatus })
            this.showAttributePanel(nextProps.docs);
            this.getThirdCsfConfig();
            this.getCsfLevels();
            this.getSize(nextProps.docs);
        }

        // 更新侧边栏的 “密级”
        if (nextProps.csflevel && nextProps.csflevel !== this.state.attributes.csflevel) {
            this.setState({
                attributes: {
                    ...this.state.attributes,
                    csflevel: nextProps.csflevel
                }
            })
        }

        // 更新侧边栏的大小
        if (nextProps.size && nextProps.size !== this.state.size) {
            this.setState({
                size: nextProps.size
            })
        }
    }

    /**
     * 获取属性面板内容
     * @param docs 选中的文件数组
     */
    private async showAttributePanel(docs): void {
        if (docs) {
            if (docs.length) {
                // 选中文件，“密级设置按钮”可见
                this.setState({
                    csfBtnShow: true
                });
            } else {
                this.setState({
                    csfBtnShow: false,
                    csfDetailsBtnShow: false
                });
            }

            if (docs.length === 1) {
                // 在非顶级目录选中一个文件或者一个文件夹
                if (isCID(docs[0].docid)) {
                    let { siteinfo } = await getByDocId({ docid: docs[0].docid })

                    this.setState({
                        attributes: {
                            site: siteinfo ? siteinfo.name : '---'
                        },
                        panelVisible: true,
                    });
                } else {
                    // 判断是否是虚拟目录
                    isVirtual(docs[0].docid).then((isvirtual) => {
                        if (isvirtual) {
                            // 虚拟目录
                            this.setState({
                                attributes: {
                                    site: docs[0].siteinfo ? docs[0].siteinfo.name : '---'
                                },
                                panelVisible: true
                            });
                        } else {
                            this.getAttributes(docs[0]);
                            this.getFileCsfDetails(docs[0]);
                            this.getLockInfo(docs[0]);
                            this.setState({
                                panelVisible: true
                            })
                        }
                    })
                }

            } else if (docs.length >= 2) {
                this.setState({
                    attributes: {},
                    panelVisible: true,
                    csfDetailsBtnShow: false
                });
            } else {
                this.setState({
                    attributes: {},
                    panelVisible: false
                })
            }
        } else {
            this.setState({
                attributes: {},
                panelVisible: false,
                csfBtnShow: false,
                csfDetailsBtnShow: false
            })
        }

    }

    /**
     * 获取文件和文件夹的属性
     * @param doc 选中的文件或目录
     */
    private getAttributes(doc: Core.Docs.Doc) {
        return isDir(doc) ? this.getDirAttributes(doc) : this.getFileAttributeAndMetadata(doc);
    }

    /**
     * 获取文件属性和元数据
     * @param doc 选中的文件
     */
    private getFileAttributeAndMetadata(doc: Core.Docs.Doc) {
        return this.getFileAttribute(doc)
            .then(({ creator, create_time, csflevel }) => {
                this.getFileMetadata(doc)
                    .then(({ editor, client_mtime, site, modified }) => {
                        if (isUserId(creator)) {
                            creator = __('未知用户');
                        }
                        if (isUserId(editor)) {
                            editor = __('未知用户');
                        }
                        let attributes = {
                            creator,
                            create_time,
                            csflevel,
                            editor,
                            site: isDir(doc) ? '' : site,
                            modified,
                            client_mtime
                        }
                        this.setState({ attributes });
                    })
            });
    }

    /**
     * 获取文件属性
     * @param doc 选中的文件
     */
    private getFileAttribute(doc: Core.Docs.Doc) {
        return getDocAttribute({ docid: doc.docid });
    }

    /**
     * 获取文件元数据
     * @param doc 选中的文件
     */
    private getFileMetadata(doc: Core.Docs.Doc) {
        return metaData({ docid: doc.docid });
    }

    /**
     * 获取目录属性
     * @param doc 选中的目录
     */
    private getDirAttributes(doc: Core.Docs.Doc) {
        return getDirAttribute({ docid: doc.docid })
            .then(({ creator, create_time, modified }) => {
                let { editor } = doc

                if (isUserId(creator)) {
                    creator = __('未知用户');
                }
                if (isUserId(editor)) {
                    editor = __('未知用户');
                }

                // 文件夹的修改者，采用doc对象的editor
                let attributes = {
                    creator,
                    create_time,
                    modified,
                    editor
                }
                this.setState({ attributes });
            });
    }

    /**
     * 根据文件密级获取对应的密级字符
     * @param csflevel 文件密级
     */
    protected convertWithCsfToCsfText(csflevel: number): string {
        // 对接时代亿信标密系统不显示文件密级
        if (this.state.csfSysId === CSFSYSID.SDYX) {
            return '---';
        } else {
            return csflevel ? this.state.csfTextArray[csflevel - 5] : '---';
        }
    }

    /**
     * 获取第三方标密系统整合配置
     */
    private getThirdCsfConfig() {
        return getConfig('third_csfsys_config').then(thirdCsfConfig => {
            // 整合第三方标密系统
            if (thirdCsfConfig) {
                this.setState({ csfSysId: thirdCsfConfig.id })
            } else {
                this.setState({ csfSysId: '' })
            }
        })
    }

    /**
     * 系统密级从低到高排序
     */
    private sortSecu(obj) {
        return pairs(obj).sort(function (a, b) {
            return a[1] - b[1];
        }).map(([text]) => {
            return text
        })
    }

    /**
     * 获取密级枚举信息
     */
    private getCsfLevels() {
        return getConfig('csf_level_enum').then(csf_level_enum => {
            this.setState({
                csfTextArray: this.sortSecu(csf_level_enum)
            })
        })
    }

    /**
     * 获取文件密级详情
     */
    private getFileCsfDetails(doc: Core.Docs.Doc) {
        if (isDir(doc)) {
            this.setState({ csfDetailsBtnShow: false });
        } else {
            this.getThirdCsfConfig().then(() => {
                // 对接中编办或者8511
                if (this.state.csfSysId === CSFSYSID.SDYX || this.state.csfSysId === CSFSYSID['706']) {
                    this.setState({ csfDetailsBtnShow: true });

                    return getAppmetadata({ docid: doc.docid, appid: this.state.csfSysId }).then(res => {
                        res.length && JSON.parse(res[0].appmetadata).classification_info ?
                            this.setState({ csfIsNull: false })
                            :
                            this.setState({ csfIsNull: true })
                    })
                } else {
                    this.setState({ csfDetailsBtnShow: false });
                }
            });
        }
    }

    /**
     * 获取锁定者
     */
    private getLockInfo(doc: Core.Docs.Doc) {
        if (!isDir(doc)) {
            getLockInfo({ docid: doc.docid }).then(lockInfo => {
                if (lockInfo && lockInfo.islocked) {
                    this.setState({
                        lockername: lockInfo.lockername
                    })
                }
            })
        }
    }

    /**
     * 点击“密级详情”按钮
     */
    protected triggerCsfDetails(platform: 'client' | 'desktop') {
        if (platform === 'client') {
            // client
        } else {
            this.setState({
                csfBtnStatus: CSFBtnStatus.CsfDetails
            })
        }
    }

    /**
     * 点击“查看大小”按钮
     */
    protected triggerViewSize() {
        isFunction(this.props.doViewSize) && this.props.doViewSize(this.props.docs)
    }

    /**
     * 点击 ‘密级设置’ 按钮
     */
    protected triggerCsfEditor(platform: 'client' | 'desktop') {
        if (platform === 'client') {
            isFunction(this.props.doEditCSF) && this.props.doEditCSF(this.props.docs)
        } else {
            this.setState({
                csfBtnStatus: CSFBtnStatus.CsfEditor
            })
        }
    }

    private getSize(docs) {
        if (docs && docs.length === 1 && !isDir(docs[0])) {
            this.setState({
                size: docs[0].size
            })
        } else {
            this.setState({
                size: some(docs, doc => isNumber(doc._size)) ? reduce(docs, (pre, cur) => { return pre + cur._size }, 0) : null
            })
        }
    }

    /**
     * 改密审核跳转至审核管理(pc侧边栏)
     */
    protected async doApprovalCheck() {
        const { userid, tokenid, locale } = getOpenAPIConfig(['host', 'userid', 'tokenid', 'locale']);

        openUrlByChrome({ url: await buildWebClientURI({ path: '/login', query: { userid, tokenid, redirect: '/home/approvals/share-review', lang: locale, platform: 'pc' } }) });

    }

    /**
     * 更新侧边栏密级
     */
    protected updateCsflevel(csflevel: number) {
        if (this.state.attributes.csflevel !== csflevel) {
            this.setState({
                attributes: {
                    ...this.state.attributes,
                    csflevel
                },
                csfBtnStatus: CSFBtnStatus.None
            })
        } else {
            this.setState({
                csfBtnStatus: CSFBtnStatus.None
            })
        }
    }
}