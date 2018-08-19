import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DataListItem from '../ui.desktop';
import * as styles from '../styles.desktop.css'
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('DataListItem@desktop', () => {
        describe('#render', () => {
            it('正确设置选中时的className', () => {
                const wrapper = shallow(<DataListItem selected={true}></DataListItem>);
                expect(wrapper.hasClass(styles['selected'])).to.be.true;
            });

            it('默认显示CheckBox占位div', () => {
                const wrapper = shallow(<DataListItem></DataListItem>);
                expect(wrapper.find(`.${styles['checkbox']}`).exists()).to.be.true
            });

            it('设置不可选时，不显示checkbox外层的div', () => {
                const wrapper = shallow(<DataListItem checkbox={false}></DataListItem>);
                expect(wrapper.find(`.${styles['checkbox']}`).exists()).to.be.false
            });

            it('默认显示CheckBox', () => {
                const wrapper = shallow(<DataListItem></DataListItem>);
                expect(wrapper.find('CheckBox').exists()).to.be.true
            });

            it('正确隐藏CheckBox', () => {
                const wrapper = shallow(<DataListItem selectable={false}></DataListItem>);
                expect(wrapper.find('CheckBox').exists()).to.be.false
            });

            it('设置选中时CheckBox参数正确', () => {
                const wrapper = shallow(<DataListItem selected={true}></DataListItem>);
                expect(wrapper.find('CheckBox').prop('checked')).to.be.true;
            });

            it('正确渲染扩展', () => {
                const wrapper = shallow(<DataListItem expandable={true} expandContent="test"></DataListItem>);
                expect(wrapper.find('Expand').exists()).to.be.true;
                expect(wrapper.find('Expand').children().text()).to.equal('test');
            });

        });

        describe('#点击事件', () => {
            it('行点击事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<DataListItem onClick={spy}></DataListItem>);
                wrapper.find('li>div').simulate('click')
                expect(spy.calledOnce).to.be.true
            });
            it('行双击事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<DataListItem onDoubleClick={spy}></DataListItem>);
                wrapper.find('li>div').simulate('doubleClick')
                expect(spy.calledOnce).to.be.true
            });

            it('正确处理点击checkbox事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<DataListItem onToggleSelect={spy}></DataListItem>);
                wrapper.find('CheckBox').simulate('click')
                expect(spy.calledOnce).to.be.true
            });

            it('正确处理onContextMenu事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<DataListItem onContextMenu={spy}></DataListItem>);
                wrapper.find('li>div').simulate('contextMenu')
                expect(spy.calledOnce).to.be.true
            });
        });
    });
});