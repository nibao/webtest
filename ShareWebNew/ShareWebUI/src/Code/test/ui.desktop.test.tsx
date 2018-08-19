import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as sinon from 'sinon';
import * as  highlight from 'highlight.js';
import Code from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('Code@desktop', () => {
        describe('#render', () => {
            it('正确渲染', () => {
                const wrapper = mount(<Code language="javascript">var test=123</Code>)
                expect(wrapper.find('Control')).to.have.lengthOf(1)
                expect(wrapper.find('pre code').hasClass('javascript')).to.be.true
                expect(wrapper.find('pre code').hasClass('hljs')).to.be.true
            });

            it('正确处理传入className', () => {
                const wrapper = shallow(<Code className="test">var test=123</Code>)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('调用highlightBlock', () => {
                const stub = sinon.stub(highlight, 'highlightBlock')
                const wrapper = mount(<Code className="test">var test=123</Code>)
                expect(stub.calledWith(wrapper.find('code').instance())).to.be.true
                stub.restore();
            });
        });
    });
});