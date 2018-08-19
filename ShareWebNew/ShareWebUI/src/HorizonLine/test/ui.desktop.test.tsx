import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import HorizonLine from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('HorizonLine@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<HorizonLine />)
            })

            it('渲染结果为hr标签', () => {
                const wrapper = shallow(<HorizonLine />);
                expect(wrapper.type()).to.equal('hr')                
            });

            it('默认高度为1', () => {
                const wrapper = shallow(<HorizonLine />);
                expect(wrapper.prop('style').borderBottomWidth).to.equal(1)

            });

            it('允许自定义高度', () => {
                const wrapper = shallow(<HorizonLine height={2} />);
                expect(wrapper.prop('style').borderBottomWidth).to.equal(2)
            });
        })
    });
});