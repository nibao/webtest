import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MessageDialog from '../ui.mac';
import __ from '../locale'
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('MessageDialog@mac', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<MessageDialog></MessageDialog>)
            })

            it('渲染结果为Dialog组件，包含DialogMain DialogFooter DialogButton', () => {
                const wrapper = shallow(<MessageDialog></MessageDialog>)
                expect(wrapper.name()).to.equal('Dialog')
                expect(wrapper.find('Dialog DialogMain')).to.have.lengthOf(1)
                expect(wrapper.find('Dialog DialogFooter')).to.have.lengthOf(1)
                expect(wrapper.find('Dialog DialogFooter DialogButton')).to.have.lengthOf(1)
            });


            it('正确渲染传入的子组件', () => {
                const wrapper = shallow(
                    <MessageDialog>
                        <div>test</div>
                    </MessageDialog>
                )
                expect(wrapper.find('DialogMain').contains(<div>test</div>)).to.be.true
            });

            it('确认按钮渲染正确，type为submit，按钮内容为"确认"', () => {
                const wrapper = shallow(<MessageDialog></MessageDialog>)
                expect(wrapper.find('DialogButton').prop('type')).to.equal('submit')
                expect(wrapper.find('DialogButton').childAt(0).text()).to.equal(__('确定'))
            });

        })

        describe('#event', () => {
            it('点击确认按钮时，正确触发onConfirm回调', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<MessageDialog onConfirm={spy}></MessageDialog>)
                expect(wrapper.prop('onClose')).to.be.undefined
                wrapper.find('DialogButton').simulate('click')
                expect(spy.calledOnce).to.be.true
            });
        });
    });
});