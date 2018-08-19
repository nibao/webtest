import * as React from 'react';
import * as classnames from 'classnames';
import FlexTextBox from '../FlexTextBox/ui.desktop';
import Control from '../Control/ui.desktop';
import ComboAreaBase from './ui.base';
import Item from '../ComboArea2.Item/ui.desktop';
import * as styles from './styles.desktop';

export default class ComboArea extends ComboAreaBase {

    static Item = Item;
    render() {

        let { items, focus } = this.state;
        return (
            <Control
                className={classnames(
                    styles['comboarea'],
                    this.props.className,
                )}
                width={this.props.width}
                height={this.props.height}
                minHeight={this.props.minHeight}
                maxHeight={this.props.maxHeight}
                onClick={this.focusInput.bind(this)}
                onBlur={this.blurInput.bind(this)}
                focus={focus}
            >
                {
                    items.map((item: React.ReactElement<UI.ComboAreaItem.Props>) => {
                        const { removeChip, ...otherProps } = item.props
                        return React.cloneElement(item, {
                            removeChip: (data) => { this.props.removeChip(data) },
                            ...otherProps
                        })
                    })
                }

                {
                    this.props.uneditable === false ?
                        <div className={styles['chip-wrap']}>
                            <FlexTextBox
                                className={styles['flextextbox']}
                                ref="input"
                                disabled={this.props.disabled || this.props.readOnly}
                                placeholder={this.state.placeholder}
                                onKeyDown={this.keyDownHandler.bind(this)}
                            />
                        </div> :
                        null
                }
            </Control>
        )
    }
}