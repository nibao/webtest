import * as React from 'react';
import { pick, noop } from 'lodash';
import { convertPath, attribute as getDocAttribute } from '../../core/apis/efshttp/file/file';
import { get as getUser } from '../../core/apis/eachttp/user/user';
import { getConfig, getOEMConfig } from '../../core/config/config';
import { getDocType } from '../../core/apis/eachttp/entrydoc/entrydoc';
import { set as setOwners, check } from '../../core/apis/eachttp/owner/owner';
import { set as setPerms, getInternalLinkTemplate } from '../../core/apis/eachttp/perm/perm';
import { isDir } from '../../core/docs/docs';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { calcGNSLevel } from '../../core/entrydoc/entrydoc';
import { getPermConfigs, formatterNewPermConfigs, getInternalTemplate, getDisabledOptions, getCsflevelText, getEndTime, Status, checkDingMiShare, checkUserdocAndGroupdocShare } from '../../core/permission/permission'
import { CSFSYSID, getCsfLevels } from '../../core/csf/csf';
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import WebComponent from '../webcomponent';
import __ from './locale';

export default class ShareBase extends WebComponent<Components.Share.Props, any> {

    static defaultProps = {
        doc: null,

        doApvJump: noop,

        onResize: noop,

        onCloseDialog: noop,

        onRealNameRequired: noop,

        swf: '/libs/zeroclipboard/dist/ZeroClipboard.swf'
    }

    state: Components.Share.State = {
        showShare: false,

        apvCase: false,

        secretMode: false,

        copySuccess: false,

        permConfigs: [],

        disabledOptions: 0,

        showAdderVisitor: false,

        permissionEdited: false,

        open: false,

        showLoading: false,

        displayErrCode: Status.Normal,

        showPermDetail: false,

        showCSF: false,

        showCSFTipDialog: false,

        csfTextArray: []
    }


    showAdderVisitorWindow: UI.NWWindow.NWWindow;

    secretModeWindow: UI.NWWindow.NWWindow;

    apvCaseWindow: UI.NWWindow.NWWindow;

    errCodeWindow: UI.NWWindow.NWWindow;



    csflevelText: string = '';   // 文件密级

    csflevel: number;

    filePath: string = '';       // 选中文档路径

    secretMode: boolean = false;

    template: Core.Permission.Template;    // 内链模板

    doctype: string = '';

    newLinkTemplate: any = null;       // 最新的模板

    filePathMobile: string = ''        // mobile 文件路径

    doc: Core.Docs.Doc

    componentWillMount() {
        const doc = this.props.doc

        if (doc) {
            this.checkAllShareConfig(doc)

            this.doc = doc

            this.setState({
                showLoading: true
            })
        }
    }


    /**
     * 检测
     * （1） 账号是否被冻结
     * （2） 个人文档、群组文档是否允许权限配置
     * （3） 8511未标密文件是否允许开启权限配置
     * （4） 是否所有者 
     */
    protected async checkAllShareConfig(doc: Core.Docs.Doc) {

        try {
            // 检测账号是否被冻结
            const { freezestatus } = await getUser({})

            if (freezestatus === true) {
                // 账号被冻结
                this.setState({
                    displayErrCode: Status.FreezedUser
                })
            } else {
                // 个人文档、群组文档是否允许权限配置
                const { notAllowShareUserdoc, notAllowShareGroupdoc } = await checkUserdocAndGroupdocShare(doc)

                if (notAllowShareUserdoc) {
                    // 个人文档 不允许权限配置
                    this.setState({
                        displayErrCode: ErrorCode.PersonalShareUnauthorized
                    })
                } else if (notAllowShareGroupdoc) {
                    // 群组文档 不允许权限配置
                    this.setState({
                        displayErrCode: ErrorCode.GroupShareUnauthorized
                    })
                } else {
                    // 8511未标密文件是否允许开启权限配置
                    const dingmiShare = await checkDingMiShare(doc)

                    if (!dingmiShare) {
                        // 8511未标密文件不允许开启权限配置
                        this.setState({
                            displayErrCode: Status.NoCsf
                        })
                    } else {
                        const { isowner } = await check({ docid: doc.docid })

                        if (!isowner) {
                            // 非所有者
                            this.setState({
                                displayErrCode: Status.NotOwner
                            })
                        }
                    }
                }
            }

            this.initPermConfig(doc)
        }

        catch (err) {
            this.setState({
                errCode: err.errcode,
                showLoading: false
            })
        }
    }

