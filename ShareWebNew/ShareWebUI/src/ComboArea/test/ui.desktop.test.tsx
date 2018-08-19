import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import ComboArea from '../ui.desktop';
import aac from '../../../libs/hls.js/lib/helper/aac';

describe('ShareWebUI', () => {
    describe('ComboArea@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ComboArea />)
            });

            it('默认minHeight为50,maxHeight为100', () => {
                const wrapper = shallow(<ComboArea />);
                expect(wrapper.prop('minHeight')).to.equal(50)
                expect(wrapper.prop('maxHeight')).to.equal(100)
            });

            it('允许自定义width', () => {
                const wrapper = shallow(<ComboArea width={400} />);
                expect(wrapper.prop('width')).to.equal(400)
            });

            it('允许自定义height', () => {
                const wrapper = shallow(<ComboArea height={200} />);
                expect(wrapper.prop('height')).to.equal(200)
            });

            it('允许自定义maxHeight', () => {
                const wrapper = shallow(<ComboArea maxHeight={400} />);
                expect(wrapper.prop('maxHeight')).to.equal(400)
            });

            it('允许自定义minHeight', () => {
                const wrapper = shallow(<ComboArea minHeight={200} />);
                expect(wrapper.prop('minHeight')).to.equal(200)
            });

            it('默认渲染结果中不包含Chip组件，包含FlexTextBox组件', () => {
                const wrapper = shallow(<ComboArea />);
                expect(wrapper.name()).to.equal('Control')
                expect(wrapper.find('Chip').exists()).to.be.false
                expect(wrapper.find('FlexTextBox').exists()).to.be.true
            });

            it('传入默认value，渲染结果中应该包含对应的Chip组件', () => {
                const wrapper = shallow(<ComboArea value={[1, 2, 3]} />);
                expect(wrapper.find('Chip')).to.have.lengthOf(3);
                expect(wrapper.find('Chip').at(0).childAt(0).text()).to.equal('1');
                expect(wrapper.find('Chip').at(1).childAt(0).text()).to.equal('2');
                expect(wrapper.find('Chip').at(2).childAt(0).text()).to.equal('3');
                expect(wrapper.find('FlexTextBox').exists()).to.be.true
            });

            it('允许自定义placeholder', () => {
                const wrapper = shallow(<ComboArea placeholder="test" />);
                expect(wrapper.find('FlexTextBox').prop('placeholder')).to.equal('test')
            });

            it('有value时，不渲染placeholder', () => {
                const wrapper = shallow(<ComboArea placeholder="test" value={[1, 2, 3]} />);
                expect(wrapper.find('FlexTextBox').prop('placeholder')).to.equal('')
            });

            it('不可编辑时不渲染FlexTextBox', () => {
                const wrapper = shallow(<ComboArea uneditable={true} />);
                expect(wrapper.find('FlexTextBox').exists()).to.be.false
            });
        });

        describe.skip('#event', () => {
            it('输入值后按回车键，正确添加Chip，并且清空输入(这个测试不具备可参考价值，只是技术参考)', (done) => {
                const wrapper = mount(<ComboArea />);
                expect(wrapper.find('Chip')).to.have.lengthOf(0)
                /* 模拟contentEditable div中的输入值 */
                wrapper.find('FlexTextBox').instance().refs.textbox.textContent = 'test'
                wrapper.find('FlexTextBox').instance().refs.textbox.innerText = 'test'
                /* 模拟在div中按键，触发FlexTextBox的state更新 */
                wrapper.find('FlexTextBox div').simulate('keyDown')
                expect(wrapper.find('FlexTextBox').instance().state.value).to.equal('test')
                setTimeout(() => {
                    expect(wrapper.find('FlexTextBox').instance().state.value).to.equal('')
                    expect(wrapper.find('Chip')).to.have.lengthOf(1)
                    done()
                }, 0)
            });
        });
    });
});