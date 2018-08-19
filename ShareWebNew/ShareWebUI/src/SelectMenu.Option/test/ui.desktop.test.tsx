import * as React from 'react';
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import SelectMenuOption from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('SelectMenuOption@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<SelectMenuOption />)
            })

            it('渲染结果PopMenuItem', () => {
                const wrapper = shallow(<SelectMenuOption />)
                expect(wrapper.name()).to.equal('PopMenuItem')
            });

            it('当传入value不为undefined，并且选中时，设置PopMenuItem的icon', () => {
                const wrapper = shallow(<SelectMenuOption value="test" selected={true} />)
                expect(wrapper.prop('icon')).to.equal('\uf068')
            });
            it('当传入value不为undefined或未选中时，设置PopMenuItem的icon为undefined', () => {
                let wrapper: ShallowWrapper;
                wrapper = shallow(<SelectMenuOption selected={true} />)
                expect(wrapper.prop('icon')).to.be.undefined

                wrapper = shallow(<SelectMenuOption value="test" selected={false} />)
                expect(wrapper.prop('icon')).to.be.undefined

                wrapper = shallow(<SelectMenuOption />)
                expect(wrapper.prop('icon')).to.be.undefined
            });
        })
    });
});