import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SimpleDialog from '../ui.client';
import __ from '../locale';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('SimpleDialog@client', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<SimpleDialog></SimpleDialog>)
            })

            it('Dialog宽度400,不设置title', () => {
                const wrapper = shallow(<SimpleDialog></SimpleDialog>)
                expect(wrapper.prop('width')).to.equal(400)
                expect(wrapper.prop('title')).to.be.undefined
            });

            it('正确传递onConfirm回调', () => {
                const onConfirmSpy = sinon.spy();
                const wrapper = shallow(<SimpleDialog onConfirm={onConfirmSpy}></SimpleDialog>)
                expect(wrapper.prop('onClose')).to.be.undefined
                expect(wrapper.find('PanelButton').prop('onClick')).to.equal(onConfirmSpy)
            });

            it('只渲染确认按钮', () => {
                const wrapper = shallow(<SimpleDialog></SimpleDialog>)
                expect(wrapper.find('PanelButton')).to.have.lengthOf(1)
                expect(wrapper.find('PanelButton').prop('type')).to.equal('submit')
                expect(wrapper.find('PanelButton').childAt(0).text()).to.equal(__('确定'))
            });

            it('正确渲染内容区', () => {
                const wrapper = shallow(<SimpleDialog><div>test</div></SimpleDialog>)
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });
        })
    });
});