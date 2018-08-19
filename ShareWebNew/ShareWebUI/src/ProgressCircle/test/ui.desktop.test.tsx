import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ProgressCircle from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as darkLoading from '../assets/images/dark.gif'
import * as lightLoading from '../assets/images/light.gif'

describe('ShareWebUI', () => {
    describe('ProgressCircle@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ProgressCircle />)
            })

            it('默认渲染遮罩层，loading图标', () => {
                const wrapper = shallow(<ProgressCircle />)
                expect(wrapper.find('Mask').exists()).to.be.true
                expect(wrapper.find('Icon').exists()).to.be.true
            });

            it('允许自定义关闭遮罩层', () => {
                const wrapper = shallow(<ProgressCircle showMask={false} />)
                expect(wrapper.find('Mask').exists()).to.be.false
            });

            it('内容区使用Centered组件包裹居中显示', () => {
                const wrapper = shallow(<ProgressCircle />)
                expect(wrapper.find('Centered')).to.have.lengthOf(1)
            });

            it('允许设置内容区（不包括遮罩层）的定位模式fixed(默认) 或 static', () => {
                let wrapper = shallow(<ProgressCircle />)
                expect(wrapper.find('Centered').parent().hasClass(styles['position-fixed'])).to.be.true
                expect(wrapper.find('Centered').parent().hasClass(styles['position-static'])).to.be.false
                wrapper = shallow(<ProgressCircle fixedPositioned={false} />)
                expect(wrapper.find('Centered').parent().hasClass(styles['position-fixed'])).to.be.false
                expect(wrapper.find('Centered').parent().hasClass(styles['position-static'])).to.be.true
            });

            it('允许设置加载图片theme', () => {
                let wrapper = shallow(<ProgressCircle theme="dark" />)
                expect(wrapper.find('Icon').prop('url')).to.equal(darkLoading)
                wrapper = shallow(<ProgressCircle theme="light" />)
                expect(wrapper.find('Icon').prop('url')).to.equal(lightLoading)
            });

            it('允许自定义提示文字', () => {
                const wrapper = shallow(<ProgressCircle detail="test" />)
                expect(wrapper.find(`.${styles['loading-message']}`).text()).to.equal('test')
            });
        })
    });
});