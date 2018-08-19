import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Crumbs from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('Crumbs@mobile', () => {

        describe('#render', () => {
            it('正确渲染出面包屑路径', () => {
                const wrapper = shallow(<Crumbs crumbs={[{ name: 'foo' }, { name: 'bar' }]} formatter={crumb => crumb.name} />);
                expect(wrapper.find('LinkIcon')).to.have.length(1);
                expect(wrapper.find('div > div').at(1).text()).to.equal('bar');
            });
        });

        describe('#回到上一层', () => {
            it('回到上一层路径', () => {
                const wrapper = shallow(<Crumbs crumbs={[{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }]} formatter={crumb => crumb.name} />);
                expect(wrapper.state('crumbs')).to.deep.equal([{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }])
                expect(wrapper.find('div > div').at(1).text()).to.equal('baz');
                wrapper.find('LinkIcon').simulate('click');
                expect(wrapper.state('crumbs')).to.deep.equal([{ name: 'foo' }, { name: 'bar' }])
                expect(wrapper.find('div > div').at(1).text()).to.equal('bar');

            });
        });
    })
})