import * as React from 'react';
import * as classnames from 'classnames';
import Control from '../Control/ui.desktop';
import Text from '../Text/ui.desktop';
import UIIcon from '../UIIcon/ui.desktop';
import Locator from '../Locator/ui.desktop';
import CascadeAreaSelectBase from './ui.base';
import * as styles from './styles.desktop.css';
import * as drop from './assets/drop.desktop.png';

export default class CascadeAreaSelect extends CascadeAreaSelectBase {
    render() {
        return (
            <div className={ styles['container'] } style={ this.props.style }>
                <Control
                    focus={ this.state.active }
                    className={ classnames(styles['control'], this.props.className) }
                    width={ this.props.width }
                >
                    <a
                        ref="select"
                        href="javascript:void(0)"
                        className={ styles['select'] }
                        onClick={ this.toggleActive.bind(this) }
                        onBlur={ this.deactive.bind(this) }
                    >
                        <Text>
                            {
                                this.formatText()
                            }
                        </Text>
                        <span className={ styles['drop-icon'] }>
                            <UIIcon
                                disabled={ this.props.disabled }
                                size={ 13 }
                                code={ '\uf00b' }
                                fallback={ this.props.fallbackIcon || drop }
                                onClick={ this.toggleActive.bind(this) }
                            />
                        </span>
                    </a>
                </Control>
                <div
                    className={ classnames(styles['options'], { [styles['active']]: this.state.active }) }
                    onMouseDown={ this.keepActive.bind(this) }
                >
                    <Locator>
                        {
                            React.cloneElement(React.Children.only(this.props.children), {
                                onSelect: this.handleSelect.bind(this)
                            })
                        }
                    </Locator>
                </div>
            </div >
        )
    }
}