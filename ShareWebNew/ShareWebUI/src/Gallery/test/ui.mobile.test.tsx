import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Gallery from '../ui.mobile';

describe.skip('ShareWebUI', () => {
    describe('Gallery@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Gallery></Gallery>)
            })

            it('默认分组大小为8，默认显示第一页，图片数量不超过8时不分页', () => {
                const wrapper = shallow(
                    <Gallery>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                    </Gallery>
                );
                expect(wrapper.find('li')).have.lengthOf(8)
                expect(wrapper.find('button').at(0).prop('disabled')).to.equal('disabled')
                expect(wrapper.find('button').at(1).prop('disabled')).to.equal('disabled')
                
            });

            it('默认分组大小为8，默认显示第一页，图片数量超过8时进行分页显示', () => {
                const wrapper = shallow(
                    <Gallery>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                    </Gallery>
                );
                expect(wrapper.find('li')).have.lengthOf(8)
                expect(wrapper.find('button').at(0).prop('disabled')).to.equal('disabled')
                expect(wrapper.find('button').at(1).prop('disabled')).to.equal('')   
            });

            it('支持自定义分组大小', () => {
                const wrapper = shallow(
                    <Gallery groupSize={2}>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                    </Gallery>
                );
                expect(wrapper.find('li')).have.lengthOf(2)
                expect(wrapper.find('button').at(0).prop('disabled')).to.equal('disabled')
                expect(wrapper.find('button').at(1).prop('disabled')).to.equal('')   
            });

            it('支持自定义索引页', () => {
                const wrapper = shallow(
                    <Gallery groupSize={2} groupIndex={1}>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                    </Gallery>
                );
                expect(wrapper.find('li')).have.lengthOf(1)
                expect(wrapper.find('button').at(0).prop('disabled')).to.equal('')
                expect(wrapper.find('button').at(1).prop('disabled')).to.equal('disabled')   
            });

        })

        describe('#event', () => {
            it('点击上一页正常', () => {
                const wrapper = shallow(
                    <Gallery groupSize={2} groupIndex={1}>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                    </Gallery>
                );
                expect(wrapper.find('li')).have.lengthOf(1)
                wrapper.find('button').at(0).simulate('click')
                expect(wrapper.find('li')).have.lengthOf(2)
            });

            it('点击下一页正常', () => {
                const wrapper = shallow(
                    <Gallery groupSize={2}>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                        <li><img src="test" alt="test" /></li>
                    </Gallery>
                );
                expect(wrapper.find('li')).have.lengthOf(2)
                wrapper.find('button').at(1).simulate('click')
                expect(wrapper.find('li')).have.lengthOf(1)
            });
        });
    });
});