import { expect } from 'chai';
import * as sinon from 'sinon';
import {
    sandboxStub,
    generateGNS,
    generateDocid
} from '../../libs/test-helper';

import * as browser from '../../util/browser/browser';
import * as docs from '../docs/docs';
import * as link from '../apis/efshttp/link/link';
import * as openapi from '../openapi/openapi';

import { Permission, getDownloadURL, getBatchDownloadURL, list } from './link';

describe('ShareWebCore', () => {
    describe('link', () => {
        const sandbox = sinon.createSandbox();

        const fakeLinkCode = generateGNS();
        const fakeDocid = generateDocid();
        const fakeFiles = [generateDocid(), generateDocid()];
        const fakeDirs = [generateDocid(), generateDocid()];
        beforeEach('stub', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: openapi,
                    moduleProp: 'getOpenAPIConfig'
                },
                {
                    moduleObj: link,
                    moduleProp: ['OSDownload', 'listDir', 'batchDownload']
                },
                {
                    moduleObj: browser,
                    moduleProp: 'useHTTPS'
                }
            ]);
        });

        afterEach('restore', () => {
            sandbox.restore();
        });
        it('导出外链权限#Permission', () => {
            expect(Permission.PREVIEW).to.equal(1);
            expect(Permission.DOWNLOAD).to.equal(2);
            expect(Permission.UPLOAD).to.equal(4);
        });

        describe('获取下载地址#getDownloadURL', () => {
            it('使用https', () => {
                openapi.getOpenAPIConfig.returns('https://anyshare.eisoo.com');
                browser.useHTTPS.returns(true);
                link.OSDownload.resolves({ authrequest: ['get', 'linkUrl'] });
                return getDownloadURL({
                    link: fakeLinkCode,
                    password: 'abcd',
                    docid: fakeDocid,
                    savename: 'foo'
                }).then(url => {
                    expect(
                        link.OSDownload.calledWith({
                            link: fakeLinkCode,
                            password: 'abcd',
                            docid: fakeDocid,
                            reqhost: 'anyshare.eisoo.com',
                            usehttps: true,
                            savename: 'foo'
                        })
                    ).to.be.true;
                    expect(url).to.equal('linkUrl');
                });
            });

            it('使用http', () => {
                openapi.getOpenAPIConfig.returns('https://anyshare.eisoo.com');
                browser.useHTTPS.returns(false);
                link.OSDownload.resolves({ authrequest: ['get', 'linkUrl'] });
                return getDownloadURL({
                    link: fakeLinkCode,
                    password: 'abcd',
                    docid: fakeDocid,
                    savename: 'foo'
                }).then(url => {
                    expect(
                        link.OSDownload.calledWith({
                            link: fakeLinkCode,
                            password: 'abcd',
                            docid: fakeDocid,
                            reqhost: 'anyshare.eisoo.com',
                            usehttps: false,
                            savename: 'foo'
                        })
                    ).to.be.true;
                    expect(url).to.equal('linkUrl');
                });
            });
        });

        describe('获取批量下载地址#getBatchDownloadURL', () => {
            it('使用https', () => {
                openapi.getOpenAPIConfig.returns('https://anyshare.eisoo.com');
                browser.useHTTPS.returns(true);
                link.batchDownload.resolves({ url: 'batchDownloadUrl' });
                return getBatchDownloadURL({
                    name: 'foo',
                    files: fakeFiles,
                    dirs: fakeDirs,
                    link: fakeLinkCode,
                    password: 'abcd'
                }).then(url => {
                    expect(
                        link.batchDownload.calledWith({
                            name: 'foo',
                            reqhost: 'anyshare.eisoo.com',
                            usehttps: true,
                            files: fakeFiles,
                            dirs: fakeDirs,
                            link: fakeLinkCode,
                            password: 'abcd'
                        })
                    ).to.be.true;
                    expect(url).to.equal('batchDownloadUrl');
                });
            });

            it('使用http', () => {
                openapi.getOpenAPIConfig.returns('http://anyshare.eisoo.com');
                browser.useHTTPS.returns(false);
                link.batchDownload.resolves({ url: 'batchDownloadUrl' });
                return getBatchDownloadURL({
                    name: 'foo',
                    files: fakeFiles,
                    dirs: fakeDirs,
                    link: fakeLinkCode,
                    password: 'abcd'
                }).then(url => {
                    expect(
                        link.batchDownload.calledWith({
                            name: 'foo',
                            reqhost: 'anyshare.eisoo.com',
                            usehttps: false,
                            files: fakeFiles,
                            dirs: fakeDirs,
                            link: fakeLinkCode,
                            password: 'abcd'
                        })
                    ).to.be.true;
                    expect(url).to.equal('batchDownloadUrl');
                });
            });
        });

        it('下载外链#download（调用location跳转，无法测试）');

        it('列举外链目录#list', () => {
            link.listDir.resolves({ files: fakeFiles, dirs: fakeDirs });
            return list({
                docid: fakeDocid,
                link: fakeLinkCode,
                password: 'abcd'
            }).then(list => {
                expect(
                    link.listDir.calledWith({
                        docid: fakeDocid,
                        link: fakeLinkCode,
                        password: 'abcd'
                    })
                );
                expect(list).to.deep.equal([...fakeDirs, ...fakeFiles]);
            });
        });
    });
});
