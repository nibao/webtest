import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Tip from '../ui.desktop';
import * as styles from '../styles.desktop.css';


describe('ShareWebUI', () => {
    describe('Tip@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Tip></Tip>)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<Tip className="test"></Tip>)
                expect(wrapper.hasClass('test')).to.be.true
            });


            it('默认align为right，borderColor为#bdbdbd，backgroundColor为#fafafa', () => {
                const wrapper = shallow(<Tip></Tip>)

                // 左箭头外框线
                expect(wrapper.find(`.${styles['pointer']}`).hasClass(styles['pointer-right'])).to.be.true
                expect(wrapper.find(`.${styles['pointer']}`).prop('style')).to.deep.equal({ borderColor: `transparent #bdbdbd transparent transparent` })

                // 左箭头内部颜色
                expect(wrapper.find(`.${styles['pointer-inner']}`).hasClass(styles['pointer-inner-right'])).to.be.true
                expect(wrapper.find(`.${styles['pointer-inner']}`).prop('style')).to.deep.equal({ borderColor: `transparent #fafafa transparent transparent` })

                // 内容区域
                expect(wrapper.find(`.${styles['content']}`).hasClass(styles['nowarp'])).to.be.false
                expect(wrapper.find(`.${styles['content']}`).prop('style')).to.deep.equal({ borderColor: '#bdbdbd', backgroundColor: '#fafafa' })

            });

            it('允许自定义边框颜色borderColor', () => {
                const wrapper = shallow(<Tip borderColor="#ccc"></Tip>)

                // 左箭头外框线
                expect(wrapper.find(`.${styles['pointer']}`).hasClass(styles['pointer-right'])).to.be.true
                expect(wrapper.find(`.${styles['pointer']}`).prop('style')).to.deep.equal({ borderColor: `transparent #ccc transparent transparent` })

                // 左箭头内部颜色
                expect(wrapper.find(`.${styles['pointer-inner']}`).hasClass(styles['pointer-inner-right'])).to.be.true
                expect(wrapper.find(`.${styles['pointer-inner']}`).prop('style')).to.deep.equal({ borderColor: `transparent #fafafa transparent transparent` })

                // 内容区域
                expect(wrapper.find(`.${styles['content']}`).hasClass(styles['nowarp'])).to.be.false
                expect(wrapper.find(`.${styles['content']}`).prop('style')).to.deep.equal({ borderColor: '#ccc', backgroundColor: '#fafafa' })
            });

            it('允许自定义backgroundColor', () => {
                const wrapper = shallow(<Tip backgroundColor="#FFF"></Tip>)

                // 左箭头外框线
                expect(wrapper.find(`.${styles['pointer']}`).hasClass(styles['pointer-right'])).to.be.true
                expect(wrapper.find(`.${styles['pointer']}`).prop('style')).to.deep.equal({ borderColor: `transparent #bdbdbd transparent transparent` })

                // 左箭头内部颜色
                expect(wrapper.find(`.${styles['pointer-inner']}`).hasClass(styles['pointer-inner-right'])).to.be.true
                expect(wrapper.find(`.${styles['pointer-inner']}`).prop('style')).to.deep.equal({ borderColor: `transparent #FFF transparent transparent` })

                // 内容区域
                expect(wrapper.find(`.${styles['content']}`).hasClass(styles['nowarp'])).to.be.false
                expect(wrapper.find(`.${styles['content']}`).prop('style')).to.deep.equal({ borderColor: '#bdbdbd', backgroundColor: '#FFF' })
            });

            it('当传入align不为right时，渲染向下的箭头，并且箭头位于内容区下', () => {
                const wrapper = shallow(<Tip align="top"></Tip>)

                // 下箭头外框线
                expect(wrapper.find(`.${styles['pointer']}`).hasClass(styles['pointer-top'])).to.be.true
                expect(wrapper.find(`.${styles['pointer']}`).prop('style')).to.deep.equal({ borderColor: `#bdbdbd transparent transparent transparent` })

                // 下箭头内部颜色
                expect(wrapper.find(`.${styles['pointer-inner']}`).hasClass(styles['pointer-inner-top'])).to.be.true
                expect(wrapper.find(`.${styles['pointer-inner']}`).prop('style')).to.deep.equal({ borderColor: `#fafafa transparent transparent transparent` })

                // 内容区域
                expect(wrapper.find(`.${styles['content']}`).hasClass(styles['nowarp'])).to.be.true
                expect(wrapper.find(`.${styles['content']}`).prop('style')).to.deep.equal({ borderColor: '#bdbdbd', backgroundColor: '#fafafa' })
            });
        })
    });
});