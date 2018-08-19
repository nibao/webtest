import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Menu from '../ui.mobile';
import * as styles from '../styles.mobile.css';


describe('ShareWebUI', () => {
    describe('Menu@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Menu></Menu>)
            })

            it('props包含width时，设置最外层div box-sizing为border-box，设置style width', () => {
                const wraperr = shallow(<Menu width={10}></Menu>)
                expect(wraperr.hasClass(styles['box-sizing-border-box'])).to.true
                expect(wraperr.prop('style').width).to.equal(10)
            });

            it('props包含maxHeight时，设置最外层div的style maxHeight', () => {
                const wraperr = shallow(<Menu maxHeight={100}></Menu>)
                expect(wraperr.prop('style').maxHeight).to.equal(100)
            });

            it('正确渲染子组件', () => {
                const wraperr = shallow(
                    <Menu>
                        <Menu.Item onClick={() => { }}></Menu.Item>
                        <Menu.Item onClick={() => { }}></Menu.Item>
                    </Menu>
                )
                expect(wraperr.find('MenuItem')).to.have.lengthOf(2)

            });
        })
    });
});