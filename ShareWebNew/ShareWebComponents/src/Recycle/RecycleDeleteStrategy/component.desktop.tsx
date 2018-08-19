import * as React from 'react'
import * as classnames from 'classnames'
import Dialog from '../../../ui/Dialog2/ui.desktop'
import RecycleDeleteStrategyView from './component.view'
import RecycleDeleteStrategyBase from './component.base'
import InvalidTipMessage from '../../InvalidTipMessage/component.desktop';
import __ from './locale'
import * as styles from './styles.desktop.css'


export default class RecycleDeleteStrategy extends RecycleDeleteStrategyBase {

    render() {

        let { durationSelection, errorCode, isSelectionChange } = this.state

        return (
            <div>
                {
                    errorCode === -1 ?
                        <Dialog
                            title={__('回收站策略')}
                            width={400}
                            onClose={() => this.props.onStrategyClose()}
                        >
                            <RecycleDeleteStrategyView
                                maxHeight={200}
                                durationSelection={durationSelection}
                                isSelectionChange={isSelectionChange}
                                onStrategyClose={() => this.props.onStrategyClose()}
                                handleConfirmChangeDeleteStrategy={this.handleConfirmChangeDeleteStrategy.bind(this)}
                                handleSelectStrategyMenu={this.handleSelectStrategyMenu.bind(this)}
                            />
                        </Dialog>
                        :
                        <InvalidTipMessage
                            onConfirm={(goToEntry) => this.props.onStrategyClose(goToEntry)}
                            errorCode={errorCode}
                            errorDoc={this.props.docs[0]}
                        >
                        </InvalidTipMessage>
                }
            </div>


        )
    }
}