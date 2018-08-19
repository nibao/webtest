import * as React from 'react';
import Drawer from '../Drawer/ui.mobile';
import Item from '../DrawerMenu.Item/ui.mobile';
import Button from '../DrawerMenu.Button/ui.mobile';
import DrawerMenuBase from './ui.base';

export default class DrawerMenu extends DrawerMenuBase {
    static Item = Item
    static Button = Button

    render() {
        const { mask, position, children } = this.props
        const { open } = this.state

        return (
            <Drawer
                open={open}
                mask={mask}
                position={position}
                onClickMask={() => { this.closeDrawerMenu() }}
            >
                {children}
            </Drawer >
        )
    }
}


