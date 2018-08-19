import * as React from 'react';
import { Chip } from '../../ui/ui.desktop'
import { InlineButton } from '../../ui/ui.desktop'
import TagBoxBase, { Status } from './component.base'
import * as styles from './styles.client.css';
import __ from './locale';

export default class TagBox extends TagBoxBase {

    render() {
        const { status, tags } = this.state;

        return (
            <div className={styles['container']}>
                <div className={styles['tags']}>
                    <div className={styles['title']}>
                        <div className={styles['item']}>
                            <span className={styles['text']}>
                                {__('标签')}
                            </span>
                        </div>
                        {
                            (status !== Status.None) ? (
                                <div className={styles['right']}>
                                    {
                                        status === Status.Edit ?
                                            <InlineButton
                                                disabled={!this.props.docs || this.props.docs.length !== 1}
                                                code={'\uf05c'}
                                                title={__('编辑')}
                                                onClick={this.triggerEditTag.bind(this, 'client')}
                                            /> :
                                            <InlineButton
                                                disabled={!this.props.docs || this.props.docs.length < 1}
                                                code={'\uf05c'}
                                                title={__('添加')}
                                                onClick={this.triggerAddTag.bind(this, 'client')}
                                            />
                                    }
                                </div>
                            ) : null
                        }
                    </div>
                    <div className={styles['pad']} />
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
            </div>
        )
    }
}