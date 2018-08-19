import * as React from 'react';
import * as classnames from 'classnames';
import { noop, first, last } from 'lodash';
import { isUserId } from '../../../core/user/user';
import { formatTime } from '../../../util/formatters/formatters';
import { Text, InlineButton } from '../../../ui/ui.desktop';
import __ from './locale';
import * as styles from './styles.desktop.css';

const Revision: React.StatelessComponent<Components.Revisions.Revision.Props> = function ({
    doc,
    revision,
    revisions = [],
    doRevisionView = noop,
    doRevisionRestore = noop,
    doRevisionsDownload = noop
}) {
    // 是否第一条记录（没有“还原”按钮）
    const firstItem = first(revisions).rev === revision.rev
    // 判断文件的服务器时间和该版本的修改时间是否相等，如果相等，显示“创建”，否则显示“修改”
    const original = revision.modified === doc.create_time

    return (
        <div className={styles['item']}>
            <div>
                <div className={styles['left']}>
                    <Text>{revision.modified ? formatTime(revision.modified / 1000) : '---'}</Text>
                </div>
                <div className={styles['right']}>
                    <InlineButton
                        code={'\uf0ce'}
                        title={__('打开')}
                        onClick={() => doRevisionView(doc, revision)}
                    />
                    <InlineButton
                        code={'\uf02a'}
                        title={__('下载')}
                        className={classnames({ [styles['btn-margin']]: firstItem })}
                        onClick={() => doRevisionsDownload(doc, revision)}
                    />
                    {
                        !firstItem && (
                            <InlineButton
                                code={'\uf05a'}
                                title={__('还原')}
                                onClick={() => doRevisionRestore(doc, revision)}
                            />
                        )
                    }
                </div>
                <div className={styles['form2']}>
                    <Text className={styles['user-name']}>
                        {`${isUserId(revision.editor) ? __('未知用户') : revision.editor}`}
                    </Text>
                    <div className={styles['info']}>{original ? __('创建') : __('修改')}</div>
                </div>
                <div className={classnames(styles['form2'], styles['last-line'])}>
                    <Text className={styles['text-width']}>
                        {revision.name}
                    </Text>
                </div>
            </div>
            <div className={styles['pad']} />
        </div>
    )
}

export default Revision