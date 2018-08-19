import * as React from 'react';
import * as classnames from 'classnames';
import Mask from '../Mask/ui.desktop';
import UIIcon from '../UIIcon/ui.desktop';
import { ClassName } from '../helper';
import DialogBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class Dialog extends DialogBase {

    componentDidMount() {
        super.componentDidMount();
        if (!this.moved) {
            this.center();
        }
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        if (!this.moved) {
            this.center();
        }
    }

    render() {
        return (
            <div>
                {
                    this.props.hide ? null : <Mask /> // 通过props传入hide = true实现组件隐藏， 兼容对话框中的flash问题
                }
                <div
                    ref={ (container => this.container = container) }
                    className={ styles['container'] }
                    style={ this.props.hide ? { top: '100%', left: '100%' } : { width: this.props.width } }
                >
                    <div
                        className={ classnames(styles['header'], ClassName.BorderTopColor) }
                        onMouseDown={ this.props.draggable && this.startDrag.bind(this) }
                        onMouseUp={ this.props.draggable && this.endDrag.bind(this) }
                    >
                        <h1 className={ styles['title'] }>
                            {
                                this.props.title
                            }
                        </h1>
                        {
                            // 对话框按钮
                            this.props.buttons && this.props.buttons.length ? (
                                <div className={ styles['buttons'] }>
                                    {
                                        this.props.buttons.map(button => {
                                            switch (button) {
                                                case 'close':
                                                    return (
                                                        <div className={ styles['button'] }>
                                                            <UIIcon
                                                                className={ styles['button-icon'] }
                                                                code={ '\uf014' }
                                                                size={ 13 }
                                                                onClick={ this.fireCloseEvent.bind(this) }
                                                            />
                                                        </div>
                                                    )
                                            }
                                        })
                                    }
                                </div>
                            ) : null
                        }
                    </div>
                    <div className={ styles['content'] }>
                        {
                            this.props.children
                        }
                    </div>
                </div>
            </div>
        )
    }
}