import * as React from 'react';
import { ConfirmDialog, MessageDialog, Button, UIIcon, SelectMenu } from '../../ui/ui.desktop';
import { SHARETYPE, formatterErrorMessage, showType } from '../../core/myshare/myshare';
import LinkShareList from './LinkShareList/component.desktop';
import ShareList from './ShareList/component.desktop';
import ApvCaseDialog from './ApvCaseDialog/component.desktop';
import MyShareBase from './component.base';
import * as commonStyles from '../styles.desktop';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class MyShare extends MyShareBase {
    render() {
        const { doDirOpen, doFilePreview, doShare, doLinkShare, doLinkShareDetailShow, doApvJump } = this.props
        const { type, shareDocs, linkShareDocs, selection, cancelDocs, shareDocDetail, record, errorCode, failedDoc, apvCase } = this.state

        return (
            <div>
                <div className={styles['container']}>
                    <SelectMenu
                        value={type}
                        label={<Button
                            className={styles['type-selection']}
                        >
                            <span className={styles['type-text']}>
                                {showType(type)}
                            </span>
                            <UIIcon
                                code="\uF04C"
                                size="14px"
                            />
                        </Button>}
                        anchorOrigin={['right', 'bottom']}
                        targetOrigin={['right', 'top']}
                        closeWhenMouseLeave={true}
                        onChange={(type) => { this.handleTypeChange(type) }}
                    >
                        <SelectMenu.Option
                            value={SHARETYPE.Share}
                            label={showType(SHARETYPE.Share)}
                        />
                        <SelectMenu.Option
                            value={SHARETYPE.LinkShare}
                            label={showType(SHARETYPE.LinkShare)}
                        />
                    </SelectMenu>

                    {
                        type === SHARETYPE.Share
                            ?
                            (
                                <div
                                    className={styles['list-wrapper']}
                                >
                                    <ShareList
                                        docs={shareDocs}
                                        selection={selection}
                                        record={record}
                                        shareDocDetail={shareDocDetail}
                                        onSelectionChange={(selection) => { this.setState({ selection: selection.detail }) }}
                                        onIconGroupClick={this.handleIconClick.bind(this)}
                                        onRowDoubleClicked={(e) => doFilePreview(e.detail.record)}
                                        doShareCancel={(doc) => { this.setCancelDocs(doc) }}
                                        doShareDetailShow={(e, doc) => { this.handleShowShareDetail(e, doc) }}
                                        doShare={doShare}
                                        doDirOpen={doDirOpen}
                                        doFilePreview={(e, doc) => doFilePreview(doc)}
                                    />
                                </div>
                            )
                            :
                            (
                                <div
                                    className={styles['list-wrapper']}
                                >
                                    <LinkShareList
                                        docs={linkShareDocs}
                                        selection={selection}
                                        onSelectionChange={(selection) => { this.setState({ selection: selection.detail }) }}
                                        onRowDoubleClicked={(e) => doFilePreview(e.detail.record)}
                                        onIconGroupClick={this.handleIconClick.bind(this)}
                                        doLinkShareDetailShow={(e, doc) => doLinkShareDetailShow(doc)}
                                        doLinkShareCancel={(doc) => { this.setCancelDocs(doc) }}
                                        doLinkShare={doLinkShare}
                                        doDirOpen={doDirOpen}
                                        doFilePreview={(e, doc) => doFilePreview(doc)}
                                    />
                                </div>
                            )
                    }
                </div>

                {
                    cancelDocs
                        ?
                        (
                            <ConfirmDialog
                                onConfirm={() => { this.handleCancelShare(cancelDocs) }}
                                onCancel={() => { this.setState({ cancelDocs: null }) }}
                            >
                                {
                                    type === SHARETYPE.Share
                                        ?
                                        (
                                            cancelDocs.length === 1
                                                ?
                                                __('该操作将清除"${name}"已配置的全部内链共享，您确认要执行吗？', { name: cancelDocs[0].name })
                                                :
                                                __('该操作将清空所有选中对象已配置的内链共享，您确认要执行吗？')
                                        )
                                        :
                                        (
                                            cancelDocs.length === 1
                                                ?
                                                __('该操作将关闭"${name}"的外链共享，您确认要执行吗？', { name: cancelDocs[0].name })
                                                :
                                                __('该操作将关闭所有选中对象的外链共享，您确认要执行吗？')

                                        )
                                }
                            </ConfirmDialog>
                        ) : null
                }

                {
                    apvCase
                        ?
                        <ApvCaseDialog
                            onConfirm={() => { this.handleComfirmApvCaseDialog() }}
                            doApvJump={() => { doApvJump() }}
                        />
                        : null
                }

                {
                    errorCode
                        ?
                        <MessageDialog
                            onConfirm={() => { this.setState({ errorCode: undefined }) }}
                        >
                            <div className={commonStyles.warningContent}>
                                {
                                    formatterErrorMessage(errorCode, failedDoc)
                                }
                            </div>
                        </MessageDialog>
                        : null
                }
            </div >
        )
    }
}