    /**
     * 初始化
     */
    private async initPermConfig(doc: Core.Docs.Doc) {
        const docid = doc.docid;

        try {
            // 检查所有者权限， 转换当前文档路径
            const [{ namepath }, prefix] = await Promise.all([
                convertPath({ docid }),
                getConfig('internal_link_prefix')
            ])

            this.filePath = prefix + namepath;

            this.filePathMobile = 'AnyShare://' + namepath

            // this.state.displayErrCode不存在, 获取模板、权限信息
            if (!this.state.displayErrCode) {
                if (calcGNSLevel(docid) !== 1) {
                    // 不是顶级目录， 获取文件密级
                    const { csflevel } = await getDocAttribute({ docid: docid })

                    this.csflevel = csflevel;
                }
                // 获取内链模板,文档类型
                Promise.all([
                    getInternalTemplate(),
                    getDocType({ docid }),
                    getConfig('enable_secret_mode'),
                    getConfig('oemconfig')
                ])
                    .then(async ([
                        template,
                        { doctype },
                        secretMode,
                        { enableshareaudit }
                    ]) => {
                        this.template = template;
                        this.doctype = doctype;
                        this.secretMode = secretMode;

                        if (secretMode && !enableshareaudit) {
                            const customeApplicationConfig = await getConfig('custome_application_config')

                            if (customeApplicationConfig && customeApplicationConfig.appid === 'INSTITUTE707') {
                                // 707研究所 权限配置 ，用户后面加上密级
                                // 前提条件：开启控制该功能的后台开关（此开关在其他时候都默认关闭），且开启涉密模式，且不开启共享审核机制
                                this.setState({
                                    csfTextArray: await getCsfLevels(),
                                    showCSF: true
                                })
                            }
                        }

                        // 获取permConfigs，disabledOpions,secretMode
                        Promise.all([
                            getPermConfigs({ docid }, this.template, doctype, this.secretMode),
                            getDisabledOptions({ docid }),
                        ]).then(([datas, disabledOptions]) => {
                            // 转换路径
                            Promise.all(
                                datas.map((info) => {
                                    if (info.inheritpath === '') {
                                        return { ...info, namepath: __('当前文档') }
                                    }
                                    return convertPath({ docid: info.inheritpath })
                                        .then(({ namepath }) => {
                                            return { ...info, namepath: prefix + namepath }
                                        })
                                })
                            ).then((permConfigs) => {
                                this.setState({
                                    permConfigs,
                                    showShare: true,
                                    disabledOptions,
                                    open: true,
                                    showLoading: false
                                })
                            })
                        })
                    })
            } else {
                this.setState({
                    showShare: true,
                    open: true,
                    showLoading: false
                })
            }
        }
        catch (err) {

            this.setState({
                errCode: err.errcode,
                showLoading: false
            })
        }
    }

    /**
     * 切换VisitorAdder是否显示
     */
    protected toggleVisitorAdderVisible(flag: boolean): void {
        this.setState({
            showAdderVisitor: flag
        })
    }

    /**
     * 添加访问者
     */
    protected addPermConfig(visitors: ReadonlyArray<any>, plarform?: string) {
        this.setState({
            permissionEdited: true
        })

        const permConfigs: ReadonlyArray<Core.Permission.PermConfig> = formatterNewPermConfigs(this.doctype, visitors, this.template, this.secretMode)

        let currentUserId = getOpenAPIConfig('userid');

        const newPermConfigs = permConfigs.reduce((prevs, data) => {
            // 添加的是当前用户，加粗，不会添加一条新纪录
            if (data.accessorid === currentUserId) {
                return prevs.map((perm) => {
                    if (perm.accessorid === currentUserId) {
                        return { ...perm, isNewAdded: true }
                    }
                    return perm;
                })
            }
            if (prevs.find((permConfig) => (permConfig.accessorid + permConfig.inheritpath) === (data.accessorid + data.inheritpath))) {
                // key相等，加粗，不会添加一条新纪录
                return prevs.map((perm) => {
                    if ((perm.accessorid + perm.inheritpath) === (data.accessorid + data.inheritpath)) {
                        return { ...perm, isNewAdded: true }
                    }
                    return perm;
                })

            } else {
                // 加粗，添加一条新纪录
                return [{ ...data, isNewAdded: true }, ...prevs]
            }
        }, this.state.permConfigs)

        this.setState({
            permConfigs: newPermConfigs
        })
    }

