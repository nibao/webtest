import * as React from 'react'
import * as sinon from 'sinon'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Item from '../ui.desktop'
import * as styles from '../styles.desktop.css';



describe('ShareWebUI', () => {
    describe('AutoCompleteList.Item', () => {
        describe('#render', () => {

            it('默认未选中', () => {
                const wrapper = shallow(
                    <Item
                    >
                    </Item>
                )
                expect(wrapper.hasClass(styles['selected'])).to.be.false
            })

            it('选中时，设置选中样式', () => {
                const wrapper = shallow(
                    <Item
                        selected={true}
                    >
                    </Item>
                )
                expect(wrapper.hasClass(styles['selected'])).to.be.true
            })

            it('悬浮时，触发悬浮事件', () => {
                const onMouseOverSpy = sinon.spy()
                const wrapper = shallow(
                    <Item
                        onMouseOver={onMouseOverSpy}
                    >
                    </Item>
                )
                wrapper.simulate('mouseOver');
                expect(onMouseOverSpy.called).to.be.true
            })
        })
    })
})