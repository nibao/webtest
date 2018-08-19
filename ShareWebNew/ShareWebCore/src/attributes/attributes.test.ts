import { expect } from 'chai';
import * as sinon from 'sinon';

import * as file from '../apis/efshttp/file/file';
import * as attributes from './attributes';

const sandbox = sinon.createSandbox();

describe('ShareWebCore', () => {
    describe('attributes', () => {
        describe('获取自定义属性#customAttribute', () => {
            beforeEach('stub 外部依赖customAttributeValue', () => {
                sandbox.stub(file, 'customAttributeValue');
            });

            afterEach('restore 外部依赖', () => {
                sandbox.restore();
            });

            it('传入自定义属性：正确调用customAttributeValue', () => {
                attributes.customAttribute('test');
                expect(file.customAttributeValue.calledWith({ attributeid: 'test' })).to.be.true
            });
            
        });
    })
})