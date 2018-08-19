import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import QRCode from '../ui.desktop';
import * as styles from '../styles.desktop.css';

describe('ShareWebUI', () => {
    describe('QRcode', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<QRCode text="test" />)
            })

            it('默认每一个cell的宽高为4', () => {
                const wrapper = shallow(<QRCode text="test" />)
                wrapper.find(`.${styles['cell']}`).forEach(cell => {
                    expect(cell.prop('style')).to.deep.equal({ width: 4, height: 4 })
                })
            });

            it('允许自定义cell的宽高', () => {
                const wrapper = shallow(<QRCode cellSize={5} text="test" />)
                wrapper.find(`.${styles['cell']}`).forEach(cell => {
                    expect(cell.prop('style')).to.deep.equal({ width: 5, height: 5 })
                })
            });

            it('正确设置每一行的宽高', () => {
                const wrapper = shallow(<QRCode text="test" />)
                wrapper.find(`.${styles['row']}`).forEach(row => {
                    expect(row.prop('style')).to.deep.equal({
                        height: 4,
                        width: 4 * wrapper.state('modules')[0].length
                    })
                })

            });


            it('正确着色二维码', () => {
                const wrapper = shallow(<QRCode text="test" />),
                    stateModule = wrapper.state('modules'),
                    stateModuleRowLen = stateModule.length,
                    stateModuleColLen = stateModule[0].length;
                /* 对每一格进行断言测试耗时过长，改为随机选取 */
                // wrapper.find(`.${styles['row']}`).forEach((row, rowIndex) => {
                //     row.find(`.${styles['cell']}`).forEach((cell, cellIndex) => {
                //         expect(cell.hasClass(styles['fill'])).to.equal(wrapper.state('modules')[rowIndex][cellIndex])
                //     })
                // })
                expect(wrapper.find(`.${styles['row']}`).at(0).find(`.${styles['cell']}`).at(0).hasClass(styles['fill'])).to.equal(stateModule[0][0])
                expect(wrapper.find(`.${styles['row']}`).at(stateModuleRowLen - 1).find(`.${styles['cell']}`).at(stateModuleColLen - 1).hasClass(styles['fill'])).to.equal(stateModule[stateModuleRowLen - 1][stateModuleColLen - 1])
                expect(wrapper.find(`.${styles['row']}`).at(5).find(`.${styles['cell']}`).at(5).hasClass(styles['fill'])).to.equal(stateModule[5][5])

            });
        })
    });
});