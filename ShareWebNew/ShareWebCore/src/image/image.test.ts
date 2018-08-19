import { expect } from 'chai';
import * as sinon from 'sinon';
import { generateGNS, sandboxStub } from '../../libs/test-helper';
import { buildSrc } from './image';
import * as openapi from '../openapi/openapi';
import * as browser from '../../util/browser/browser';

describe('ShareWebCore', () => {
    describe('image', () => {
        const sandbox = sinon.createSandbox();
        const gns = `gns://${generateGNS()}`;

        beforeEach('stub', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: openapi,
                    moduleProp: 'getOpenAPIConfig'
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

        it('构建文档图片src#buildImageSrc');

        it('构建外链图片src#buildLinkImageSrc');

        // 使用Math.random函数不纯，不可测
        it('构造缩略图URL#buildSrc');

        // 使用Math.random函数不纯，不可测
        it('生成外链图片src#buildSrcByLink');
    });
});
