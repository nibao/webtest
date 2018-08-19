import { expect } from 'chai'

import {
    clientUploadNames,
    serverUploadName,
    AppNodeStatus,
    PackageStatus,
    Mode,
    OsType,
    testPackageNamePattern,
    ErrorCode,
    ConfirmStatus,
    ServerPackageStatus,
    getRoleName,
    getNodeInfos,
    getErrorMessage,
    getErrorTitleMessage
}
    from './siteupgrade'
import __ from './locale'

describe('ShareWebCore', () => {
    describe('siteupgrade', () => {
        it('客户端 webuploader注册名称数组#clientUploadNames', () => {
            expect(clientUploadNames).to.deep.equal([
                'win32',
                'win64',
                'android',
                'mac'
            ])
        });

        it('导出服务器 webuploader注册名称#serverUploadName', () => {
            expect(serverUploadName).to.equal('serverupload')
        });

        it('应用节点状态枚举#AppNodeStatus', () => {
            expect(AppNodeStatus.Initial).to.equal(0)
            expect(AppNodeStatus.Setup).to.equal(1)
            expect(AppNodeStatus.NoSet).to.equal(2)
        });

        it('升级包状态枚举#PackageStatus', () => {
            expect(PackageStatus.Initial).to.equal(0)
            expect(PackageStatus.PackageDetail).to.equal(1)
            expect(PackageStatus.Upload).to.equal(2)
            expect(PackageStatus.Progress).to.equal(3)
        });

        it('导出升级模式枚举#Mode', () => {
            expect(Mode.None).to.equal(0)
            expect(Mode.Force).to.equal(1)
            expect(Mode.NoForce).to.equal(2)
        });

        it('导出客户端类型枚举#OsType', () => {
            expect(OsType.Win32).to.equal(0)
            expect(OsType.Win64).to.equal(1)
            expect(OsType.Android).to.equal(2)
            expect(OsType.Mac).to.equal(3)
        });

        it('客户端升级包的图标/名称/后缀');

        describe('检查客户端升级包的合法性#testPackageNamePattern', () => {
            it('win32客户端安装包名', () => {
                expect(testPackageNamePattern('AnyShare_Windows_All_x86-5.1-2-release-2.exe', OsType.Win32)).to.be.true
                expect(testPackageNamePattern('AnyShare_Windows_All_x86_xxx-5.0.2-20160121-release-2080.exe', OsType.Win32)).to.be.true
                expect(testPackageNamePattern('AnyShare_Windows_All_x86_xxx-5.0.2-20160121-Terminator-2080.exe', OsType.Win32)).to.be.true

                expect(testPackageNamePattern('AnyShare_Windows_All_x32_xxx-5.0.2-20160121-release-2080.exe', OsType.Win32)).to.be.false
                expect(testPackageNamePattern('AnyShare_Windows_All_x64_xxx-5.0.2-20160121-release-2080.exe', OsType.Win32)).to.be.false
                expect(testPackageNamePattern('AnyShare_Android_All_x64_xxx-5.0.2-20160121-release-2080.exe', OsType.Win32)).to.be.false
                expect(testPackageNamePattern('AnyShare_Windows_All_x86_xxx-5.0.2-20160121-Terminator-2080.exe1', OsType.Win32)).to.be.false

            });

            it('win64客户端安装包', () => {
                expect(testPackageNamePattern('AnyShare_Windows_All_x64-5.1-2-release-2.exe', OsType.Win64)).to.be.true
                expect(testPackageNamePattern('AnyShare_Windows_All_x64_xxx-5.0.2-20160121-release-2080.exe', OsType.Win64)).to.be.true
                expect(testPackageNamePattern('AnyShare_Windows_All_x64_xxx-5.0.2-20160121-Terminator-2080.exe', OsType.Win64)).to.be.true

                expect(testPackageNamePattern('AnyShare_Windows_All_x32_xxx-5.0.2-20160121-release-2080.exe', OsType.Win64)).to.be.false
                expect(testPackageNamePattern('AnyShare_Windows_All_x86_xxx-5.0.2-20160121-Terminator-2080.exe1', OsType.Win64)).to.be.false
            });

            it('Android客户端安装包', () => {
                expect(testPackageNamePattern('Abc123-Android-1.2-0-release-1.apk', OsType.Android)).to.be.true
                expect(testPackageNamePattern('Abc123-Android-1.2-0-Terminator-1.apk', OsType.Android)).to.be.true

                expect(testPackageNamePattern('Abc123-Androi-1.2-0-release-1.apk', OsType.Android)).to.be.false
                expect(testPackageNamePattern('Abc123-Android-a.2-0-release-1.apk', OsType.Android)).to.be.false
                expect(testPackageNamePattern('Abc123-Android-1.2-0-ABC-1.apk', OsType.Android)).to.be.false
                expect(testPackageNamePattern('Abc123-Android-1.2-0-ABC-1.apks', OsType.Android)).to.be.false
            });

            it('Mac客户端安装包', () => {
                expect(testPackageNamePattern('Abc123-Mac-1.2-0-release-1-a.dmg', OsType.Mac)).to.be.true
                expect(testPackageNamePattern('Abc123-Mac-1.2-0-Terminator-1-a.dmg', OsType.Mac)).to.be.true

                expect(testPackageNamePattern('Abc123-Androi-1.2-0-release-1-a.dmg', OsType.Mac)).to.be.false
                expect(testPackageNamePattern('Abc123-Mac-a.2-0-release-1-a.dmg', OsType.Mac)).to.be.false
                expect(testPackageNamePattern('Abc123-Mac-1.2-0-ABC-1-a.dmg', OsType.Mac)).to.be.false
                expect(testPackageNamePattern('Abc123-Mac-1.2-0-ABC-1.dmg', OsType.Mac)).to.be.false
                expect(testPackageNamePattern('Abc123-Mac-1.2-0-ABC-1-a.dmgs', OsType.Mac)).to.be.false
            });
        });

        it('导出服务器升级部分错误码枚举#ErrorCode', () => {
            expect(ErrorCode.None).to.equal(0)
            expect(ErrorCode.NoStorageDevice).to.equal(1)
            expect(ErrorCode.NodeNotOnLine).to.equal(2)
            expect(ErrorCode.NodeException).to.equal(3)
            expect(ErrorCode.UploadError).to.equal(4)
            expect(ErrorCode.DeleteError).to.equal(5)
            expect(ErrorCode.UpgradeError).to.equal(6)
        })

        it('导出服务器上传的ConfirmStatus', () => {
            expect(ConfirmStatus.None).to.equal(0)
            expect(ConfirmStatus.Delete).to.equal(1)
            expect(ConfirmStatus.Upgrade).to.equal(2)
            expect(ConfirmStatus.ClearUpgradStatus).to.equal(3)
        })

        it('#导出服务器包状态枚举#ServerPackageStatus', () => {
            expect(ServerPackageStatus.Initial).to.equal(0)
            expect(ServerPackageStatus.UploadSuccess).to.equal(1)
            expect(ServerPackageStatus.Upgrading).to.equal(2)
            expect(ServerPackageStatus.UpgradeComplete).to.equal(3)
        });

        it('获取节点角色#getRoleName', () => {
            expect(getRoleName({
                role_db: 1,
                role_ecms: 0,
                role_app: 0,
                role_storage: 0,
                sys: 0,
                is_master: 1
            })).to.equal(`${__('数据库主')}`)

            expect(getRoleName({
                role_db: 2,
                role_ecms: 1,
                role_app: 0,
                role_storage: 0,
                sys: 0,
                is_master: 1
            })).to.equal(`${__('数据库从')}/${__('集群管理')}`)

            expect(getRoleName({
                role_db: 1,
                role_ecms: 1,
                role_app: 1,
                role_storage: 0,
                sys: 0,
                is_master: 1
            })).to.equal(`${__('数据库主')}/${__('集群管理')}/${__('应用')}`)

            expect(getRoleName({
                role_db: 1,
                role_ecms: 1,
                role_app: 2,
                role_storage: 0,
                sys: 0,
                is_master: 1
            })).to.equal(`${__('数据库主')}/${__('集群管理')}/${__('单点服务')}`)

            expect(getRoleName({
                role_db: 1,
                role_ecms: 1,
                role_app: 2,
                role_storage: 1,
                sys: 0,
                is_master: 1
            })).to.equal(`${__('数据库主')}/${__('集群管理')}/${__('单点服务')}/${__('存储')}`)

            expect(getRoleName({
                role_db: 1,
                role_ecms: 1,
                role_app: 2,
                role_storage: 1,
                sys: 1,
                is_master: 1
            })).to.equal(`${__('数据库主')}/${__('集群管理')}/${__('单点服务')}/${__('存储')}/${__('高可用')}${__('主')}`)

            expect(getRoleName({
                role_db: 1,
                role_ecms: 1,
                role_app: 2,
                role_storage: 1,
                sys: 2,
                is_master: 0
            })).to.equal(`${__('数据库主')}/${__('集群管理')}/${__('单点服务')}/${__('存储')}/${__('应用')}${__('从')}`)

            expect(getRoleName({
                role_db: 1,
                role_ecms: 1,
                role_app: 2,
                role_storage: 1,
                sys: 3,
                is_master: 0
            })).to.equal(`${__('数据库主')}/${__('集群管理')}/${__('单点服务')}/${__('存储')}/${__('存储')}${__('从')}`)

        });

        it('获取节点升级信息的表头信息, 开始时间/完成时间/总节点数/已完成/升级中#getNodeInfos', () => {
            expect(getNodeInfos([])).to.deep.equal({
                startTime: 0,
                endTime: 0,
                nodeNums: '---',
                doneNums: '---',
                upgradingNums: '---'
            })

            expect(getNodeInfos([
                {
                    status: 'done',
                    start_time: 69303,
                    last_time: 72495
                },
                {
                    status: 'going',
                    start_time: 56562,
                    last_time: 66821
                },
                {
                    status: 'going',
                    start_time: 46562,
                    last_time: 76821
                }

            ])).to.deep.equal({
                startTime: 46562,
                endTime: 0,
                nodeNums: 3,
                doneNums: 1,
                upgradingNums: 2
            })

            expect(getNodeInfos([
                {
                    status: 'done',
                    start_time: 69303,
                    last_time: 72495
                },
                {
                    status: 'done',
                    start_time: 56562,
                    last_time: 66821
                },
                {
                    status: 'done',
                    start_time: 46562,
                    last_time: 76821
                }

            ])).to.deep.equal({
                startTime: 46562,
                endTime: 76821,
                nodeNums: 3,
                doneNums: 3,
                upgradingNums: 0
            })
        });

        it('errorMessage#getErrorMessage', () => {
            expect(getErrorMessage(ErrorCode.NodeNotOnLineOrException)).to.equal(__('请确认当前站点内所有节点状态正常。'))
            expect(getErrorMessage()).to.equal('')
        })

        it('获取ErrorDialogTitle#getErrorTitleMessage', () => {
            expect(getErrorTitleMessage(ErrorCode.DeleteError)).to.equal(__('删除升级包失败，错误信息如下：'))
            expect(getErrorTitleMessage(ErrorCode.UpgradeError)).to.equal(__('升级升级包失败，错误信息如下：'))
            expect(getErrorTitleMessage(ErrorCode.UploadError)).to.equal(__('上传升级包失败，错误信息如下：'))
            expect(getErrorTitleMessage()).to.equal('')
        });


    })
})