import * as React from 'react'
import * as classnames from 'classnames'
import CreateDirBase from './component.base'
import { trim } from 'lodash'
import IconGroup from '../../../ui/IconGroup/ui.desktop'
import ValidateBox from '../../../ui/ValidateBox/ui.desktop'
import MessageDialog from '../../../ui/MessageDialog/ui.desktop'
import TextBox from '../../../ui/TextBox/ui.desktop'
import ExceptionStrategy from '../../ExceptionStrategy/component.desktop'
import PopOver from '../../../ui/PopOver/ui.desktop'
import * as styles from './styles.desktop.css'

export default class CreateDir extends CreateDirBase {
    render() {
        const { onCancel } = this.props
        const { value, invalidMsg, exception, processingDoc, anchor, errCode } = this.state;
        return (
            <div className={styles['container']} ref="container">
                <PopOver
                    open={!!anchor}
                    anchor={anchor}
                    freezable={false}
                    autoFix={false}
                    watch={true}
                    anchorOrigin={['center', 'middle']}
                    targetOrigin={['left', 'middle']}
                    style={{ zIndex: 1 }}
                >
                    <div className={styles['wrapper']}>
                        <TextBox
                            style={{ lineHeight: 'normal' }}
                            value={value}
                            autoFocus={true}
                            selectOnFocus={true}
                            onChange={this.updateValue.bind(this)}
                        />
                        <IconGroup className={styles['actions']}>
                            <IconGroup.Item
                                code={'\uf00a'}
                                disabled={!trim(value)}
                                onClick={this.confirm.bind(this)}
                            />
                            <IconGroup.Item
                                code={'\uf046'}
                                onClick={onCancel}
                            />
                        </IconGroup>
                    </div>
                </PopOver>
                <div onContextMenu={e => e.preventDefault()}>
                    {
                        !!exception && (
                            <ExceptionStrategy
                                exception={exception}
                                doc={processingDoc}
                                strategies={this.strategies}
                                handlers={this.handlers}
                                onConfirm={this.handleConfirmError.bind(this)}
                            />
                        )
                    }
                    {
                        !!errCode && (
                            <MessageDialog onConfirm={this.clearErrCode.bind(this)}>
                                {this.validateMessages[errCode]}
                            </MessageDialog>
                        )
                    }
                </div>
            </div>
        )
    }
}