    /**
     * 设置权限
     */
    protected setPermissions(doc: Core.Docs.Doc = this.doc, platform?: string): void {
        this.setState({
            showLoading: true
        })

        const userconfigs = this.state.permConfigs.filter((config) => config.isowner)
            .map(({ inheritpath, accessorid }) => {
                return {
                    inheritpath,
                    userid: accessorid
                }
            })

        const permconfigs = this.state.permConfigs.filter((config) => !config.isowner);
        const newPermConfigs = this.splitData(permconfigs)
            .map((perm) => pick(perm, 'isallowed', 'permvalue', 'accessorid', 'accessortype', 'endtime', 'inheritpath'))

        // 获取最新模板
        getInternalLinkTemplate({}).then((template) => {
            Promise.all([
                setPerms({ docid: doc.docid, permconfigs: newPermConfigs }),
                setOwners({ docid: doc.docid, userconfigs }),
            ]).then(([{ result: permResult }, { result: ownerResult }]) => {
                this.setState({
                    showLoading: false
                })

                if (permResult === 1 || ownerResult === 1) {
                    // ”提交审核“提示
                    this.setState({
                        showShare: false
                    })
                    this.toggleApvCaseDialog(true);
                } else {
                    // 权限配置成功
                    if (platform === 'mobile') {
                        // mobile
                        this.handleCloseMobile()

                        // 如果添加的访问者中存在部门或组织弹出 部分用户密级不足，已过滤相关高密级文件
                        if (this.state.showCSF && newPermConfigs.some(({ accessortype }) => accessortype === 'department' || accessortype === 'contactor')) {
                            this.setState({
                                showCSFTipDialog: true
                            })
                        }

                    } else {
                        this.props.onCloseDialog()
                    }

                }
            }, err => {
                this.setState({
                    showLoading: false
                })

                // 未实名认证
                if (err.errcode === 403179 || err.errcode === 403180) {
                    this.props.onCloseDialog()
                } else {
                    this.newLinkTemplate = template;

                    // 与内链模板相关的错误，需要在内链共享大窗口上提示错误，其他的错误需要关闭内链共享大窗口
                    switch (err.errcode) {
                        case Status.OutOfPermission:
                        case Status.OutOfEndTime:
                        case Status.SecretNoPermanent:
                            this.setState({
                                errCode: err.errcode
                            })

                            break

                        default:
                            this.setState({
                                showShare: false,
                                errCode: err.errcode
                            })
                    }
                }
            })
        })
    }
    /**
     * 点击“确定”按钮
     */
    protected confirm(doc: Core.Docs.Doc = this.doc): void {
        if (this.state.displayErrCode) {
            // 点击确定按钮直接关闭
            this.props.onCloseDialog()
            return;
        }
        if (isDir(doc)) {
            this.setPermissions();
        } else {
            Promise.all([getOEMConfig('allowauthlowcsfuser'), getConfig('csf_level_enum'), getConfig('third_csfsys_config')]).then(([allowauthlowcsfuser, csf_level_enum, thirdCsfConfig]) => {
                if (this.secretMode && !allowauthlowcsfuser) {
                    // 涉密模式且不允许给密级低于文件密级的用户配置权限且选中的是文件弹出密级提示
                    if (thirdCsfConfig && thirdCsfConfig.id === CSFSYSID.SDYX) {
                        // 中编办密级显示为‘---’
                        this.csflevelText = '---';
                    }
                    else {
                        this.csflevelText = getCsflevelText(this.csflevel, csf_level_enum);
                    }
                    this.toggleSectedMode(true);
                } else {
                    this.setPermissions();
                }
            })

        }
    }

