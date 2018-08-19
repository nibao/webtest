import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as sinon from 'sinon';
import * as styles from '../styles.mobile.css';

/*Calendar中的 defaulProps在import的时候初始化，因此需要在import模块前mock时间 
 *mock当前日期为2018年2月
 *使用后必须restore
*/
const clock = sinon.useFakeTimers(new Date(2018, 1).getTime())
import Calendar from '../ui.mobile';
clock.restore(); // restore日期

describe('ShareWebUI', () => {
    describe('Calendar@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Calendar />)
            });

            it('加载指定月份', () => {
                const wrapper = mount(<Calendar year={2016} month={9} />);
                expect(wrapper.find('thead > tr')).to.have.lengthOf(1) // 只有一行显示星期
                expect(wrapper.find('thead > tr > th')).to.have.lengthOf(7) // 一周7天
                expect(wrapper.find('tbody > tr')).to.have.lengthOf(5) // 日期有5行
                expect(wrapper.find('tbody LinkChip')).to.have.lengthOf(30) // 总共30天
                /* 日期中前四个td为上月日期，为空 */
                wrapper.find('tbody > tr').at(0).children().forEach((node, index) => {
                    index <= 3 && expect(node.children()).to.have.lengthOf(0)
                })
                expect(wrapper.find('tbody > tr').at(0).find('td').at(4).text()).to.equal('1'); // 第一个tr中的第6个td渲染1号
                expect(wrapper.find('tbody > tr').at(4).find('td').at(5).text()).to.equal('30'); // 第五个tr中的第6个td渲染30号
            });

            it('不指定日期，默认加载当月', () => {
                const wrapper = mount(<Calendar />);
                expect(wrapper.find('thead > tr')).to.have.lengthOf(1) // 只有一行显示星期
                expect(wrapper.find('thead > tr > th')).to.have.lengthOf(7) // 一周7天
                expect(wrapper.find('tbody > tr')).to.have.lengthOf(5) // 日期有5行
                expect(wrapper.find('tbody LinkChip')).to.have.lengthOf(28) // 总共28天
                /* 日期中前四个td为上月日期，为空 */
                wrapper.find('tbody > tr').at(0).children().forEach((node, index) => {
                    index <= 3 && expect(node.children()).to.have.lengthOf(0)
                })
                expect(wrapper.find('tbody > tr').at(0).find('td').at(4).text()).to.equal('1'); // 第一个tr中的第6个td渲染1号
                expect(wrapper.find('tbody > tr').at(4).find('td').at(3).text()).to.equal('28'); // 第五个tr中的第6个td渲染30号
            });

            it('选中日期className正确', () => {
                const wrapper = mount(<Calendar select={new Date(2018, 1, 10)} />);
                expect(wrapper.find(`.${styles['selected']}`)).to.have.lengthOf(1)
                expect(wrapper.find('tbody > tr').at(1).find('td').at(6).hasClass(styles['selected'])).to.be.true
            });

        });

        describe('#onSelect', () => {
            it('选择日期', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Calendar year={2016} month={9} onSelect={spy} />);

                wrapper.find('tbody > tr').at(2).find('td').at(4).find('LinkChip').simulate('touchEnd');
                expect(spy.calledOnce).equal(true);
                expect(spy.firstCall.args[0]).instanceOf(Date);
                expect(spy.firstCall.args[0].getTime()).equal(new Date(2016, 8, 15, 23, 59, 59).getTime());
            });

            it('props传入disable为true时禁用所有日期选择', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Calendar disabled={true} onSelect={spy} />);
                wrapper.find('tbody LinkChip').forEach(node => {
                    node.simulate('touchEnd')
                })
                expect(spy.called).to.be.false
            });

            /* selectRange的处理和desktop的不一致，暂时不改，跳过测试 */
            it.skip('设置选择范围时非选择范围内的日期无法点击', () => {
                const spy = sinon.spy();
                /* 设置可选择日期范围为2018-2-10 到 2018-2-12*/
                const wrapper = mount(<Calendar selectRange={[new Date(2018, 1, 10), new Date(2018, 1, 12)]} onSelect={spy} />);
                // console.log(wrapper.debug());
                /* 点击1-9日的任意一天,不触发选择事件 */
                wrapper.find('tbody LinkChip').forEach((node, index) => {
                    index < 9 && node.simulate('touchEnd')
                })
                expect(spy.called).to.be.false

                /* 点击10-12日中任意一天触发选择事件 */
                wrapper.find('tbody LinkChip').at(9).simulate('touchEnd');
                expect(spy.calledOnce).to.be.true
                wrapper.find('tbody LinkChip').at(10).simulate('touchEnd');
                expect(spy.calledTwice).to.be.true
                console.log('移动端')
                console.log(wrapper.find('tbody LinkChip').at(11).debug())
                wrapper.find('tbody LinkChip').at(11).simulate('touchEnd');
                expect(spy.calledThrice).to.be.true

                /* 点击13-28日任意一天，不触发选择事件 */
                wrapper.find('tbody LinkChip').forEach((node, index) => {
                    index > 13 && node.simulate('touchEnd')
                })
                expect(spy.calledThrice).to.be.true

            });
        })
    });
});