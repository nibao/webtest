import { expect } from 'chai';
import * as perm from '../apis/eachttp/perm/perm';
import * as link from '../apis/efshttp/link/link';
import * as config from '../config/config';
import * as entrydoc from '../apis/eachttp/entrydoc/entrydoc';
import * as file from '../apis/efshttp/file/file';
import * as owner from '../apis/eachttp/owner/owner';
import { CSFSYSID } from '../csf/csf';
import { getErrorMessage } from '../errcode/errcode';
import { ErrorCode } from '../apis/openapi/errorcode';
import { createSandbox, useFakeTimers } from 'sinon';
import { sandboxStub } from '../../libs/test-helper';

import {
    findRelation,
    setShareAllowPerm,
    unsetShareAllowPerm,
    setShareDenyPerm,
    unsetShareDenyPerm,
    SharePermissionOptions,
    SharePermission,
    LinkSharePermissionOptions,
    LinkSharePermission,
    Status,
    ShareType,
    AccessorType,
    accessorType,
    PermCheckResult,
    checkPermItem,
    checkLinkPerm,
    MAX_PERM_VALUE,
    splitPerm,
    calcPerm,
    buildSelectionText,
    buildPermText,
    getInternalTemplate,
    getDisabledOptions,
    displayOwner,
    getSelectionTimeRange,
    getEndTime,
    getCsflevelText,
    getExternalinkTemp,
    checkDingMiShare,
    checkUserdocAndGroupdocShare,
    formatterErrorText,
    formatterName,
    getEndtimeWithTemplate,
    getLinkErrorMessage,
    EmptyLinkPassword,
    LinkReqStatus
}
    from './permission';
import __ from './locale';

