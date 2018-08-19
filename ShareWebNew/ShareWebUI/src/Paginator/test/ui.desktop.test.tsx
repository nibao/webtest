import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Paginator from '../ui.desktop';
import __ from '../locale'
import * as styles from '../styles.desktop.css';


describe('ShareWebUI', () => {
    describe('Paginator', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Paginator />)
            })

            it('渲染结果中包含FlexBoxItem UIIcon TextInput', () => {
                const wrapper = shallow(<Paginator />);
                expect(wrapper.find('FlexBoxItem')).to.have.lengthOf(2)
                expect(wrapper.find('FlexBoxItem').at(0).find('UIIcon')).to.have.lengthOf(4) // 回到首页 上一页 下一页 跳到尾页 四个按钮
                expect(wrapper.find('FlexBoxItem').at(0).find('PageInput')).to.have.lengthOf(1) // 指定页码输入框
            });

            it('对应图标正确', () => {
                const wrapper = shallow(<Paginator />);
                const UIIconList = wrapper.find('UIIcon')
                expect(UIIconList.at(0).prop('code')).to.equal('\uf010') // 跳到首页图标
                expect(UIIconList.at(1).prop('code')).to.equal('\uf012') // 上一页图标
                expect(UIIconList.at(2).prop('code')).to.equal('\uf011') // 下一页图标
                expect(UIIconList.at(3).prop('code')).to.equal('\uf00f') // 跳到尾页图标
            });

            it('渲染结果中包含正确的提示文字', () => {
                const wrapper = shallow(<Paginator />);
                const leftFlexBoxItem = wrapper.find('FlexBoxItem').at(0)
                const rightFlexBoxItem = wrapper.find('FlexBoxItem').at(1)
                expect(leftFlexBoxItem.contains(__('第'))).to.be.true
                expect(leftFlexBoxItem.contains(__('页，共'))).to.be.true
                expect(leftFlexBoxItem.contains(__('页'))).to.be.true
                expect(leftFlexBoxItem.contains(__('第'))).to.be.true

                expect(rightFlexBoxItem.contains(__('显示'))).to.be.true
                expect(rightFlexBoxItem.contains(__('条，共'))).to.be.true
                expect(rightFlexBoxItem.contains(__('条'))).to.be.true
            });

            describe('总条数为0时', () => {
                const wrapper = shallow(<Paginator total={0} />);
                const leftFlexBoxItem = wrapper.find('FlexBoxItem').at(0)
                const rightFlexBoxItem = wrapper.find('FlexBoxItem').at(1)
                it('禁用所有按钮', () => {
                    wrapper.find('UIIcon').forEach(UIIcon => {
                        expect(UIIcon.prop('disabled')).to.be.true
                    })
                });

                it('页码以及条数提示正确(总页码显示为1 显示条数为0 - 0 总条数为0)', () => {
                    expect(wrapper.find('PageInput').prop('value')).to.equal(1)
                    expect(leftFlexBoxItem.find('div>div').at(3).text()).to.equal('1') // 总页码显示为1
                    expect(rightFlexBoxItem.find('div>div').at(0).text()).to.equal('0 - 0') // 显示条数为0 - 0
                    expect(rightFlexBoxItem.find('div>div').at(1).text()).to.equal('0') // 总条数为0
                });
            });

            describe('当前页为第一页', () => {
                let wrapper, leftFlexBoxItem, rightFlexBoxItem;
                it('禁用跳到首页和上一页按钮', () => {
                    wrapper = shallow(<Paginator page={1} total={200} limit={200} />);
                    expect(wrapper.find('UIIcon').at(0).prop('disabled')).to.be.true
                    expect(wrapper.find('UIIcon').at(1).prop('disabled')).to.be.true

                    wrapper = shallow(<Paginator page={1} total={201} limit={200} />);
                    expect(wrapper.find('UIIcon').at(0).prop('disabled')).to.be.true
                    expect(wrapper.find('UIIcon').at(1).prop('disabled')).to.be.true
                });

                it('页码以及条数提示正确', () => {
                    wrapper = shallow(<Paginator page={1} total={200} limit={200} />);
                    leftFlexBoxItem = wrapper.find('FlexBoxItem').at(0)
                    rightFlexBoxItem = wrapper.find('FlexBoxItem').at(1)

                    expect(wrapper.find('PageInput').prop('value')).to.equal(1)
                    expect(leftFlexBoxItem.find('div>div').at(3).text()).to.equal('1') // 总页码显示为1
                    expect(rightFlexBoxItem.find('div>div').at(0).text()).to.equal('1 - 200') // 显示条数为1 - 200
                    expect(rightFlexBoxItem.find('div>div').at(1).text()).to.equal('200') // 总条数为200


                    wrapper = shallow(<Paginator page={1} total={201} limit={200} />);
                    leftFlexBoxItem = wrapper.find('FlexBoxItem').at(0)
                    rightFlexBoxItem = wrapper.find('FlexBoxItem').at(1)

                    expect(wrapper.find('PageInput').prop('value')).to.equal(1)
                    expect(leftFlexBoxItem.find('div>div').at(3).text()).to.equal('2') // 总页码显示为2
                    expect(rightFlexBoxItem.find('div>div').at(0).text()).to.equal('1 - 200') // 显示条数为1 - 200
                    expect(rightFlexBoxItem.find('div>div').at(1).text()).to.equal('201') // 总条数为201

                });

            });

            describe('当前页为最后一页时', () => {
                let wrapper, leftFlexBoxItem, rightFlexBoxItem;
                it('禁用跳到尾页和下一页按钮', () => {
                    wrapper = shallow(<Paginator page={0} total={0} />);
                    expect(wrapper.find('UIIcon').at(0).prop('disabled')).to.be.true
                    expect(wrapper.find('UIIcon').at(1).prop('disabled')).to.be.true

                    wrapper = shallow(<Paginator page={10} total={200} limit={20} />);
                    expect(wrapper.find('UIIcon').at(2).prop('disabled')).to.be.true
                    expect(wrapper.find('UIIcon').at(3).prop('disabled')).to.be.true
                });

                it('页码以及条数提示正确', () => {
                    wrapper = shallow(<Paginator page={10} total={200} limit={20} />);
                    leftFlexBoxItem = wrapper.find('FlexBoxItem').at(0)
                    rightFlexBoxItem = wrapper.find('FlexBoxItem').at(1)

                    expect(wrapper.find('PageInput').prop('value')).to.equal(10)
                    expect(leftFlexBoxItem.find('div>div').at(3).text()).to.equal('10') // 总页码显示为10
                    expect(rightFlexBoxItem.find('div>div').at(0).text()).to.equal('181 - 200') // 显示条数为181 - 200
                    expect(rightFlexBoxItem.find('div>div').at(1).text()).to.equal('200') // 总条数为200
                });
            });
        })

        describe('#event', () => {
            it('点击回到首页', () => {
                const wrapper = shallow(<Paginator page={10} total={200} limit={20} />);
                expect(wrapper.find('PageInput').prop('value')).to.equal(10)
                wrapper.find('UIIcon').at(0).simulate('click')
                const leftFlexBoxItem = wrapper.find('FlexBoxItem').at(0)
                const rightFlexBoxItem = wrapper.find('FlexBoxItem').at(1)

                expect(wrapper.find('PageInput').prop('value')).to.equal(1)
                expect(leftFlexBoxItem.find('div>div').at(3).text()).to.equal('10') // 总页码显示为10
                expect(rightFlexBoxItem.find('div>div').at(0).text()).to.equal('1 - 20') // 显示条数为1 - 20
                expect(rightFlexBoxItem.find('div>div').at(1).text()).to.equal('200') // 总条数为200
            });

            it('点击上一页', () => {
                const wrapper = shallow(<Paginator page={10} total={200} limit={20} />);
                expect(wrapper.find('PageInput').prop('value')).to.equal(10)
                wrapper.find('UIIcon').at(1).simulate('click')
                const leftFlexBoxItem = wrapper.find('FlexBoxItem').at(0)
                const rightFlexBoxItem = wrapper.find('FlexBoxItem').at(1)

                expect(wrapper.find('PageInput').prop('value')).to.equal(9)
                expect(leftFlexBoxItem.find('div>div').at(3).text()).to.equal('10') // 总页码显示为10
                expect(rightFlexBoxItem.find('div>div').at(0).text()).to.equal('161 - 180') // 显示条数为161 - 180
                expect(rightFlexBoxItem.find('div>div').at(1).text()).to.equal('200') // 总条数为200
            });

            it('点击下一页', () => {
                const wrapper = shallow(<Paginator page={9} total={200} limit={20} />);
                expect(wrapper.find('PageInput').prop('value')).to.equal(9)
                wrapper.find('UIIcon').at(2).simulate('click')
                const leftFlexBoxItem = wrapper.find('FlexBoxItem').at(0)
                const rightFlexBoxItem = wrapper.find('FlexBoxItem').at(1)

                expect(wrapper.find('PageInput').prop('value')).to.equal(10)
                expect(leftFlexBoxItem.find('div>div').at(3).text()).to.equal('10') // 总页码显示为10
                expect(rightFlexBoxItem.find('div>div').at(0).text()).to.equal('181 - 200') // 显示条数为181 - 200
                expect(rightFlexBoxItem.find('div>div').at(1).text()).to.equal('200') // 总条数为200
            });

            it('点击跳到尾页', () => {
                const wrapper = shallow(<Paginator page={2} total={200} limit={20} />);
                expect(wrapper.find('PageInput').prop('value')).to.equal(2)
                wrapper.find('UIIcon').at(3).simulate('click')
                const leftFlexBoxItem = wrapper.find('FlexBoxItem').at(0)
                const rightFlexBoxItem = wrapper.find('FlexBoxItem').at(1)

                expect(wrapper.find('PageInput').prop('value')).to.equal(10)
                expect(leftFlexBoxItem.find('div>div').at(3).text()).to.equal('10') // 总页码显示为10
                expect(rightFlexBoxItem.find('div>div').at(0).text()).to.equal('181 - 200') // 显示条数为181 - 200
                expect(rightFlexBoxItem.find('div>div').at(1).text()).to.equal('200') // 总条数为200
            });

            it('输入合法页码，跳转到指定页', () => {
                const wrapper = mount(<Paginator page={2} total={200} limit={20} />);
                expect(wrapper.find('input').prop('value')).to.equal(2)
                wrapper.find('input').simulate('change', { target: { value: 5 } })
                const leftFlexBoxItem = wrapper.find('FlexBoxItem').at(0)
                const rightFlexBoxItem = wrapper.find('FlexBoxItem').at(1)

                expect(wrapper.find('PageInput').prop('value')).to.equal(5)
                expect(leftFlexBoxItem.find(`.${styles['page-info']}`).at(1).text()).to.equal('10') // 总页码显示为10
                expect(rightFlexBoxItem.find(`.${styles['page-info']}`).at(0).text()).to.equal('81 - 100') // 显示条数为181 - 200
                expect(rightFlexBoxItem.find(`.${styles['page-info']}`).at(1).text()).to.equal('200') // 总条数为200
            });

        });
    });
});