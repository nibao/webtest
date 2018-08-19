import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TextArea from '../ui.desktop';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('TextArea@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<TextArea />)
            })

            it('允许自定义width height maxHeight minHeight', () => {
                const wrapper = shallow(
                    <TextArea
                        width={500}
                        height={400}
                        maxHeight={300}
                        minHeight={200}
                    />
                )
                expect(wrapper.find('Control').prop('width')).to.equal(500)
                expect(wrapper.find('Control').prop('height')).to.equal(400)
                expect(wrapper.find('Control').prop('maxHeight')).to.equal(300)
                expect(wrapper.find('Control').prop('minHeight')).to.equal(200)
            });

            it('默认value为undefined，disabled为false', () => {
                const wrapper = shallow(<TextArea />)
                expect(wrapper.find('Control').prop('focus')).to.be.false
                expect(wrapper.find('textarea').prop('value')).to.be.undefined
            });

            it('外层Control组件允许自定义className', () => {
                const wrapper = shallow(<TextArea className="test" />)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('props.disabled为true时设置禁用', () => {
                const wrapper = shallow(<TextArea disabled={true} />)
                expect(wrapper.find('Control').prop('disabled')).to.be.true
                expect(wrapper.find('textarea').prop('disabled')).to.be.true
            });

            it('允许通过props.placeholder设置占位提示', () => {
                const wrapper = shallow(<TextArea placeholder="testPlaceholder" />)
                expect(wrapper.find('textarea').prop('placeholder')).to.equal('testPlaceholder')
            });

            it('允许通过props.readOnly设置输入框只读', () => {
                const wrapper = shallow(<TextArea readOnly={true} />);
                expect(wrapper.find('textarea').prop('readOnly')).to.equal(true)
            });

            it('允许通过props.maxLength设置输入框最大输入长度', () => {
                const wrapper = shallow(<TextArea maxLength={500} />);
                expect(wrapper.find('textarea').prop('maxLength')).to.equal(500)
            });

            it('通过props.value允许设置默认值', () => {
                const wrapper = shallow(<TextArea value="testValue" />)
                expect(wrapper.find('textarea').prop('value')).to.equal('testValue')
                expect(wrapper.state('value')).to.equal('testValue')
            });
        })

        describe('#event', () => {
            it('聚焦时正确改变state,正确调用props.onFocus', () => {
                const onFocusSpy = sinon.spy()
                const wrapper = shallow(<TextArea onFocus={onFocusSpy} />)
                wrapper.find('textarea').simulate('focus')
                expect(wrapper.state('focus')).to.be.true
                expect(onFocusSpy.calledOnce).to.be.true
            });

            it('失焦时正确改变state，正确调用props.onBlur', () => {
                const onFocusSpy = sinon.spy()
                const onBulrSpy = sinon.spy()
                const wrapper = shallow(
                    <TextArea
                        onFocus={onFocusSpy}
                        onBlur={onBulrSpy}
                    />
                );
                wrapper.find('textarea').simulate('focus')
                expect(wrapper.state('focus')).to.be.true

                wrapper.find('textarea').simulate('blur')
                expect(wrapper.state('focus')).to.be.false
                expect(onBulrSpy.calledOnce).to.be.true
            });

            it('输入值时，正确更新state，正确调用props.onChange回调', () => {
                const onChangeSpy = sinon.spy()
                const wrapper = shallow(<TextArea onChange={onChangeSpy} />);
                wrapper.find('textarea').simulate('change', { target: { value: 'test' } })
                expect(wrapper.state('value')).to.equal('test')
                expect(onChangeSpy.calledWith('test')).to.be.true
            });
        });
    });
});