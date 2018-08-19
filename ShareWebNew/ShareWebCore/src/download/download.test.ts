import { expect } from 'chai';
import * as sinon from 'sinon';

import * as browser from '../../util/browser/browser';
import * as file from '../apis/efshttp/file/file';
import * as link from '../apis/efshttp/link/link';
import * as openapi from '../openapi/openapi';
import * as permission from '..//permission/permission';

import * as downloadModule from './download';

import { sandboxStub } from '../../libs/test-helper'

let sandbox = sinon.createSandbox()

describe('ShareWebCore', () => {

    describe('download', () => {
        const { download, ErrorCode, EventType } = downloadModule;
        it('导出下载事件事件类型', () => {
            expect(EventType.DOWNLOAD_SUCCESS).to.equal(0)
            expect(EventType.DOWNLOAD_ERROR).to.equal(1)
        });

        it('导出下载错误码', () => {
            expect(ErrorCode.FAIL_WECHAT).to.equal(1)
            expect(ErrorCode.WATERMARK_NOT_SUPPORT).to.equal(403178)
        });

        describe('获取下载地址#download', () => {
            const mockData = {
                files: [
                    {
                        docid: 'gns://801403A034C74D0D9732123290290007/B82BAC0AD5DC4FC086C9519AABF3B060',
                        name: 'circuit.p7m',
                        rev: '3BCC4DD158884BB6BC3E5DD5A6B58BE9',
                        size: 153
                    },
                    {
                        docid: 'gns://801403A034C74D0D9732123290290007/B82BAC0AD5DC4FC086C9519AABF3B060',
                        name: 'circuit.p7mliaison.markdown',
                        rev: '3BCC4DD158884BB6BC3E5DD5A6B58BE9',
                        size: 153
                    }
                ],

                dirs: [
                    {
                        docid: 'gns://801403A034C74D0D9732123290290007/B82BAC0AD5DC4FC086C9519AABF3B060',
                        name: 'circuit.p7m',
                        rev: '3BCC4DD158884BB6BC3E5DD5A6B58BE9',
                        size: -1
                    },
                    {
                        docid: 'gns://801403A034C74D0D9732123290290007/B82BAC0AD5DC4FC086C9519AABF3B060',
                        name: 'groves_awesome.rgb',
                        rev: '3BCC4DD158884BB6BC3E5DD5A6B58BE9',
                        size: -1
                    }
                ],

                linkFiles: [
                    {
                        docid: 'gns://801403A034C74D0D9732123290290007/B82BAC0AD5DC4FC086C9519AABF3B060',
                        name: 'circuit.p7m',
                        size: 153,
                        rev: '3BCC4DD158884BB6BC3E5DD5A6B58BE9',
                        link: {
                            url: 'linkurl'
                        },
                        password: 'linkpassword'
                    },
                    {
                        docid: 'gns://801403A034C74D0D9732123290290007/B82BAC0AD5DC4FC086C9519AABF3B060',
                        name: 'deliver_orange_implementation.tiff',
                        size: 153,
                        rev: '3BCC4DD158884BB6BC3E5DD5A6B58BE9',
                        link: {
                            url: 'linkurl'
                        },
                        password: 'linkpassword'
                    }
                ],

                linkDirs: [
                    {
                        docid: 'gns://801403A034C74D0D9732123290290007/B82BAC0AD5DC4FC086C9519AABF3B060',
                        name: 'circuit.p7m',
                        size: -1,
                        rev: '3BCC4DD158884BB6BC3E5DD5A6B58BE9',
                        link: {
                            url: 'linkurl'
                        },
                        password: 'linkpassword'
                    },
                    {
                        docid: 'gns://801403A034C74D0D9732123290290007/B82BAC0AD5DC4FC086C9519AABF3B060',
                        name: 'deliver_orange_implementation.tiff',
                        size: -1,
                        rev: '3BCC4DD158884BB6BC3E5DD5A6B58BE9',
                        link: {
                            url: 'linkurl'
                        },
                        password: 'linkpassword'
                    }
                ]
            }
            beforeEach('stub', () => {
                sandboxStub(sandbox, [
                    {
                        moduleObj: openapi,
                        moduleProp: ['getOpenAPIConfig']
                    },
                    {
                        moduleObj: browser,
                        moduleProp: ['useHTTPS', 'isBrowser']
                    },
                    {
                        moduleObj: file,
                        moduleProp: ['OSDownload', 'batchDownload']
                    },
                    {
                        moduleObj: link,
                        moduleProp: ['OSDownload', 'batchDownload']
                    },
                    {
                        moduleObj: downloadModule,
                        moduleProp: ['trigger']
                    }, {
                        moduleObj: permission,
                        moduleProp: ['checkLinkPerm', 'checkPermItem']
                    },
                ])
            })
            afterEach('restore stub', () => {
                sandbox.restore()
            })

            it('微信不支持下载', async () => {
                browser.isBrowser.withArgs({ app: browser.Browser.WeChat }).returns(true)
                expect(await download(mockData.files[0])).to.equal(undefined)
                expect(downloadModule.trigger.calledWith(
                    EventType.DOWNLOAD_ERROR,
                    null,
                    { errcode: ErrorCode.FAIL_WECHAT }
                )
                )
            })

            it('IOS不支持下载', async () => {
                browser.isBrowser.withArgs({ os: browser.OSType.IOS }).returns(true)
                expect(await download(mockData.files[0])).to.equal(undefined)
                expect(downloadModule.trigger.calledWith(
                    EventType.DOWNLOAD_ERROR,
                    null,
                    { errcode: ErrorCode.FAIL_IOS }
                ))
            })

            it('doc参数为函数，调用抛错，download返回undefined', async () => {
                expect(await download(() => { throw new Error() })).to.equal(undefined)
            });

            it('doc不存在，返回undefined', async () => {
                expect(await download()).to.be.undefined
                expect(await download(undefined)).to.be.undefined
                expect(await download(null)).to.be.undefined
            });

            it('doc为length为0的数组，返回undefined', async () => {
                expect(await download([])).to.be.undefined
            });

            describe('权限检查', () => {
                it('外链下载，没有权限,返回undefined，触发对应事件', async () => {
                    openapi.getOpenAPIConfig.returns({ host: '', userid: '' })
                    permission.checkLinkPerm.resolves(0);
                    expect(await download(mockData.linkFiles[0])).to.equal(undefined)
                    expect(downloadModule.trigger.calledWith(
                        EventType.DOWNLOAD_ERROR,
                        null,
                        {
                            errcode: ErrorCode.FILE_NO_PERMISSION,
                            nativeEvent: { errcode: ErrorCode.FILE_NO_PERMISSION },
                            target: mockData.linkFiles[0]
                        }
                    )).to.be.true
                });

                it('非外链下载，无权限抛出错误', async () => {
                    openapi.getOpenAPIConfig.returns({ host: '', userid: '' })
                    permission.checkPermItem.resolves(0);
                    expect(await download(mockData.files[0])).to.equal(undefined)
                    expect(downloadModule.trigger.calledWith(
                        EventType.DOWNLOAD_ERROR,
                        null,
                        {
                            errcode: ErrorCode.No_COPY_PERMISSION,
                            nativeEvent: { errcode: ErrorCode.No_COPY_PERMISSION },
                            target: mockData.files[0]
                        }
                    )).to.be.true
                });

            });

            it('savename 为函数时抛错，返回undefined', async () => {
                openapi.getOpenAPIConfig.returns({ host: '', userid: '' })
                expect(await download(mockData.files[0], {}, () => { throw new Error() })).to.be.undefined
            });

            describe('批量下载', () => {
                it('外链下载', async () => {
                    openapi.getOpenAPIConfig.returns({ host: 'https://anyshare.eisoo.com', userid: '997df07f-ecd5-4a80-ad33-5002e4f83fa0' })
                    browser.useHTTPS.returns(true)
                    link.batchDownload.resolves({ url: 'linkDownloadUrl' })
                    expect(await download(mockData.linkDirs[0])).to.be.undefined
                    expect(link.batchDownload.called).to.be.true
                    expect(downloadModule.trigger.calledWith(EventType.DOWNLOAD_SUCCESS, null, 'linkDownloadUrl'))
                });

                it('非外链下载', async () => {
                    openapi.getOpenAPIConfig.returns({ host: 'https://anyshare.eisoo.com', userid: '997df07f-ecd5-4a80-ad33-5002e4f83fa0' })
                    browser.useHTTPS.returns(false)
                    file.batchDownload.resolves({ url: 'fileDownloadUrl' })
                    await download([mockData.files[0], mockData.dirs[0]], {}, 'savename.zip')
                    // expect(file.batchDownload.called).to.be.true
                    expect(downloadModule.trigger.calledWith(EventType.DOWNLOAD_SUCCESS, null, 'fileDownloadUrl')).to.be.true
                });
            });

            describe('单文件下载', () => {
                it('外链下载', async () => {
                    openapi.getOpenAPIConfig.returns({ host: 'https://anyshare.eisoo.com', userid: '997df07f-ecd5-4a80-ad33-5002e4f83fa0' })
                    permission.checkLinkPerm.resolves(1);
                    browser.useHTTPS.returns(true)
                    link.OSDownload.resolves({ authrequest: [, 'linkDownloadUrl'], need_watermark: false })
                    expect(await download([mockData.linkFiles[0]])).to.be.undefined
                    expect(link.OSDownload.called).to.be.true
                    expect(downloadModule.trigger.calledWith(EventType.DOWNLOAD_SUCCESS, null, 'linkDownloadUrl'))
                });

                it('非外链下载', async () => {
                    openapi.getOpenAPIConfig.returns({ host: 'https://anyshare.eisoo.com', userid: '997df07f-ecd5-4a80-ad33-5002e4f83fa0' })
                    permission.checkPermItem.resolves(1)
                    browser.useHTTPS.returns(false)
                    file.OSDownload.resolves({ authrequest: [, 'fileDownloadUrl'], need_watermark: false })
                    expect(await download(mockData.files[0])).to.be.undefined
                    expect(file.OSDownload.called).to.be.true
                    expect(downloadModule.trigger.calledWith(EventType.DOWNLOAD_SUCCESS, null, 'fileDownloadUrl'))
                });

                it('水印服务器', () => {

                });
            });

        })
    })
})