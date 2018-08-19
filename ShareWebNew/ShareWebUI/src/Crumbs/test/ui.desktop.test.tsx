import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import Crumbs from '../ui.desktop';
import __ from '../locale';

describe('ShareWebUI', () => {
    describe('Crumbs@desktop', () => {
        describe('#render', () => {
            it('正确渲染出面包屑路径', () => {
                const wrapper = shallow(<Crumbs crumbs={[{ name: 'foo' }, { name: 'bar' }]} formatter={crumb => crumb.name} />);
                expect(wrapper.find('LinkChip').first().contains(__('回到上一层'))).to.equal(true);
                expect(wrapper.find('ol > li LinkChip').at(0).contains('foo')).to.equal(true);
                expect(wrapper.find('ol > li LinkChip').at(1).contains('bar')).to.equal(true);
            });
        });

        describe('#回到上一层', () => {
            it('回到上一层路径', () => {
                const wrapper = shallow(<Crumbs crumbs={['foo', 'bar', 'baz']} />);
                wrapper.find('LinkChip').first().simulate('click');
                expect(wrapper.find('ol > li LinkChip')).to.have.length(2);
                expect(wrapper.find('ol > li LinkChip').at(0).contains('foo')).to.equal(true);
                expect(wrapper.find('ol > li LinkChip').at(1).contains('bar')).to.equal(true)
            });

            it('只剩2层的情况下，回到上一层后只剩不可点击的一层', () => {
                const wrapper = shallow(<Crumbs crumbs={['foo', 'bar']} />);
                wrapper.find('LinkChip').first().simulate('click');
                expect(wrapper.find('LinkChip')).to.have.length(0);
                expect(wrapper.find('span').first().contains('foo')).to.equal(true);
            })
        })

        describe('#onClick', () => {
            it('传递参数：点击的crumb数据', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<Crumbs crumbs={['foo', 'bar']} onClick={spy} />);
                wrapper.find('ol > li LinkChip').first().simulate('click');
                expect(spy.firstCall.args[0]).deep.equal('foo');
            });
        })


        describe('#onChange', () => {
            it('传递参数：更改后的crumbs数据', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<Crumbs crumbs={['foo', 'bar', 'baz']} onChange={spy} />);
                wrapper.find('ol > li LinkChip').at(1).simulate('click');
                expect(spy.firstCall.args[0]).deep.equal(['foo', 'bar']);
            });
        });
    });
});