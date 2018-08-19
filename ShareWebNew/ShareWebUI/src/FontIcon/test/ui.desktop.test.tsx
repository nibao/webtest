import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FontIcon from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('FontIcon@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<FontIcon code={'\uf004'}></FontIcon>);
            });

            it('默认不渲染Title子组件', () => {
                const wrapper = shallow(<FontIcon code={'\uf004'}></FontIcon>);
                expect(wrapper.find('Title').exists()).to.be.false
                expect(wrapper.find('span').exists()).to.be.true
            });

            it('允许自定义className', () => {
                const wrapper = shallow(<FontIcon className="test" code={'\uf004'}></FontIcon>);
                expect(wrapper.find('span').hasClass('test')).to.be.true
            });

            it('onClick为函数时，即可点击时className正确', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<FontIcon onClick={spy} code={'\uf004'}></FontIcon>);
                expect(wrapper.find('span').hasClass(styles['link'])).to.be.true
            });

            it('disabled时className正确', () => {
                const wrapper = shallow(<FontIcon disabled={true} code={'\uf004'}></FontIcon>);
                expect(wrapper.find('span').hasClass(styles['disabled'])).to.be.true
            });

            it('props传入title时，渲染Title子组件，并且content正确', () => {
                const wrapper = shallow(<FontIcon title="test" code={'\uf004'}></FontIcon>);
                expect(wrapper.find('Title').exists()).to.be.true
                expect(wrapper.find('Title').prop('content')).to.equal('test')
            });

            it('Title允许自定义className', () => {
                const wrapper = shallow(<FontIcon titleClassName="testClassName" title="test" code={'\uf004'}></FontIcon>);
                expect(wrapper.find('Title').prop('className')).to.equal('testClassName')
            });

            it('允许自定义style（fontFamily fontSize color）', () => {
                const wrapper = shallow(<FontIcon font="testFont" size={12} color="#fff" code={'\uf004'}></FontIcon>);
                expect(wrapper.find('span').prop('style')).to.deep.equal({
                    fontFamily: 'testFont',
                    fontSize: 12,
                    color: '#fff',
                })
            });

            it('IE8以及使用https的IE9下fallback图片问题不进行测试');

        });


        describe('#event', () => {
            it('未禁用时点击调用onClick事件处理函数', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<FontIcon onClick={spy} code={'\uf004'}></FontIcon>);
                wrapper.find('span').simulate('click')
                expect(spy.calledOnce).to.be.true
            });

            it('禁用时点击不调用onClick事件处理函数', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<FontIcon disabled={true} onClick={spy} code={'\uf004'}></FontIcon>);
                wrapper.find('span').simulate('click')
                expect(spy.calledOnce).to.be.false
            });
        });
    });
});