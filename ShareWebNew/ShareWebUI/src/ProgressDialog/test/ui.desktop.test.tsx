import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ProgressDialog from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('ProgressDialog@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ProgressDialog />)
            })

            it('渲染结果包含Dialog组件，Dialog组件中包含ProgressDialogView', () => {
                const wrapper = shallow(<ProgressDialog />)
                expect(wrapper.name()).to.equal('Dialog')
                expect(wrapper.children()).to.have.lengthOf(1)
                expect(wrapper.find('ProgressDialogView').exists()).to.be.true
            });

            it('Dialog宽度440', () => {
                const wrapper = shallow(<ProgressDialog />)
                expect(wrapper.prop('width')).to.equal(440)
            });

            it('允许自定义title', () => {
                const wrapper = shallow(<ProgressDialog title="test" />)
                expect(wrapper.prop('title')).to.equal('test')
            });
        })
    });
});