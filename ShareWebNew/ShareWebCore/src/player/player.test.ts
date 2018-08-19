import { expect } from 'chai'
import { createSandbox } from 'sinon'
import * as link from '../apis/efshttp/link/link';
import * as file from '../apis/efshttp/file/file';
import * as openapi from '../openapi/openapi';
import * as browser from '../../util/browser/browser';
import { queryString } from '../../util/http/http';
import { sandboxStub, generateDocid } from '../../libs/test-helper';

import { getPlayInfo, buildUrl } from './player'


describe('ShareWebCore', () => {
    describe('player', () => {
        const sandbox = createSandbox()
        beforeEach('stub', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: link,
                    moduleProp: ['playInfo']
                },
                {
                    moduleObj: file,
                    moduleProp: ['playInfo']
                },
                {
                    moduleObj: openapi,
                    moduleProp: ['getOpenAPIConfig']
                },
                {
                    moduleObj: browser,
                    moduleProp: ['useHTTPS']
                }
            ])
        });

        afterEach('restore', () => {
            sandbox.restore()
        });

        describe('获取播放信息#getPlayInfo', () => {
            it('外链,调用外链接口获取', () => {
                getPlayInfo({
                    link: 'link',
                    password: 'password',
                    docid: 'docid',
                    rev: 'rev',
                    definition: 'definition',
                    userid: 'userid',
                    tokenid: 'tokenid'
                })
                expect(link.playInfo.calledWith({
                    link: 'link',
                    password: 'password',
                    docid: 'docid',
                    rev: 'rev',
                    definition: 'definition'
                })).to.be.true
                expect(file.playInfo.called).to.be.false
            });
            it('非外链，调用文件接口获取', () => {
                getPlayInfo({
                    docid: 'docid',
                    rev: 'rev',
                    definition: 'definition',
                    userid: 'userid',
                    tokenid: 'tokenid'
                })

                expect(file.playInfo.calledWith(
                    {
                        docid: 'docid',
                        rev: 'rev',
                        definition: 'definition'
                    }
                )).to.be.true
                
                expect(link.playInfo.called).to.be.false
            });
        });

        describe('构建当前播放器请求视频或音频的src地址#buildUrl', () => {
            const fakeDocid = generateDocid();
            const fakehost1 = 'http://jamir.com'
            const fakehost2 = 'https://jamir.com'
            const fakeUserid = 'a38f12f9-65bc-4281-82f3-b4f344aee4be'
            const fakeTokenid = '94296d71-a78b-4b29-865a-fead340b9a32'
            it('类型为外链', () => {
                openapi.getOpenAPIConfig.withArgs('host').returns(fakehost1)
                openapi.getOpenAPIConfig.withArgs('EFSPPort').returns(9123)
                openapi.getOpenAPIConfig.withArgs('userid').returns(fakeUserid)
                openapi.getOpenAPIConfig.withArgs('tokenid').returns(fakeTokenid)
                browser.useHTTPS.returns(false)
                expect(buildUrl('link', { docid: fakeDocid })).to.equal(`http://jamir.com:9123/v1/link?method=play&${queryString({ docid: fakeDocid, reqhost: 'jamir.com', usehttps: false })}`)
            });

            it('类型为文件', () => {
                openapi.getOpenAPIConfig.withArgs('host').returns(fakehost2)
                openapi.getOpenAPIConfig.withArgs('EFSPPort').returns(9124)
                openapi.getOpenAPIConfig.withArgs('userid').returns(fakeUserid)
                openapi.getOpenAPIConfig.withArgs('tokenid').returns(fakeTokenid)
                browser.useHTTPS.returns(true)
                expect(buildUrl('file', { docid: fakeDocid })).to.equal(`https://jamir.com:9124/v1/file?method=play&${queryString({ docid: fakeDocid, reqhost: 'jamir.com', usehttps: true })}&userid=${fakeUserid}&tokenid=${fakeTokenid}`)
            });
        });
    })
})