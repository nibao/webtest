import * as React from 'react';
import { expect } from 'chai';
import { shallow, ShallowWrapper, mount } from 'enzyme';
import Pane from '../ui.desktop';
import PopMenu from '../../PopMenu/ui.desktop'
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('Pane@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Pane></Pane>)
            })

            it('props传入disabled为true时，正确设置禁用样式', () => {
                const wrapper = shallow(<Pane disabled={true}></Pane>);
                expect(wrapper.hasClass(styles['disabled'])).to.be.true
            });

            it('正确渲染UIIcon', () => {
                const wrapper = shallow(<Pane icon="\uf034" color="#fff" fallback="src/img/test.img" disabled={true}></Pane>);
                const UIIcon = wrapper.find('UIIcon')
                expect(UIIcon).to.have.lengthOf(1)
                expect(UIIcon.prop('code')).to.equal('\uf034')
                expect(UIIcon.prop('color')).to.equal('#fff')
                expect(UIIcon.prop('fallback')).to.equal('src/img/test.img')
                expect(UIIcon.prop('disabled')).to.be.true
            });

            it('正确渲染lable文字提示', () => {
                const wrapper = shallow(<Pane label="this is a label"></Pane>);
                expect(wrapper.find(`.${styles['label']}`).text()).to.equal('this is a label')
            });

            describe('正确显示消息条数', () => {
                let wrapper: ShallowWrapper;
                it('当消息条数为0时，不渲染消息条数提示', () => {
                    wrapper = shallow(<Pane></Pane>); // 默认参数为0
                    expect(wrapper.find(`.${styles['badge']}`).exists()).to.be.false                    
                    wrapper = shallow(<Pane msgNum={0}></Pane>);
                    expect(wrapper.find(`.${styles['badge']}`).exists()).to.be.false
                });

                it('当消息条数为[1,10)时，设置正确的样式(className为circles)，显示为准确的消息条数', () => {
                    wrapper = shallow(<Pane msgNum={1}></Pane>);
                    expect(wrapper.find(`.${styles['badge']}`).exists()).to.be.true                    
                    expect(wrapper.find(`.${styles['circles']}`).exists()).to.be.true
                    expect(wrapper.find(`.${styles['oval']}`).exists()).to.be.false

                    expect(wrapper.find(`.${styles['circles']}`).childAt(0).text()).to.equal('1')

                    wrapper = shallow(<Pane msgNum={9}></Pane>);
                    expect(wrapper.find(`.${styles['circles']}`).childAt(0).text()).to.equal('9')
                });
                it('当消息条数为[10,99]时，显示为准确的消息条数', () => {
                    wrapper = shallow(<Pane msgNum={10}></Pane>);
                    expect(wrapper.find(`.${styles['badge']}`).exists()).to.be.true                    
                    expect(wrapper.find(`.${styles['circles']}`).exists()).to.be.false
                    expect(wrapper.find(`.${styles['oval']}`).exists()).to.be.false

                    expect(wrapper.find(`.${styles['badge']}`).childAt(0).text()).to.equal('10')

                    wrapper = shallow(<Pane msgNum={99}></Pane>);
                    expect(wrapper.find(`.${styles['badge']}`).childAt(0).text()).to.equal('99')
                });

                it('当消息条数大于99时，显示“99+”', () => {
                    wrapper = shallow(<Pane msgNum={100}></Pane>);
                    expect(wrapper.find(`.${styles['badge']}`).exists()).to.be.true                    
                    expect(wrapper.find(`.${styles['circles']}`).exists()).to.be.false
                    expect(wrapper.find(`.${styles['oval']}`).exists()).to.be.true

                    expect(wrapper.find(`.${styles['oval']}`).childAt(0).text()).to.equal('99+')
                });
            });

            describe('正确渲染浮动菜单', () => {
                let wrapper: ShallowWrapper;
                it('menuItems为[]时不渲染PopMenu', () => {
                    wrapper = shallow(<Pane></Pane>);
                    expect(wrapper.find('PopMenu').exists()).to.be.false

                    wrapper = shallow(<Pane menuItems={[]}></Pane>);
                    expect(wrapper.find('PopMenu').exists()).to.be.false
                });

                it('传入menuItem时，正确渲染PopMenu', () => {
                    let menuItems: JSX.Element[];
                    menuItems = [<PopMenu.Item label="test" />]
                    wrapper = shallow(<Pane menuItems={menuItems}></Pane>);
                    expect(wrapper.find('PopMenu').exists()).to.be.true
                    expect(wrapper.find('PopMenu').children()).to.have.lengthOf(menuItems.length)

                    menuItems = [<PopMenu.Item label="test1" />, <PopMenu.Item label="test2" />]
                    wrapper = shallow(<Pane menuItems={menuItems}></Pane>);
                    expect(wrapper.find('PopMenu').exists()).to.be.true
                    expect(wrapper.find('PopMenu').children()).to.have.lengthOf(menuItems.length)
                });
            });
        })

        describe('#event', () => {

            it('点击pane时，正确触发props.onClick回调，开启PopMenu显示状态', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Pane onClick={spy} menuItems={[<PopMenu.Item label="test" />]}></Pane>);
                expect(wrapper.find('PopMenu').prop('open')).to.be.false
                wrapper.find(`.${styles['pane']}`).simulate('click')
                expect(spy.calledOnce).to.be.true
                expect(wrapper.find('PopMenu').prop('open')).to.be.true
            });

            it('失焦时，触发props.onBlur回调', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Pane onBlur={spy}></Pane>);
                wrapper.find(`.${styles['pane']}`).simulate('blur')
                expect(spy.calledOnce).to.be.true
            });

            it('props传入disabled为true时，禁用点击事件,不开启PopMenu显示状态', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Pane disabled={true} onClick={spy} menuItems={[<PopMenu.Item label="test" />]}></Pane>);
                expect(wrapper.find('PopMenu').prop('open')).to.be.false
                wrapper.find(`.${styles['pane']}`).simulate('click')
                expect(spy.calledOnce).to.be.false
                expect(wrapper.find('PopMenu').prop('open')).to.be.false
            });

            it('触发closePopMenu时，隐藏PopMenu，触发props.onBlur回调', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Pane onBlur={spy} menuItems={[<PopMenu.Item label="test" />]}></Pane>);
                /* 点击显示PopMenu */
                wrapper.find(`.${styles['pane']}`).simulate('click')
                expect(wrapper.find('PopMenu').prop('open')).to.be.true
                /* 调用handleClickLayer隐藏PopMenu，并且调用onBlur */
                wrapper.instance().closePopMenu()
                wrapper.update()
                expect(wrapper.find('PopMenu').prop('open')).to.be.false
                expect(spy.calledOnce).to.be.true
            });
            
        });
    });
});