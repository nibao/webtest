import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ScrollBar from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('ScrollBar@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ScrollBar />)
            })

            it('允许自定义滚动条外层className', () => {
                const wrapper = shallow(<ScrollBar className="test" />);
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('设置为水平滚动条时，滚动条容器宽度为100%，高度为15px，滚动条宽度为自定义宽度，高度', () => {

            });

            describe('设置为水平滚动条时（axis属性为"x"）：', () => {
                const wrapper = shallow(<ScrollBar axis="x" length={12} offsetValue={20} />);

                it('滚动条容器宽度为100%，高度为15px', () => {
                    expect(wrapper.find(`.${styles['scroll']}`).prop('style')).to.deep.equal({
                        width: '100%',
                        height: '15px'
                    })
                });
                it('滚动条宽度为length，高度为15px，距左offsetValue的值，距上0', () => {
                    expect(wrapper.find(`.${styles['scrollbar']}`).prop('style')).to.deep.equal({
                        width: '12px',
                        height: '15px',
                        left: '20px',
                        top: 0
                    })
                });
            });

            describe('设置为垂直滚动条时（axis属性为"y"）：', () => {
                const wrapper = shallow(<ScrollBar axis="y" length={18} offsetValue={30} />);

                it('滚动条容器高度为100%，宽度为15px', () => {
                    expect(wrapper.find(`.${styles['scroll']}`).prop('style')).to.deep.equal({
                        height: '100%',
                        width: '15px'
                    })
                });
                it('滚动条高度为length，宽度为15px，距上为offsetValue的值，距左0', () => {
                    expect(wrapper.find(`.${styles['scrollbar']}`).prop('style')).to.deep.equal({
                        width: '15px',
                        height: '18px',
                        left: 0,
                        top: '30px'
                    })
                });
            });
        })

        describe('#event', () => {
            it('在滚动条上按下鼠标，调用onDrag回调', () => {
                const onDragSpy = sinon.spy(),
                    wrapper = shallow(<ScrollBar axis="x" length={12} offsetValue={20} onDrag={onDragSpy} />);
                wrapper.find(`.${styles['scrollbar']}`).simulate('mouseDown')
                expect(onDragSpy.calledOnce).to.be.true
            });
        });
    });
});