import * as React from 'react';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import ClipboardButton from '../ui.desktop';
import { fail } from 'assert';

describe('ShareWebUI', () => {
    describe('ClipboardButton@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ClipboardButton></ClipboardButton>)
            });

            it('渲染结果为button', () => {
                const wrapper = shallow(<ClipboardButton>clip</ClipboardButton>);
                expect(wrapper.name()).to.equal('button')
                expect(wrapper.prop('type')).to.equal('button')
                expect(wrapper.childAt(0).text()).to.equal('clip')
            });

            it('允许自定义className', () => {
                const wrapper = shallow(<ClipboardButton className='test'>clip</ClipboardButton>);
                expect(wrapper.hasClass('test')).to.be.true;
            });
        });
        describe('#event', () => {
            it('Button挂载的时候通过refs回调触发initClipboard');
            it('doCopy afterCopy涉及到浏览器兼容性问题，暂时不进行单元测试');
        });
    });
});