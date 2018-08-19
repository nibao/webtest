import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ProgressDialogView from '../ui.view';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('ProgressDialogView@view', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ProgressDialogView item={{ name: 'test' }} detailTemplate={(item) => { }} />)
            })

            it('渲染结果包含提示Text组件', () => {
                const wrapper = shallow(<ProgressDialogView item={{ name: 'test' }} detailTemplate={(item) => { }} />)
                expect(wrapper.find('Text').exists()).to.be.true
            });

            it('正确调用detailTemplate', () => {
                const item = { name: 'test' },
                    spy = sinon.spy(item => item.name),
                    wrapper = shallow(<ProgressDialogView item={item} detailTemplate={spy} />)
                expect(spy.calledWith(item)).to.be.true
                expect(wrapper.find('Text').childAt(0).text()).to.equal('test')
            });

            it('渲染中包含ProgressBar，并且value值传递正确', () => {
                const wrapper = shallow(<ProgressDialogView progress={0.3} item={{ name: 'test' }} detailTemplate={(item) => { }} />)
                expect(wrapper.find('ProgressBar').exists()).to.be.true
                expect(wrapper.find('ProgressBar').prop('value')).to.equal(0.3)
            });
        })

        describe('#event', () => {
            it('点击取消按钮时，调用prohandleCancel回调函数', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<ProgressDialogView prohandleCancel={spy} item={{ name: 'test' }} detailTemplate={(item) => { }} />)
                wrapper.find('PanelButton').simulate('click')
                expect(spy.calledOnce).to.be.true
            });
        });

    });
});