import * as React from 'react';
import { InlineButton, Chip, Fold } from '../../ui/ui.desktop'
import TagEditer from '../TagEditor/component.desktop';
import TagAdder from '../TagAdder/component.desktop';
import TagBoxBase, { Status } from './component.base'
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class TagBox extends TagBoxBase {
    render() {
        const { status, tags, showEditDialog, showAdderDialog } = this.state;

        return (
            <div className={styles['container']}>
                <div className={styles['tools']}>
                    {
                        status === Status.Edit ?
                            <InlineButton
                                code={'\uf05c'}
                                title={__('编辑')}
                                onClick={this.triggerEditTag.bind(this, 'desktop')}
                            >
                                {__('编辑')}
                            </InlineButton>
                            : null
                    }
                    {
                        status === Status.Add ?
                            <InlineButton
                                code={'\uf05c'}
                                title={__('添加')}
                                onClick={this.triggerAddTag.bind(this, 'desktop')}
                            >
                                {__('添加')}
                            </InlineButton>
                            : null
                    }
                </div>
                <Fold
                    label={__('标签')}
                    labelProps={{ className: styles['fold'] }}
                >
                    <div className={styles['tags']}>
                        {
                            status === Status.Edit ?
                                (
                                    tags.length ?
                                        tags.map((tag) => (
                                            <div
                                                className={styles['chip']}
                                                onClick={() => this.props.doJumpSearch(tag)}
                                            >
                                                <Chip className={styles['tag-chip']}>
                                                    {tag}
                                                </Chip>
                                            </div>
                                        ))
                                        :
                                        <div className={styles['no-tag']}>
                                            {__('暂无标签，请点击【编辑】进行添加')}
                                        </div>
                                )
                                : null
                        }
                    </div>
                    {
                        showEditDialog ?
                            <TagEditer
                                doc={this.props.docs[0]}
                                onCloseDialog={() => this.toggleEditDialog(false)}
                                onUpdateTags={this.updateTags.bind(this)}
                            />
                            : null
                    }
                    {
                        showAdderDialog ?
                            <TagAdder
                                docs={this.props.docs}
                                onCloseDialog={this.toggleAdderDialog.bind(this, false)}
                            />
                            : null
                    }
                </Fold>

            </div>
        )
    }
}