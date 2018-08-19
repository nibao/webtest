import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import HeadBar from '../ui.desktop';
import * as styles from '../styles.desktop';

describe('ShareWebUI', () => {
    describe('HeadBar@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<HeadBar></HeadBar>)
            })

            it('渲染结果中应该包含两个div，一个为tile一个为下划线', () => {
                const wrapper = shallow(<HeadBar></HeadBar>);
                expect(wrapper.find('div>div')).to.have.lengthOf(2)
                expect(wrapper.find('div>div').at(0).hasClass(styles['title'])).to.be.true
                expect(wrapper.find('div>div').at(1).hasClass(styles['line'])).to.be.true
            });

            it('渲染标题内容正确', () => {
                const wrapper = shallow(<HeadBar><span>test</span></HeadBar>);
                expect(wrapper.find('div>div').at(0).contains(<span>test</span>)).to.be.true
            });
        })
    });
});