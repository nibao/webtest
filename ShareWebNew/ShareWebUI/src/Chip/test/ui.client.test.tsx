import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as sinon from 'sinon';
import Chip from '../ui.client';
import * as styles from '../styles.client';

describe('ShareWebUI', () => {
    describe('Chip@client', () => {
        describe('#render', () => {

            it('默认渲染', () => {
                shallow(<Chip></Chip>)
            });

            it('默认渲染结果应该包含一个Text子组件', () => {
                const wrapper = shallow(<Chip></Chip>);
                expect(wrapper.find('Text')).to.have.lengthOf(1);
            });

            it('渲染文字内容正确', () => {
                const wrapper = shallow(<Chip>test</Chip>);
                expect(wrapper.find('Text').childAt(0).text()).to.equal('test')
            });
            it('允许自定义className', () => {
                const wrapper = shallow(<Chip className="test"></Chip>);
                expect(wrapper.hasClass('test')).to.be.true;
            });

            it('允许禁用，禁用时设置正确的禁用className', () => {
                const wrapper = shallow(<Chip disabled={true}></Chip>);
                expect(wrapper.hasClass(styles['disabled'])).to.be.true;
            });

            it('不设置为只读，并且传入移除处理函数，渲染结果包含a标签', () => {
                const wrapper = shallow(<Chip removeHandler={() => { }}></Chip>);
                expect(wrapper.find('a')).to.have.lengthOf(1);
                expect(wrapper.find('a').text()).to.equal('x');
            });

            it('设置为只读，传入移除处理函数，渲染结果不包含a标签', () => {
                const wrapper = shallow(<Chip readOnly={true} removeHandler={() => { }}></Chip>);
                expect(wrapper.find('a').exists()).to.be.false
            });
        });


        describe('#event', () => {
            it('正确处理点击事件', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Chip removeHandler={spy}></Chip>);
                wrapper.find('a').simulate('click');
                expect(spy.calledOnce).to.be.true;
            });

            it('禁用后点击不触发点击事件', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Chip disabled={true} removeHandler={spy}></Chip>);
                wrapper.find('a').simulate('click');
                expect(spy.calledOnce).to.be.false;
            });
        });
    });
});