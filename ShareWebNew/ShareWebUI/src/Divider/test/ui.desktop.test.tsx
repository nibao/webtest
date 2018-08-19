import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Divider from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('Divider@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Divider />);
            });

            it('默认borderColor #f4f4f4', () => {
                const wrapper = shallow(<Divider />);
                expect(wrapper.prop('style').borderColor).to.equal('#f4f4f4');
            });

            it('自定义borderColor', () => {
                const wrapper = shallow(<Divider color="#fff" />);
                expect(wrapper.prop('style').borderColor).to.equal('#fff');
            });

            describe('分割线缩进', () => {
                it('默认缩进为0', () => {
                    const wrapper = shallow(<Divider />);
                    expect(wrapper.prop('style').marginLeft).to.equal(0);
                    expect(wrapper.prop('style').marginRight).to.equal(0);
                });

                it('传入字符串或数字inset，直接使用inset作为marginLeft和marginRight', () => {
                    const wrapper = shallow(<Divider inset={100}></Divider>);
                    expect(wrapper.prop('style').marginLeft).to.equal(100);
                    expect(wrapper.prop('style').marginRight).to.equal(100);
                });

                it('inset为长度1的数组,直接使用inset[0]作为marginLeft和marginRight', () => {
                    const wrapper = shallow(<Divider inset={[100]}></Divider>);
                    expect(wrapper.prop('style').marginLeft).to.equal(100);
                    expect(wrapper.prop('style').marginRight).to.equal(100);
                });

                it('inset为长度>1的数组,取inset[0]作为marginLeft，取inset[1]作为marginRight', () => {
                    const wrapper = shallow(<Divider inset={[100, 101]}></Divider>);
                    expect(wrapper.prop('style').marginLeft).to.equal(100);
                    expect(wrapper.prop('style').marginRight).to.equal(101);
                });

            });
        });

    });
});