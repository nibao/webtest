import * as React from 'react';
import { noop } from 'lodash';
import { isUserId } from '../../../core/user/user';
import { formatTime } from '../../../util/formatters/formatters';
import { Text, InlineButton } from '../../../ui/ui.desktop';
import __ from './locale';
import * as styles from './styles.client.css';

const Revision: React.StatelessComponent<Components.Revisions.Revision.Props> = function ({
    doc,
    revision,
    doRevisionView = noop,
    doRevisionRestore = noop
}) {
    return (
        <div className={styles['item']}>
            <div>
                <div className={styles['left']}>
                    <div className={styles['form']}>
                        <Text>{formatTime(revision.modified / 1000)}</Text>
                    </div>
                    <div className={styles['form2']}>
                        <Text>{isUserId(revision.editor) ? __('未知用户') : revision.editor}</Text>
                    </div>
                </div>
                <div className={styles['right']}>
                    <InlineButton
                        code={'\uf0ce'}
                        title={__('打开')}
                        onClick={doRevisionView.bind(null, doc, revision)}
                    />
                    <InlineButton
                        code={'\uf05a'}
                        title={__('还原')}
                        onClick={doRevisionRestore.bind(null, doc, revision)}
                    />
                </div>
                <div className={styles['form2']}>
                    <Text>{revision.name}</Text>
                </div>
            </div>
            <div className={styles['pad']} />
        </div>
    )
}

export default Revision