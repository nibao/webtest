import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LinkIcon from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('LinkIcon@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<LinkIcon />)
            })

            it('渲染结果为a标签中包含Icon子组件', () => {
                const wrapper = shallow(<LinkIcon />)
                expect(wrapper.type()).to.equal('a')
                expect(wrapper.childAt(0).name()).to.equal('Icon')
            });

            it('允许自定义className', () => {
                const wrapper = shallow(<LinkIcon className="test" />)
                expect(wrapper.hasClass('test')).to.be.true
            })

            it('设置禁用时，正确设置禁用样式', () => {
                const wrapper = shallow(<LinkIcon disabled={true} />)
                expect(wrapper.hasClass(styles['disabled']))
            })

            it('传入size属性时，设置a标签的宽高为size值，设置Icon组件的size属性为传入的size', () => {
                const wrapper = shallow(<LinkIcon size={50} />)
                expect(wrapper.prop('style')).to.deep.equal({ width: 50, height: 50 })
                expect(wrapper.find('Icon').prop('size')).to.equal(50)
            });

            it('正确传递url属性到Icon的url属性', () => {
                const wrapper = shallow(<LinkIcon url="test" />)
                expect(wrapper.find('Icon').prop('url')).to.equal('test') 
            });
        })

        describe('#event', () => {
            it('未禁用时，点击触发点击事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<LinkIcon onClick={spy} />)
                wrapper.simulate('click')
                expect(spy.calledOnce).to.be.true
            });

            it('禁用时，点击不触发点击事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<LinkIcon disabled={true} onClick={spy} />)
                wrapper.simulate('click')
                expect(spy.called).to.be.false
            });
        });
    });
});