describe('ShareWebCore', () => {
    describe('permission', () => {
        const sandbox = createSandbox()
        beforeEach('stub', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: perm,
                    moduleProp: ['check', 'getInternalLinkTemplate', 'getExternalLinkTemplate', 'getShareDocConfig']
                },
                {
                    moduleObj: link,
                    moduleProp: ['checkPerm']
                },
                {
                    moduleObj: config,
                    moduleProp: ['getConfig']
                },
                {
                    moduleObj: entrydoc,
                    moduleProp: ['getDocType']
                },
                {
                    moduleObj: file,
                    moduleProp: ['attribute']
                },
                {
                    moduleObj: owner,
                    moduleProp: ['check']
                }
            ])
        });
        afterEach('resotre', () => {
            sandbox.restore()
        });
        it('导出错误码#Status', () => {
            expect(Status.Normal).to.equal(0);
            expect(Status.ShareBeAudited).to.equal(12);
        });

        it('设置的权限属于哪种情况#ShareType', () => {
            expect(ShareType.ALLOW).to.equal(0)
            expect(ShareType.DENY).to.equal(1)
            expect(ShareType.OWNER).to.equal(2)
        });

        it('访问者类型#AccessorType', () => {
            expect(AccessorType.USER).to.equal(0)
            expect(AccessorType.DEPARTMENT).to.equal(1)
            expect(AccessorType.CONTACTOR).to.equal(2)
        });

        it('访问者类型#accessorType', () => {
            expect(accessorType[AccessorType.USER]).to.equal('user')
            expect(accessorType[AccessorType.DEPARTMENT]).to.equal('department')
            expect(accessorType[AccessorType.CONTACTOR]).to.equal('contactor')
        });

        it('内链权限#SharePermission', () => {
            expect(SharePermission.DISPLAY).to.equal(1)
            expect(SharePermission.DOWNLOAD).to.equal(4)
            expect(SharePermission.COPY).to.equal(64)
        });

        it('外链权限#LinkSharePermisson', () => {
            expect(LinkSharePermission.PREVIEW).to.equal(1)
            expect(LinkSharePermission.DOWNLOAD).to.equal(2)
            expect(LinkSharePermission.UPLOAD).to.equal(4)
        });

        it('权限检查结果#PermCheckResult', () => {
            expect(PermCheckResult.OK).to.equal(0)
            expect(PermCheckResult.UNSET).to.equal(1)
            expect(PermCheckResult.REJECTED).to.equal(2)
        });

        describe('检查是否有某项配置权限#checkPermItem', () => {
            it('当前权限未定义，返回false', async () => {
                perm.check.resolves({ result: 1 })
                expect(await checkPermItem('gns://docid', SharePermission.DOWNLOAD, 'dd39e189-4e67-4422-af9f-19c71849ebf3')).to.be.false
            });

            it('无对应权限，返回false', async () => {
                perm.check.resolves({ result: 2 })
                expect(await checkPermItem('gns://docid', SharePermission.PREVIEW, 'dd39e189-4e67-4422-af9f-19c71849ebf3')).to.be.false
            });

            it('有对应权限，返回true', async () => {
                perm.check.resolves({ result: 0 })
                expect(await checkPermItem('gns://docid', SharePermission.COPY, 'dd39e189-4e67-4422-af9f-19c71849ebf3')).to.be.true
            });

        });

        describe('检查外链权限#checkLinkPerm', () => {
            it('无权限，返回0', async () => {
                link.checkPerm.resolves({ result: 0 })
                expect(await checkLinkPerm({ link: 'link', password: '7555', perm: LinkSharePermission.DOWNLOAD })).to.be.equal(0)
            });

            it('有权限，返回1', async () => {
                link.checkPerm.resolves({ result: 1 })
                expect(await checkLinkPerm({ link: 'link', password: '7555', perm: LinkSharePermission.PREVIEW })).to.be.equal(1)
            });
        });

        it('原子权限#SharePermissionOptions', () => {
            SharePermissionOptions.forEach(option => {
                const { value, require } = option;
                switch (value) {
                    case SharePermission.DISPLAY:
                        expect(require).to.equal(0)
                        break;
                    case SharePermission.PREVIEW:
                        expect(require).to.equal(SharePermission.DISPLAY)
                        break;
                    case SharePermission.DOWNLOAD:
                        expect(require).to.equal(SharePermission.DISPLAY | SharePermission.PREVIEW)
                        break;
                    case SharePermission.COPY:
                        expect(require).to.equal(SharePermission.DISPLAY | SharePermission.PREVIEW | SharePermission.DOWNLOAD)
                        break;
                    case SharePermission.MODIFY:
                        expect(require).to.equal(SharePermission.DISPLAY | SharePermission.PREVIEW | SharePermission.DOWNLOAD)
                        break;
                    case SharePermission.CREATE:
                        expect(require).to.equal(SharePermission.DISPLAY)
                        break;
                    case SharePermission.DELETE:
                        expect(require).to.equal(SharePermission.DISPLAY)
                        break;
                    default:
                        break;
                }
            })
        });

        it('外链原子权限#LinkSharePermissionOptions', () => {
            LinkSharePermissionOptions.forEach(options => {
                const { value, require } = options;
                switch (value) {
                    case LinkSharePermission.PREVIEW:
                        expect(require).to.equal(0)
                        break;
                    case LinkSharePermission.DOWNLOAD:
                        expect(require).to.equal(LinkSharePermission.PREVIEW)
                        break;
                    case LinkSharePermission.UPLOAD:
                        expect(require).to.equal(0)
                        break;
                    default:
                        break;
                }
            })
        });

        it('最大允许权限值#MAX_PERM_VALUE', () => {
            const sum = SharePermissionOptions.reduce((result, current) => {
                return result += current.value
            }, 0)
            expect(MAX_PERM_VALUE).to.equal(sum)
        });

        it('将一个权限值拆分为一个权限原子类，以对象表示#splitPerm', () => {
            expect(splitPerm(1)).to.deep.equal({
                [SharePermission.DISPLAY]: true,
                [SharePermission.PREVIEW]: false,
                [SharePermission.DOWNLOAD]: false,
                [SharePermission.CREATE]: false,
                [SharePermission.MODIFY]: false,
                [SharePermission.DELETE]: false,
                [SharePermission.COPY]: false,
            })

            expect(splitPerm(3)).to.deep.equal({
                [SharePermission.DISPLAY]: true,
                [SharePermission.PREVIEW]: true,
                [SharePermission.DOWNLOAD]: false,
                [SharePermission.CREATE]: false,
                [SharePermission.MODIFY]: false,
                [SharePermission.DELETE]: false,
                [SharePermission.COPY]: false,
            })

            expect(splitPerm(11)).to.deep.equal({
                [SharePermission.DISPLAY]: true,
                [SharePermission.PREVIEW]: true,
                [SharePermission.DOWNLOAD]: false,
                [SharePermission.CREATE]: true,
                [SharePermission.MODIFY]: false,
                [SharePermission.DELETE]: false,
                [SharePermission.COPY]: false,
            })
        });

        it('计算高级权限配置最终的权限加值#calcPerm', () => {
            expect(calcPerm()).to.be.undefined

            expect(calcPerm({
                [SharePermission.DISPLAY]: false,
                [SharePermission.PREVIEW]: false,
                [SharePermission.DOWNLOAD]: false,
                [SharePermission.CREATE]: false,
                [SharePermission.MODIFY]: false,
                [SharePermission.DELETE]: false,
                [SharePermission.COPY]: false,
            })).to.equal(undefined)

            expect(calcPerm({
                [SharePermission.DISPLAY]: true,
                [SharePermission.PREVIEW]: false,
                [SharePermission.DOWNLOAD]: false,
                [SharePermission.CREATE]: false,
                [SharePermission.MODIFY]: false,
                [SharePermission.DELETE]: false,
                [SharePermission.COPY]: false,
            })).to.equal(1)

            expect(calcPerm({
                [SharePermission.DISPLAY]: true,
                [SharePermission.PREVIEW]: false,
                [SharePermission.DOWNLOAD]: false,
                [SharePermission.CREATE]: true,
                [SharePermission.MODIFY]: false,
                [SharePermission.DELETE]: true,
                [SharePermission.COPY]: false,
            })).to.equal(41)
        });

        describe('构建权限值对应的语句描述#buildSelectionText', () => {
            it('为所有者,返回"所有者"', () => {
                expect(buildSelectionText(SharePermissionOptions, { allow: 1, isowner: true })).to.equal(__('所有者'))
            });

            it('所有权限都被拒绝,返回"拒绝访问"', () => {
                expect(buildSelectionText(SharePermissionOptions, { allow: 1, deny: 1, isowner: false }, 1)).to.equal(__('拒绝访问'))
                expect(buildSelectionText(SharePermissionOptions, { allow: 1, deny: 7, isowner: false }, 7)).to.equal(__('拒绝访问'))
            });

            it('没有拒绝权限', () => {
                expect(buildSelectionText(SharePermissionOptions, { allow: 7, isowner: false })).to.equal(`${__('显示')}/${__('预览')}/${__('下载')}`)
                expect(buildSelectionText(SharePermissionOptions, { allow: 11, isowner: false })).to.equal(`${__('显示')}/${__('预览')}/${__('新建')}`)
                expect(buildSelectionText(SharePermissionOptions, { allow: 21, isowner: false })).to.equal(`${__('显示')}/${__('下载')}/${__('修改')}`)
            });

            /* 在具体的场景中不会出现某个权限既被允许又被拒绝的情况,因为界面上勾选框具有关联关系 */
            it('部分权限被拒绝', () => {
                expect(buildSelectionText(SharePermissionOptions, { allow: 7, deny: 11, isowner: false })).to.equal(`${__('显示')}/${__('预览')}/${__('下载')} (${__('拒绝 ')}${__('显示')}/${__('预览')}/${__('新建')})`)
            });
        });

        describe('构建权限值(mobile使用)#buildPermText', () => {

            it('所有权限都被拒绝', () => {
                expect(buildPermText(SharePermissionOptions, { allow: 1, deny: 1, isowner: false }, 1)).to.deep.equal({
                    allowText: '',
                    denyText: __('拒绝访问')
                })
                expect(buildPermText(SharePermissionOptions, { allow: 1, deny: 7, isowner: false }, 7)).to.deep.equal({
                    allowText: '',
                    denyText: __('拒绝访问')
                })
            });

            it('没有拒绝权限', () => {
                expect(buildPermText(SharePermissionOptions, { allow: 7, isowner: false })).to.deep.equal({
                    allowText: `${__('显示')}/${__('预览')}/${__('下载')}`,
                    denyText: ''
                })

                expect(buildPermText(SharePermissionOptions, { allow: 11, isowner: false })).to.deep.equal({
                    allowText: `${__('显示')}/${__('预览')}/${__('新建')}`,
                    denyText: ''
                })

                expect(buildPermText(SharePermissionOptions, { allow: 21, isowner: false })).to.deep.equal({
                    allowText: `${__('显示')}/${__('下载')}/${__('修改')}`,
                    denyText: ''
                })
            });

            /* 在具体的场景中不会出现某个权限既被允许又被拒绝的情况,因为界面上勾选框具有关联关系 */
            it('部分权限被拒绝', () => {
                expect(buildPermText(SharePermissionOptions, { allow: 7, deny: 11, isowner: false })).to.deep.equal({
                    allowText: `${__('显示')}/${__('预览')}/${__('下载')}`,
                    denyText: `${__('显示')}/${__('预览')}/${__('新建')}`
                })
            });
        });

        describe('计算权限依赖关系#findRelation', () => {

            it('计算内链权限依赖', () => {
                expect(findRelation(SharePermissionOptions, SharePermission.DISPLAY)).to.deep.equal([0, 126]);
                expect(findRelation(SharePermissionOptions, SharePermission.DOWNLOAD)).to.deep.equal([3, 80]);
            });

            it('计算外链权限依赖', () => {
                expect(findRelation(LinkSharePermissionOptions, LinkSharePermission.PREVIEW)).to.deep.equal([0, 2]);
                expect(findRelation(LinkSharePermissionOptions, LinkSharePermission.DOWNLOAD)).to.deep.equal([1, 0]);
            });

        });

        describe('设置权限共享允许权限#setShareAllowPerm', () => {

            it('设置允许权限', () => {
                expect(setShareAllowPerm({ allow: 0 }, SharePermission.DOWNLOAD)).to.deep.equal({ allow: 7 });
                expect(setShareAllowPerm({ allow: 0, isowner: true }, SharePermission.DOWNLOAD)).to.deep.equal({ allow: 7, isowner: true });
                expect(setShareAllowPerm({ isowner: true, allow: 0, deny: 127 }, SharePermission.DOWNLOAD)).to.deep.equal({ isowner: true, allow: 7, deny: 120 });
            });

        });


        describe('取消设置允许权限#unsetShareAllowPerm', () => {

            it('取消设置允许权限', () => {
                expect(unsetShareAllowPerm({ allow: 71 }, SharePermission.DISPLAY)).to.deep.equal({ allow: 0 });
                expect(unsetShareAllowPerm({ allow: 71, deny: 56 }, SharePermission.DISPLAY)).to.deep.equal({ allow: 0, deny: 56 });
                expect(unsetShareAllowPerm({ isowner: true, allow: 71, deny: 56 }, SharePermission.DISPLAY)).to.deep.equal({ isowner: true, allow: 0, deny: 56 });
                expect(unsetShareAllowPerm({ isowner: true, allow: 71, deny: 56 }, SharePermission.COPY)).to.deep.equal({ isowner: true, allow: 7, deny: 56 });
            });

        });


        describe('设置拒绝权限#setShareDenyPerm', () => {

            it('设置拒绝权限', () => {
                expect(setShareDenyPerm({ deny: 0 }, SharePermission.DISPLAY)).to.deep.equal({ deny: 127 });
                expect(setShareDenyPerm({ allow: 127, deny: 0 }, SharePermission.DISPLAY)).to.deep.equal({ allow: 0, deny: 127 });
                expect(setShareDenyPerm({ isowner: true, allow: 127, deny: 0 }, SharePermission.DISPLAY)).to.deep.equal({ isowner: true, allow: 0, deny: 127 });
            });

        });


        describe('取消拒绝权限#unsetShareDenyPerm', () => {

            it('取消拒绝权限', () => {
                expect(unsetShareDenyPerm({ deny: 127 }, SharePermission.DISPLAY)).to.deep.equal({ deny: 126 });
                expect(unsetShareDenyPerm({ allow: 0, deny: 127 }, SharePermission.DISPLAY)).to.deep.equal({ allow: 0, deny: 126 });
                expect(unsetShareDenyPerm({ isowner: true, allow: 0, deny: 127 }, SharePermission.DISPLAY)).to.deep.equal({ isowner: true, allow: 0, deny: 126 });
                expect(unsetShareDenyPerm({ isowner: true, allow: 0, deny: 127 }, SharePermission.COPY)).to.deep.equal({ isowner: true, allow: 0, deny: 56 });
            });

        });

        describe('获取内链模板#getInternalTemplate', () => {
            it('数据库中配置字段允许设置所有者，模板允许设置所有者', async () => {
                perm.getInternalLinkTemplate.resolves({
                    allowperm: 10,
                    allowowner: true,
                    defaultperm: 10,
                    defaultowner: false,
                    limitexpiredays: true,
                    allowexpiredays: -1
                })
                config.getConfig.resolves({ allowowner: true, indefiniteperm: false })
                expect(await getInternalTemplate()).to.include({ allowOwner: true })
            });

            it('数据库中配置字段允许设置所有者，模板不允许设置所有者', async () => {
                perm.getInternalLinkTemplate.resolves({
                    allowperm: 10,
                    allowowner: false,
                    defaultperm: 10,
                    defaultowner: false,
                    limitexpiredays: true,
                    allowexpiredays: -1
                })
                config.getConfig.resolves({ allowowner: true, indefiniteperm: false })
                expect(await getInternalTemplate()).to.include({ allowOwner: false })
            });

            it('数据库中配置字段不允许设置所有者，模板允许设置所有者', async () => {
                perm.getInternalLinkTemplate.resolves({
                    allowperm: 10,
                    allowowner: true,
                    defaultperm: 10,
                    defaultowner: false,
                    limitexpiredays: true,
                    allowexpiredays: -1
                })
                config.getConfig.resolves({ allowowner: false, indefiniteperm: false })
                expect(await getInternalTemplate()).to.include({ allowOwner: false })
            });

            it('数据库中配置字段不允许设置所有者，模板不允许设置所有者', async () => {
                perm.getInternalLinkTemplate.resolves({
                    allowperm: 10,
                    allowowner: false,
                    defaultperm: 10,
                    defaultowner: false,
                    limitexpiredays: true,
                    allowexpiredays: -1
                })
                config.getConfig.resolves({ allowowner: false, indefiniteperm: false })
                expect(await getInternalTemplate()).to.include({ allowOwner: false })
            });

            it('数据库中配置字段允许设置永久有效，模板允许设置永久有效', async () => {
                perm.getInternalLinkTemplate.resolves({
                    allowperm: 10,
                    allowowner: false,
                    defaultperm: 10,
                    defaultowner: false,
                    limitexpiredays: false,
                    allowexpiredays: -1
                })
                config.getConfig.resolves({ allowowner: false, indefiniteperm: true })
                expect(await getInternalTemplate()).to.include({ validExpireDays: false, defaultExpireDays: -1, maxExpireDays: null })
            });

            it('数据库中配置字段允许设置永久有效，模板不允许设置永久有效', async () => {
                perm.getInternalLinkTemplate.resolves({
                    allowperm: 10,
                    allowowner: false,
                    defaultperm: 10,
                    defaultowner: false,
                    limitexpiredays: true,
                    allowexpiredays: 30
                })
                config.getConfig.resolves({ allowowner: false, indefiniteperm: true })
                expect(await getInternalTemplate()).to.include({ validExpireDays: true, defaultExpireDays: null, maxExpireDays: 30 })
            });

            it('数据库中配置字段不允许设置永久有效，模板不允许设置永久有效，模板中默认天数为不限时', async () => {
                perm.getInternalLinkTemplate.resolves({
                    allowperm: 10,
                    allowowner: false,
                    defaultperm: 10,
                    defaultowner: false,
                    limitexpiredays: false,
                    allowexpiredays: -1
                })
                config.getConfig.resolves({ allowowner: false, indefiniteperm: false })
                const today = new Date()
                expect(await getInternalTemplate()).to.include({
                    validExpireDays: true,
                    defaultExpireDays: 30,
                    maxExpireDays: (new Date((today.getFullYear() + 5), 11, 31).getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / (3600 * 24 * 1000)
                })
            });

            it('数据库中配置字段不允许设置永久有效，模板不允许设置永久有效，模板中默认天数为限制时', async () => {
                perm.getInternalLinkTemplate.resolves({
                    allowperm: 10,
                    allowowner: false,
                    defaultperm: 10,
                    defaultowner: false,
                    limitexpiredays: false,
                    allowexpiredays: 29
                })
                config.getConfig.resolves({ allowowner: false, indefiniteperm: false })
                const today = new Date()
                expect(await getInternalTemplate()).to.include({
                    validExpireDays: true,
                    defaultExpireDays: 29,
                    maxExpireDays: (new Date((today.getFullYear() + 5), 11, 31).getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / (3600 * 24 * 1000)
                })
            })

        });

        describe('获取内链的disabledOptions#getDisabledOptions', () => {
            it('是归档库，禁用修改权限和删除权限', async () => {
                entrydoc.getDocType.resolves({ doctype: 'archivedoc' })
                expect(await getDisabledOptions({ docid: 'gns://archivedoc' })).equal(SharePermission.MODIFY | SharePermission.DELETE)
            });

            it('不是归档库，不禁用权限', async () => {
                entrydoc.getDocType.resolves({ doctype: 'userdoc' })
                expect(await getDisabledOptions({ docid: 'gns://archivedoc' })).equal(0)
            });
        });

        describe('获取permConfigs#getPermConfigs', () => {
            // TODO:
        });

        it('按照内链模板添加一条权限信息#formatterNewPermConfigs');

        describe('判断是否显示所有者#displayOwner', () => {
            it('如果是涉密模式，不显示所有者选项', () => {
                expect(displayOwner('userdoc', false, 'user', true)).to.be.false
                expect(displayOwner('groupdoc', true, 'contactor', true)).to.be.false
                expect(displayOwner('customdoc', false, 'department', true)).to.be.false
            });

            it('非涉密模式，当前所在是个人文档，不显示所有者', () => {
                expect(displayOwner('userdoc', true, 'user', false)).to.be.false
                expect(displayOwner('userdoc', false, 'user', false)).to.be.false
            });

            it('非涉密模式，当前访问者是部门，不显示所有者', () => {
                expect(displayOwner('customdoc', true, 'department', false)).to.be.false
                expect(displayOwner('customdoc', false, 'department', false)).to.be.false
            });

            it('非涉密模式，当前访问者是联系人组，不显示所有者', () => {
                expect(displayOwner('customdoc', true, 'contactor', false)).to.be.false
                expect(displayOwner('grounpdoc', false, 'contactor', false)).to.be.false
            });

            it('非涉密模式，不允许所有者，不显示所有者', () => {
                expect(displayOwner('userdoc', false, 'contactor', false)).to.be.false
                expect(displayOwner('grounpdoc', false, 'contactor', false)).to.be.false
            });


            it('其他，显示所有者', () => {
                expect(displayOwner('customdoc', true, 'user', false)).to.be.true
                expect(displayOwner('grounpdoc', true, 'user', false)).to.be.true
            });

        });

        it('获取从今天开始到daysNumber天之后的时间选择范围数组#getSelectionTimeRange', () => {
            const clock = useFakeTimers(new Date(2018, 4, 21))
            expect(getSelectionTimeRange()).to.deep.equal([new Date()])
            expect(getSelectionTimeRange(10)).to.deep.equal([new Date(), new Date(2018, 4, 21 + 10)])
            clock.restore()
        });

        it('获取days之后的时间戳, 单位是 毫秒 * 1000#getEndTime', () => {
            const clock = useFakeTimers(new Date(2018, 4, 21))
            expect(getEndTime(-1)).to.equal(-1)
            expect(getEndTime(0)).to.equal(new Date(2018, 4, 21, 23, 59, 59).getTime() * 1000)
            expect(getEndTime(10)).to.equal(new Date(2018, 4, 21 + 10, 23, 59, 59).getTime() * 1000)
            clock.restore()
        });

        it('根据csflevel获取对应的密级#getCsflevelText', () => {
            const csf_level_enum = {
                '内部': 6,
                '机密': 8,
                '秘密': 7,
                '绝密': 9,
                '非密': 5
            }
            expect(getCsflevelText(5, csf_level_enum)).to.equal('非密')
            expect(getCsflevelText(6, csf_level_enum)).to.equal('内部')
        });

        describe('获取外链模板信息#getExternaLinkTemp', () => {
            it('允许永久有效', async () => {
                perm.getExternalLinkTemplate.resolves({
                    limitexpiredays: false,
                    allowexpiredays: 30,
                    allowperm: 1,
                    defaultperm: 1,
                    limitaccesstimes: false,
                    allowaccesstimes: 10,
                    accesspassword: '82829'
                })
                expect(await getExternalinkTemp()).to.deep.equal({
                    allowPerms: 1,
                    defaultPerms: 1,
                    validExpireDays: false,
                    defaultExpireDays: 30,
                    maxExpireDays: null,
                    enforceUseLinkPwd: '82829',
                    limitAccessTime: false,
                    defaultLimitTimes: 10,
                    maxLimitTimes: null
                });
            })

            it('不允许永久有效', async () => {
                perm.getExternalLinkTemplate.resolves({
                    limitexpiredays: true,
                    allowexpiredays: 30,
                    allowperm: 1,
                    defaultperm: 1,
                    limitaccesstimes: false,
                    allowaccesstimes: 10,
                    accesspassword: '82829'
                })
                expect(await getExternalinkTemp()).to.deep.equal({
                    allowPerms: 1,
                    defaultPerms: 1,
                    validExpireDays: true,
                    defaultExpireDays: null,
                    maxExpireDays: 30,
                    enforceUseLinkPwd: '82829',
                    limitAccessTime: false,
                    defaultLimitTimes: 10,
                    maxLimitTimes: null
                });
            });

            it('不限制打开次数', async () => {
                perm.getExternalLinkTemplate.resolves({
                    limitexpiredays: false,
                    allowexpiredays: 30,
                    allowperm: 1,
                    defaultperm: 1,
                    limitaccesstimes: false,
                    allowaccesstimes: 10,
                    accesspassword: '82829'
                })
                expect(await getExternalinkTemp()).to.deep.equal({
                    allowPerms: 1,
                    defaultPerms: 1,
                    validExpireDays: false,
                    defaultExpireDays: 30,
                    maxExpireDays: null,
                    enforceUseLinkPwd: '82829',
                    limitAccessTime: false,
                    defaultLimitTimes: 10,
                    maxLimitTimes: null
                });
            });

            it('限制打开次数', async () => {
                perm.getExternalLinkTemplate.resolves({
                    limitexpiredays: false,
                    allowexpiredays: 30,
                    allowperm: 1,
                    defaultperm: 1,
                    limitaccesstimes: true,
                    allowaccesstimes: 10,
                    accesspassword: '82829'
                })
                expect(await getExternalinkTemp()).to.deep.equal({
                    allowPerms: 1,
                    defaultPerms: 1,
                    validExpireDays: false,
                    defaultExpireDays: 30,
                    maxExpireDays: null,
                    enforceUseLinkPwd: '82829',
                    limitAccessTime: true,
                    defaultLimitTimes: null,
                    maxLimitTimes: 10
                });
            });

        });

        describe('检查 对接8511未标密文件是否允许开启权限配置#checkDingMiShare', () => {
            it('标密系统ID为706,文件密级为空', async () => {
                config.getConfig.withArgs('third_csfsys_config').resolves({ id: CSFSYSID['706'] })
                file.attribute.resolves({ csflevel: 0x7FFF })
                expect(await checkDingMiShare({ docid: '', size: 1 })).to.be.false
            });

            it('标密系统ID为706,文件密级不为空', async () => {
                config.getConfig.withArgs('third_csfsys_config').resolves({ id: CSFSYSID['706'] })
                file.attribute.resolves({ csflevel: 1 })
                expect(await checkDingMiShare({ docid: '', size: 1 })).to.be.true
            });

            it('标密系统ID为706,为文件夹', async () => {
                config.getConfig.withArgs('third_csfsys_config').resolves({ id: CSFSYSID['706'] })
                file.attribute.resolves({ csflevel: 0x7FFF })
                expect(await checkDingMiShare({ docid: '', size: -1 })).to.be.true
            });

            it('标密系统ID不为706，为文件夹', async () => {
                config.getConfig.withArgs('third_csfsys_config').resolves({ id: CSFSYSID['ANYSHARE'] })
                expect(await checkDingMiShare({ docid: '', size: -1 })).to.be.true
            });

            it('标密系统ID不为706，不为文件夹', async () => {
                config.getConfig.withArgs('third_csfsys_config').resolves({ id: CSFSYSID['ANYSHARE'] })
                expect(await checkDingMiShare({ docid: '', size: 1 })).to.be.true
            });
        });

        describe('检查个人文档、群组文档是否允许权限配置#checkUserdocAndGroupdocShare', () => {
            it('个人文档，且不允许个人文档配置权限', async () => {
                entrydoc.getDocType.resolves({ doctype: 'userdoc' })
                perm.getShareDocConfig.resolves({
                    enable_user_doc_inner_link_share: false,
                    enable_group_doc_inner_link_share: false
                })
                expect(await checkUserdocAndGroupdocShare({ docid: '' })).to.deep.equal({
                    notAllowShareUserdoc: true,
                    notAllowShareGroupdoc: false
                })
            });

            it('个人文档，允许个人文档配置权限', async () => {
                entrydoc.getDocType.resolves({ doctype: 'userdoc' })
                perm.getShareDocConfig.resolves({
                    enable_user_doc_inner_link_share: true,
                    enable_group_doc_inner_link_share: false
                })
                expect(await checkUserdocAndGroupdocShare({ docid: '' })).to.deep.equal({
                    notAllowShareUserdoc: false,
                    notAllowShareGroupdoc: false
                })
            });

            it('群组文档，且不允许群组文档配置权限，为所有者', async () => {
                entrydoc.getDocType.resolves({ doctype: 'groupdoc' })
                perm.getShareDocConfig.resolves({
                    enable_user_doc_inner_link_share: true,
                    enable_group_doc_inner_link_share: false
                })
                owner.check.resolves({ isowner: true })
                expect(await checkUserdocAndGroupdocShare({ docid: '' })).to.deep.equal({
                    notAllowShareUserdoc: false,
                    notAllowShareGroupdoc: true
                })
            });

            it('群组文档，不允许群组文档配置权限，不为所有者', async () => {
                entrydoc.getDocType.resolves({ doctype: 'groupdoc' })
                perm.getShareDocConfig.resolves({
                    enable_user_doc_inner_link_share: true,
                    enable_group_doc_inner_link_share: false
                })
                owner.check.resolves({ isowner: false })
                expect(await checkUserdocAndGroupdocShare({ docid: '' })).to.deep.equal({
                    notAllowShareUserdoc: false,
                    notAllowShareGroupdoc: false
                })
            });

            it('群组文档，允许群组文档配置权限', async () => {
                entrydoc.getDocType.resolves({ doctype: 'groupdoc' })
                perm.getShareDocConfig.resolves({
                    enable_user_doc_inner_link_share: true,
                    enable_group_doc_inner_link_share: true
                })
                expect(await checkUserdocAndGroupdocShare({ docid: '' })).to.deep.equal({
                    notAllowShareUserdoc: false,
                    notAllowShareGroupdoc: false
                })
            });

            it('其他文档', async () => {
                entrydoc.getDocType.resolves({ doctype: 'customdoc' })
                perm.getShareDocConfig.resolves({
                    enable_user_doc_inner_link_share: true,
                    enable_group_doc_inner_link_share: true
                })
                expect(await checkUserdocAndGroupdocShare({ docid: '' })).to.deep.equal({
                    notAllowShareUserdoc: false,
                    notAllowShareGroupdoc: false
                })
            });
        });

        it('格式化错误信息#formatterErrorText', () => {
            const fakeDoc = {
                name: 'docname',
                size: 1
            }
            const fakeDir = {
                name: 'dirname',
                size: -1
            }
            const fakeTemplate = {
                allowperm: 1,
                allowexpiredays: 30
            }
            expect(formatterErrorText(Status.NotOwner)).to.equal(__('您不是当前文档的所有者，无法配置权限。'))
            expect(formatterErrorText(Status.LowCsf, fakeDoc)).to.equal(__('你指定的用户密级低于文件 “${docname}” 的密级，您无法对其配置共享。', { docname: fakeDoc.name }))
            expect(formatterErrorText(Status.FileNotExisted, fakeDir)).to.equal(__('文件夹“${docname}”不存在, 可能其所在路径发生变更。', { docname: fakeDir.name }))
            expect(formatterErrorText(Status.FileNotExisted, fakeDoc)).to.equal(__('文件“${docname}”不存在, 可能其所在路径发生变更。', { docname: fakeDoc.name }))
            expect(formatterErrorText(Status.OutOfPermission, fakeDoc, fakeTemplate)).to.equal(__('管理员已限制您可设定的访问权限为“${permission}”。', { permission: __('显示') }))
            expect(formatterErrorText(Status.OutOfEndTime, fakeDoc, fakeTemplate)).to.equal(__('管理员已限制您设定的有效期，不允许超过${days}天。', { days: fakeTemplate.allowexpiredays }))
            expect(formatterErrorText(Status.SecretNoPermanent)).to.equal(__('管理员已限制您设定的有效期，不允许永久有效。'))
            expect(formatterErrorText(Status.FreezedDoc)).to.equal(__('无法执行权限配置，') + getErrorMessage(Status.FreezedDoc))
            expect(formatterErrorText(Status.FreezedUser)).to.equal(__('无法执行权限配置，') + getErrorMessage(Status.FreezedUser))
            expect(formatterErrorText(Status.NoCsf)).to.equal(__('当前文件未定密，不允许共享。'))
            expect(formatterErrorText(ErrorCode.PermModifyDeniedWithGroupCreater)).to.equal(__('不允许对群组文档的创建者配置权限。'))
            expect(formatterErrorText(Status.ShareBeAudited)).to.equal(__('您的共享已提交审核，请登录Web客户端“共享申请”中查看'))
            // 默认情况在getErrorMessage中进行测试
        });

        it('规范化名字#formatterName', () => {
            expect(formatterName('')).to.equal('')
            expect(formatterName('a/b/c.txt')).to.equal('c.txt')
            expect(formatterName('b/c.txt')).to.equal('c.txt')
            expect(formatterName('c.txt')).to.equal('c.txt')
            expect(formatterName('/')).to.equal('')
        });

        describe('mobile，根据模板，获取默认信息#getEndtimeWithTemplate', () => {
            it('涉密模式，不允许持久化', () => {
                expect(getEndtimeWithTemplate({ validExpireDays: false, defaultExpireDays: 10, maxExpireDays: 30 }, true)).to.contain({ allowPermanent: false })
            });

            it('不限制过期时间', () => {
                const clock = useFakeTimers(new Date(2018, 4, 10))
                expect(getEndtimeWithTemplate({ validExpireDays: false, defaultExpireDays: 10, maxExpireDays: 30 }, false)).to.deep.equal({
                    endtime: getEndTime(10),
                    timeRange: [new Date()],
                    defaultSelectDays: 10,
                    allowPermanent: true,
                    minTime: getEndTime(0),
                    maxTime: -1
                })
                clock.restore()
            });

            it('限制过期时间', () => {
                const clock = useFakeTimers(new Date(2018, 4, 10))
                expect(getEndtimeWithTemplate({ validExpireDays: true, defaultExpireDays: 10, maxExpireDays: 30 }, false)).to.deep.equal({
                    endtime: getEndTime(10),
                    timeRange: [new Date(), new Date(2018, 4, 10 + 30)],
                    defaultSelectDays: 10,
                    allowPermanent: false,
                    minTime: getEndTime(0),
                    maxTime: getEndTime(30)
                })
                clock.restore()
            });

        });

        it('外链访问，获取错误码对应的错误信息#getLinkErrorMessage', () => {
            expect(getLinkErrorMessage(ErrorCode.LinkInaccessable)).to.equal(__('该链接地址已失效'))
            expect(getLinkErrorMessage(ErrorCode.LinkVisitExceeded)).to.equal(__('抱歉，该链接的打开次数已达上限'))
            expect(getLinkErrorMessage(ErrorCode.LinkAuthFailed)).to.equal(__('访问密码不正确'))
            expect(getLinkErrorMessage(EmptyLinkPassword)).to.equal(__('访问密码不能为空'))
            expect(getLinkErrorMessage(123)).to.equal('')
        });

        it('导出访问外链的状态#LinkReqStatus', () => {
            expect(LinkReqStatus.Initial).to.equal(0)
            expect(LinkReqStatus.Info).to.equal(1)
            expect(LinkReqStatus.List).to.equal(2)
            expect(LinkReqStatus.PreviewFile).to.equal(3)
            expect(LinkReqStatus.Error).to.equal(4)
        });

        it('判断目录能否被访问或者文件能否被预览#canAccess（逻辑简单，调用内部函数，暂不测）');

        it('导出外链密码输入框为空的错误码', () => {
            expect(EmptyLinkPassword).to.equal(10)
        });

    });
})