import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import List2Item from '../ui.mobile';
import * as styles from '../styles.mobile'
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('List2Item@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<List2Item></List2Item>)
            })

            describe('props传入checkbox对象时', () => {
                const wrapper = shallow(<List2Item checkbox={{ disabled: false, checked: false, onChange: () => { } }}></List2Item>)
                it('渲染结果包含CheckBox子组件', () => {
                    expect(wrapper.find('CheckBox')).to.have.lengthOf(1)
                });
                it('对中间内容区正确添加className设置左padding', () => {
                    expect(wrapper.find('div>div').hasClass(styles['children-left'])).to.be.true
                });
            });

            describe('props传入rightIcon时', () => {
                const wrapper = shallow(<List2Item rightIcon={<span>test</span>}></List2Item>)
                it('渲染结果包含rightIcon子组件', () => {
                    expect(wrapper.find('span')).to.have.lengthOf(1)
                    expect(wrapper.contains(<span>test</span>)).to.be.true
                });
                it('对中间内容区正确添加className设置右padding', () => {
                    expect(wrapper.find('div>div').at(0).hasClass(styles['children-right'])).to.be.true
                });
            });

            it('正确渲染子组件', () => {
                const wrapper = shallow(<List2Item><div>test</div></List2Item>)
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });

        })

        describe('#event', () => {
            it('正确传递onChange事件处理到CheckBox中', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<List2Item checkbox={{ disabled: false, checked: false, onChange: spy }}></List2Item>)
                expect(wrapper.find('CheckBox').prop('onChange')).to.equal(spy)
            });

            it('在CheckBox上点击不触发点击事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<List2Item checkbox={{ disabled: false, checked: false, onChange: () => { } }} onClck={spy}></List2Item>)
                wrapper.find('CheckBox').simulate('click')
                expect(spy.called).to.be.false
            });

            it('在rightIcon上点击触发点击事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<List2Item rightIcon={<span>test</span>} onClick={spy}></List2Item>)
                wrapper.find('div>div').at(1).simulate('click')
                expect(spy.called).to.be.false
            });

            it('在内容区点击时触发点击事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<List2Item checkbox={{ disabled: false, checked: false, onChange: () => { } }} rightIcon={<span>test</span>} onClick={spy}></List2Item>)
                wrapper.find('div>div').at(0).simulate('click')
                expect(spy.called).to.be.true
            });
        });
    });
});