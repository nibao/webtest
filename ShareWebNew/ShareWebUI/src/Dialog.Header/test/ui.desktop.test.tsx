import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DialogHeader from '../ui.desktop';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('DialogHeader@desktop', () => {
        describe('#render', () => {
            describe('正确渲染header提示内容', () => {
                it('如果是children是string,则使用Text子组件进行包裹', () => {
                    const wrapper = shallow(<DialogHeader>test</DialogHeader>);
                    expect(wrapper.find('Text').exists()).to.be.true
                    expect(wrapper.find('Text').childAt(0).text()).to.equal('test')
                });
                it('如果是children不是string,则直接进行渲染', () => {
                    const wrapper = shallow(<DialogHeader><span>test</span></DialogHeader>);
                    expect(wrapper.find('Text').exists()).to.be.false
                    expect(wrapper.contains(<span>test</span>)).to.be.true
                });
            });

            it('渲染自定义HeaderButtons', () => {
                const wrapper = shallow(<DialogHeader HeaderButtons={[<span>test1</span>, <span>test2</span>, <span>test3</span>]}></DialogHeader>);
                expect(wrapper.find('FlexBoxItem').at(1).find('span')).to.have.lengthOf(3)
                expect(wrapper.find('FlexBoxItem').at(1).find('span').at(0).contains('test1')).to.be.true
                expect(wrapper.find('FlexBoxItem').at(1).find('span').at(2).contains('test3')).to.be.true
            });

            it('closable props为true时应该渲染关闭按钮', () => {
                const wrapper = shallow(<DialogHeader closable={true}></DialogHeader>);
                expect(wrapper.find('UIIcon')).to.have.lengthOf(1);
                expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf014');
            });
        });
        describe('#event', () => {
            it('点击关闭按钮时，调用onClose props', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<DialogHeader closable={true} onClose={spy}></DialogHeader>);
                wrapper.find('UIIcon').last().simulate('click')
                expect(spy.calledOnce).to.be.true
            });
        });
    });
});