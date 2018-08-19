import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TweetBox from '../ui.desktop';
import __ from '../locale';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('TweetBox', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<TweetBox />)
            })

            it('渲染结果为TextArea', () => {
                const wrapper = shallow(<TweetBox />);
                expect(wrapper.name()).to.equal('TextArea')
            });

            it('默认placeholder为“最多可输入140字”', () => {
                const wrapper = shallow(<TweetBox />);
                expect(wrapper.prop('placeholder')).to.equal(__('最多可输入140字'))
            });

            it('允许自定义value', () => {
                const wrapper = shallow(<TweetBox value="test" />);
                expect(wrapper.prop('value')).to.equal('test')
            });

            it('允许自定义style', () => {
                const wrapper = shallow(<TweetBox style={{ color: 'red' }} />);
                expect(wrapper.prop('style')).to.deep.equal({ color: 'red' })
            });

            it('允许自定义onChange回调', () => {
                const onChangeSpy = sinon.spy();
                const wrapper = shallow(<TweetBox onChange={onChangeSpy} />);
                expect(wrapper.prop('onChange')).to.equal(onChangeSpy)
            });

        })
    });
});