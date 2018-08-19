import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RadioBoxOption from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('RadioBoxOption@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<RadioBoxOption></RadioBoxOption>)
            })

            it('渲染中包含RadioBox组件', () => {
                const wrapper = shallow(<RadioBoxOption></RadioBoxOption>)
                expect(wrapper.find('RadioBox')).to.have.lengthOf(1)
            });

            it('正确传递属性到RadioBox中', () => {
                const onChangeSpy = sinon.spy(),
                    onUncheckSpy = sinon.spy(),
                    onCheckSpy = sinon.spy(),
                    wrapper = shallow(
                        <RadioBoxOption
                            value="testValue"
                            disabled={true}
                            checked={true}
                            onChange={onChangeSpy}
                            onUncheck={onUncheckSpy}
                            onCheck={onCheckSpy}
                            className="testClassName"
                        >
                        </RadioBoxOption>
                    )
                expect(wrapper.find('RadioBox').props()).to.to.deep.equal({
                    value: 'testValue',
                    disabled: true,
                    checked: true,
                    onChange: onChangeSpy,
                    onUncheck: onUncheckSpy,
                    onCheck: onCheckSpy,
                    className: 'testClassName'
                })

            });

            it('禁用时文字className正确', () => {
                const wrapper = shallow(<RadioBoxOption disabled={true}></RadioBoxOption>)
                expect(wrapper.find('span').hasClass(styles['disabled'])).to.be.true
            });

            it('提示文字渲染正确', () => {
                const wrapper = shallow(<RadioBoxOption>test</RadioBoxOption>)
                expect(wrapper.find('span').childAt(0).text()).to.equal('test')
            });
        })
    });
});