    /**
     * 关闭ErrorMessages
     */
    handleConfirmError(): void {
        this.setState({
            errCode: null
        })
        this.newLinkTemplate = null;
    }

    /**
     * 切换ApvCaseDialog是否显示
     */
    private toggleApvCaseDialog(flag: boolean): void {
        this.setState({
            apvCase: flag
        })
    }

    /**
     * 切换SecretModeMessage是否显示
     */
    protected toggleSectedMode(flag: boolean): void {
        this.setState({
            secretMode: flag
        })
    }

    /**
     * 复制链接成功
     */
    protected copyLinkSuccess(): void {
        this.setState({
            copySuccess: true
        });

        setTimeout(() => {
            this.setState({
                copySuccess: false
            })
        }, 3000)
    }

    /**
     * 移除一条权限
     */
    protected removeConfig(key: string): void {
        const permConfigs = this.state.permConfigs.filter((permConfig) => key !== permConfig.accessorid + permConfig.inheritpath);
        this.setState({
            permConfigs,
            permissionEdited: true
        })
    }

    /**
     * 编辑一条权限
     */
    protected editConfig(key: string, config: Core.Permission.PermConfig, newEndtime?: number): void {
        const permConfigs = this.state.permConfigs.map((permConfig) => {
            const endtime = newEndtime ? newEndtime : (config.isowner ? -1 : this.getEndTime(permConfig, config))
            return key === (permConfig.accessorid + permConfig.inheritpath) ?
                {
                    ...config,
                    isNewAdded: true,
                    allowPermanent: (endtime === -1) || (!this.secretMode && config.timeRange.length === 1),
                    endtime,
                }
                : permConfig
        });
        this.setState({
            permConfigs,
            permissionEdited: true
        })
    }

    /**
     * 编辑一条权限时，获取它的有效期
     * （1）从非所有者 --> 所有者, 有效期为永久有效
     *  (2) 从所有者 --> 非所有者, 有效期根据内链模板计算
     * （3）剩余的情况下，有效期为编辑后的有效期
     *  @param oldConfig 编辑前的权限信息
     *  @param newConfig 编辑后的权限信息
     */
    private getEndTime(oldConfig: Core.Permission.PermConfig, newConfig: Core.Permission.PermConfig, { defaultExpireDays, maxExpireDays }: Core.Permission.Template = this.template): number {
        if (newConfig.isowner) {
            // 所有者的有效期为永久有效
            return -1;
        }
        if (oldConfig.isowner) {
            // 由所有者切换到非所有者, 有效期按照模板来
            return defaultExpireDays ? getEndTime(defaultExpireDays) : getEndTime((maxExpireDays > 30) ? 30 : maxExpireDays)
        }
        return newConfig.endtime;
    }

    /**
     * 如果有value:{allow:xx,deny:xx}格式数据，拆分成两条数据
     * @param perminfos 
     */
    private splitData(permConfigs: Array<Core.Permission.PermConfig>): Array<any> {
        return permConfigs.reduce((prevs, perminfo) => {
            if (perminfo.allow && perminfo.deny) {
                let perminfoAllow = { ...perminfo, isallowed: true, permvalue: perminfo.allow };
                let perminfoDeny = { ...perminfo, isallowed: false, permvalue: perminfo.deny };
                return [...prevs, perminfoAllow, perminfoDeny];
            } else {
                let info = {
                    ...perminfo,
                    isallowed: perminfo.allow ? true : false,
                    permvalue: perminfo.allow ? perminfo.allow : perminfo.deny
                };
                return [...prevs, info];
            }
        }, [])
    }

    /**
     * 隐藏Drawer 或者 清空错误码(mobile)
     */
    protected handleCloseMobile() {
        this.setState({
            open: false,
            errCode: undefined
        })
    }

    /**
     * mobile 内链路径全选
     * @param e 
     */
    protected selectAll(e: React.MouseEvent<HTMLInputElement>) {
        e.target.setSelectionRange(0, this.filePath.length)
    }
}