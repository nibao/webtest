import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ProgressCircle from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('ProgressCircle@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ProgressCircle></ProgressCircle>)
            })

            it('默认渲染遮罩层，loading图标', () => {
                const wrapper = shallow(<ProgressCircle></ProgressCircle>)
                expect(wrapper.find('Mask').exists()).to.be.true
                expect(wrapper.find('Icon').exists()).to.be.true
            });

            it('允许自定义提示文字', () => {
                const wrapper = shallow(<ProgressCircle detail="test"></ProgressCircle>)
                expect(wrapper.find('FlexBoxItem>div>div').text()).to.equal('test')
            });
        })
    });
});