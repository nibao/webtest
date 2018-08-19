import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FontIcon from '../ui.mobile';
import * as sinon from 'sinon';
import * as styles from '../styles.mobile.css'


describe('ShareWebUI', () => {
    describe('FontIcon@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<FontIcon code={'\uf004'}></FontIcon>);
            });

            it('正确设置title属性', () => {
                const wrapper = shallow(<FontIcon title="testTitle" code={'\uf004'}></FontIcon>);
                expect(wrapper.find('span').prop('title')).to.equal('testTitle')

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


            it('允许自定义style', () => {
                const wrapper = shallow(<FontIcon font="testFont" size={12} color="#fff" code={'\uf004'}></FontIcon>);
                expect(wrapper.find('span').prop('style')).to.deep.equal({
                    fontFamily: 'testFont',
                    fontSize: 12,
                    color: '#fff'
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