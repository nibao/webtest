import { expect } from 'chai'
import { createSandbox } from 'sinon'
import * as browser from '../../util/browser/browser';
import * as openapi from '../openapi/openapi';
import * as link from '../apis/efshttp/link/link';
import * as file from '../apis/efshttp/file/file';
import * as quarantine from '../apis/efshttp/quarantine/quarantine';
import { sandboxStub } from '../../libs/test-helper';

import { init, previewOSS } from './preview'


describe('ShareWebCore', () => {
    describe('preview', () => {
        const sandbox = createSandbox()
        beforeEach('stub', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: browser,
                    moduleProp: 'useHTTPS'
                },
                {
                    moduleObj: openapi,
                    moduleProp: 'getOpenAPIConfig'
                },
                {
                    moduleObj: link,
                    moduleProp: 'previewOSS'
                },
                {
                    moduleObj: file,
                    moduleProp: 'previewOSS'
                },
                {
                    moduleObj: quarantine,
                    moduleProp: 'preview'
                }
            ])
        });

        afterEach('restore', () => {
            sandbox.restore()
        });
        describe('文档预览，支持外链／权限#previewOSS', () => {
            it('外链预览', async () => {
                browser.useHTTPS.returns(true)
                openapi.getOpenAPIConfig.returns('https://michel.name')
                previewOSS({
                    link: 'link',
                    password: 'password',
                    docid: 'docid',
                })
                expect(link.previewOSS.calledWith({
                    link: 'link',
                    password: 'password',
                    docid: 'docid',
                    usehttps: true,
                    reqhost: 'michel.name'
                })).to.be.true
                expect(quarantine.preview.called).to.be.false
                expect(file.previewOSS.called).to.be.false
            });

            it('隔离区文件预览', async () => {
                browser.useHTTPS.returns(true)
                openapi.getOpenAPIConfig.returns('https://michel.name')
                previewOSS({
                    docid: 'docid',
                    rev: 'rev',
                    illegalContentQuarantine: true
                })
                expect(quarantine.preview.calledWith({
                    docid: 'docid',
                    rev: 'rev',
                    usehttps: true,
                    reqhost: 'michel.name'
                })).to.be.true
                expect(link.previewOSS.called).to.be.false
                expect(file.previewOSS.called).to.be.false
            });

            it('普通文件预览', async () => {
                openapi.getOpenAPIConfig.returns('http://michel.name')
                previewOSS({
                    docid: 'docid',
                    rev: 'rev',
                    usehttps: false
                })
                expect(file.previewOSS.calledWith({
                    docid: 'docid',
                    rev: 'rev',
                    usehttps: false,
                    reqhost: 'michel.name'
                })).to.be.true
                expect(quarantine.preview.called).to.be.false
                expect(link.previewOSS.called).to.be.false
            });
        });

        it('初始化PDFJS#init', () => {
            PDFJS = {}
            init({ cMapUrl: 'cMapUrl', cMapPacked: 'cMapPacked', workerSrc: 'workerSrc' })
            expect(PDFJS.cMapUrl).to.equal('cMapUrl')
            expect(PDFJS.cMapPacked).to.equal('cMapPacked')
            expect(PDFJS.workerSrc).to.equal('workerSrc')
            PDFJS = null
        });


    })
})