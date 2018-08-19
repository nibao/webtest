import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ValidateTip from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ValidateTip></ValidateTip>)
            })

            describe('Tip的高阶组件', () => {
                const wrapper = shallow(<ValidateTip></ValidateTip>)
                it('设置Tip borderColor为#CC9933', () => {
                    expect(wrapper.prop('borderColor')).to.equal('#CC9933')
                });
                it('设置Tip backgroundColor为#FFFFCC', () => {
                    expect(wrapper.prop('backgroundColor')).to.equal('#FFFFCC')
                });

                it('允许自定义align', () => {
                    const wrapper = shallow(<ValidateTip align="top"></ValidateTip>)
                    expect(wrapper.prop('align')).to.equal('top')
                });
            });
        })
    });
});