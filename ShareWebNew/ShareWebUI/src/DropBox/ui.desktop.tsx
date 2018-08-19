import * as React from 'react';
import * as classnames from 'classnames';
import DropBoxBase from './ui.base';
import Control from '../Control/ui.desktop';
import UIIcon from '../UIIcon/ui.desktop';
import Text from '../Text/ui.desktop';
import PopOver from '../PopOver/ui.desktop'
import * as styles from './styles.desktop';
import * as arrowDown from './assets/arrow-down.png';

export default class DropBox extends DropBoxBase {
    render() {
        const { width, height, maxHeight, icon } = this.props;

        const { active } = this.state;
        return (
            <PopOver
                trigger={
                    <div
                        ref="container"
                        className={styles['dropbox']}
                        style={{ width, height, maxHeight }}
                    >
                        <Control
                            focus={active}
                            className={classnames(styles['control'], this.props.className)}
                            width={width}
                            height={height}
                            maxHeight={maxHeight}
                        >
                            <a
                                ref="select"
                                href="javascript:void(0)"
                                className={classnames(styles['select'], { [styles['disabled']]: this.props.disabled })}
                                onMouseDown={this.toggleActive.bind(this)}
                                onBlur={this.onSelectBlur.bind(this)}
                            >
                                {
                                    icon ? <span className={styles['icon']} >
                                        <UIIcon
                                            size={16}
                                            code={icon}
                                        />
                                    </span > :
                                        null
                                }
                                <div className={classnames(styles['text'], { [styles['text-left']]: icon })}>

                                    <Text>
                                        {
                                            this.props.formatter(this.props.value)
                                        }
                                    </Text>
                                </div>
                                <span className={styles['drop-icon']}>
                                    <UIIcon
                                        disabled={this.props.disabled}
                                        size={16}
                                        code={this.props.fontIcon}
                                        fallback={this.props.fallbackIcon || arrowDown}
                                    />
                                </span>
                            </a>
                        </Control>
                    </ div >
                }
                triggerEvent="click"
                anchorOrigin={['left', 'bottom']}
                targetOrigin={['left', 'top']}
                freezable={false}
                watch={true}
                onRequestCloseWhenBlur={(close) => this.onClose(close)}
                onRequestCloseWhenClick={this.toggleSelect.bind(this)}
                open={active}
                onOpen={() => this.onOpen()}
            >
                <div
                    className={classnames(styles['drop'], { [styles['active']]: active })}
                    ref="drop"
                    onMouseDown={this.preventDeactivate.bind(this)}
                >
                    {
                        this.props.children
                    }
                </div>

            </PopOver>


        )

    }

}