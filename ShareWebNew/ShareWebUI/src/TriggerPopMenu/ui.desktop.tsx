import * as React from 'react';
import * as classnames from 'classnames';
import { decorateText } from '../../util/formatters/formatters';
import PopMenu from '../PopMenu/ui.desktop';
import Button from '../Button/ui.desktop';
import Title from '../Title/ui.desktop';
import UIIcon from '../UIIcon/ui.desktop';
import TriggerPopMenuBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class TriggerPopMenu extends TriggerPopMenuBase {

    render() {

        let { popMenuClassName, label, children, numberOfChars, title } = this.props;
        let { clickStatus } = this.state;
        return (
            <PopMenu
                className={classnames(popMenuClassName)}
                anchorOrigin={['left', 'bottom']}
                targetOrigin={['left', 'top']}
                watch={true}
                freezable={false}
                trigger={
                    <div
                        className={classnames(styles['button-container'])}
                        onMouseDown={this.handleClickBtn.bind(this)}
                    >
                        <Title content={title || label}>
                            <Button
                                className={classnames(styles['button-btn'], { [styles['clicked']]: clickStatus })}
                            >
                                <div className={classnames(styles['button-box'])}>
                                    {
                                        numberOfChars ?
                                            decorateText(label, { limit: numberOfChars }) :
                                            label
                                    }
                                    <UIIcon
                                        className={classnames(styles['expand-icon'])}
                                        code={'\uF04C'}
                                        size="16px"
                                    />
                                </div>
                            </Button>
                        </Title>
                    </div>
                }
                triggerEvent={'click'}
                onRequestCloseWhenBlur={close => this.handleRequestCloseWhenBlur(close)}
                onRequestCloseWhenClick={close => this.handleRequestCloseWhenClick(close)}
            >
                {children}
            </PopMenu>
        )

    }
}