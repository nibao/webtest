import * as React from 'react';
import * as classnames from 'classnames'
import { PopOver, Control, UIIcon, Text, CheckBox, DatePicker, Menu } from '../../ui/ui.desktop'
import ValidityBox2Base from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class ValidityBox2 extends ValidityBox2Base {
    render() {
        const { active, value } = this.state

        return (
            <PopOver
                trigger={
                    <div
                        className={styles['dropbox']}
                        style={{ width: this.props.width }}
                    >
                        <Control
                            focus={active}
                            className={classnames(styles['control'])}
                            width={this.props.width}
                        >
                            <a
                                ref={select => this.select = select}
                                href="javascript:void(0)"
                                className={classnames(styles['select'])}
                                onMouseDown={this.toggleActive.bind(this)}
                                onBlur={this.onSelectBlur.bind(this)}
                            >
                                <div className={styles['text']}>
                                    <Text>
                                        {
                                            this.validityFormatter(value === -1 ? value : value / 1000)
                                        }
                                    </Text>
                                </div>
                                <span className={styles['drop-icon']}>
                                    <UIIcon
                                        size={13}
                                        code={'\uf00e'}
                                    />
                                </span>
                            </a>
                        </Control>
                    </div >
                }
                triggerEvent="click"
                anchorOrigin={['left', 'bottom']}
                targetOrigin={['left', 'top']}
                freezable={true}
                onRequestCloseWhenBlur={(close) => close()}
                onRequestCloseWhenClick={(close) => {
                    if (value !== -1) {
                        close()
                    }
                }}
            >
                <div onMouseDown={() => this.deactivePrevented = true}>
                    <Menu>
                        <DatePicker
                            value={value === -1 ? null : new Date(value / 1000)}
                            selectRange={this.props.selectRange}
                            onChange={this.setValidity.bind(this)}
                            disabled={value === -1}
                        />
                        <div className={styles['options']}>
                            {
                                this.props.allowPermanent ?
                                    <div>
                                        <CheckBox
                                            value={-1}
                                            checked={this.state.value === -1}
                                            onChange={this.switchPermanent.bind(this)}
                                        />
                                        <label className={styles['option-label']}>
                                            {
                                                __('永久有效')
                                            }
                                        </label>
                                    </div>
                                    : null
                            }
                        </div>
                    </Menu>
                </div>
            </PopOver>
        )
    }
}
