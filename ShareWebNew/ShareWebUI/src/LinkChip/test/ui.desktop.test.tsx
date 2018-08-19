import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LinkChip from '../ui.desktop';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('LinkChip@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<LinkChip></LinkChip>)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<LinkChip className="test"></LinkChip>)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('允许自定义title', () => {
                const wrapper = shallow(<LinkChip title="test"></LinkChip>)
                expect(wrapper.prop('title')).to.equal('test')
            });
        })

        describe('#event', () => {
            it('未禁用，点击触发点击事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<LinkChip onClick={spy}></LinkChip>)
                wrapper.simulate('click')
                expect(spy.calledOnce).to.be.true
            });
            
            it('禁用，点击不触发点击事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<LinkChip disabled={true} onClick={spy}></LinkChip>)
                wrapper.simulate('click')
                expect(spy.calledOnce).to.be.false
            });
        });
    });
});