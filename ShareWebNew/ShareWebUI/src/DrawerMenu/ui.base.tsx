import * as React from 'react'

export default class DrawerMenuBase extends React.Component<UI.DrawerMenu.Props, UI.DrawerMenu.State>{

    static defaultProps = {
        open: false,
        mask: true,
        position: 'bottom',
    }

    state = {
        open: this.props.open
    }


    componentWillMount() {
        const { open } = this.props

        this.setState({
            open
        })
    }

    /**
     * 当调用时传递的控制抽屉组件显示状态与当前state状态不一致时，更新显示
     */
    componentWillReceiveProps({ open }) {
        if (this.state.open !== open) {
            this.setState({
                open
            })
        }
    }

    /**
     * 点击遮罩层时，关闭抽屉组件
     */
    protected closeDrawerMenu() {
        this.setState({
            open: false
        })
    }
}