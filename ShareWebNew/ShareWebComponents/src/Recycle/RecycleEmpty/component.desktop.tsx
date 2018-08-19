import * as React from 'react';
import { docname } from '../../../core/docs/docs';
import ProgressDialog from '../../../ui/ProgressDialog/ui.desktop';
import InvalidTipMessage from '../../InvalidTipMessage/component.desktop';
import RecycleEmptyBase from './component.base';
import EmptyConfirm from './EmptyConfirm/component.desktop';
import * as styles from './styles.desktop';
import { getErrorMessage } from '../../../core/errcode/errcode';
import __ from './locale';


export default class RecycleEmpty extends RecycleEmptyBase {
    render() {

        const { errorCode, errorDoc, errorState, recycleEmptyshow, progressDialogShow, docs, durationSelection } = this.state;
        return (
            <div className={styles['container']}>
                {
                    recycleEmptyshow
                        ?
                        <EmptyConfirm
                            onCancel={() => this.props.onCancel()}
                            durationSelection={durationSelection}
                            emptyRecycle={() => this.emptyRecycle()}
                            handleSelectStrategyMenu={(item) => this.handleSelectStrategyMenu(item)}
                        />
                        :
                        null
                }
                {
                    progressDialogShow
                        ?
                        <ProgressDialog
                            title={__('正在删除')}
                            detailTemplate={(item) => __('正在删除：') + docname(item)}
                            data={docs}
                            loader={this.loader.bind(this)}
                            onSuccess={() => this.handleEmptySuccess()}
                            onError={this.handleError.bind(this)}
                            onSingleSuccess={(item) => this.props.onSingleSuccess(item)}
                        />
                        :
                        null
                }
                {
                    errorCode !== -1 ?
                        <InvalidTipMessage
                            onConfirm={(goToEntry) => { this.props.onCancel(goToEntry) }}
                            errorCode={errorCode}
                            errorDoc={errorDoc}
                        >
                        </InvalidTipMessage>
                        :
                        null
                }
            </div>
        )
    }
}