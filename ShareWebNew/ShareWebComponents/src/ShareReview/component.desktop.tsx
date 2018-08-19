import * as React from 'react';
import { SelectMenu, UIIcon, MessageDialog } from '../../ui/ui.desktop';
import { ReviewType } from '../../core/audit/audit';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import { getErrorMessage } from '../../core/errcode/errcode';
import Crumbs from './Crumbs/component.desktop';
import ReviewList from './ReviewList/component.desktop';
import ReviewDialog from './ReviewDialog/component.view';
import ReviewException from './ReviewException/component.desktop';
import OpenDir from './OpenDir/component.desktop';
import ShareReviewBase from './component.base';
import { ReviewStatus } from './helper';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class ShareReview extends ShareReviewBase {

    render() {
        const { location } = this.props;
        const {
            selectedReviewType,
            inReview,
            applyInfos,
            csfTextArray,
            approveException,
            errors,
            list,
            loading,
            loadingDir,
            crumbs,
            confirmError
         } = this.state;

        return (
            <div className={styles['container']}>
                <div className={styles['header']}>
                    {
                        location.query && location.query.gns ?
                            <Crumbs
                                crumbs={crumbs}
                                onCrumbChange={(doc) => this.handlePathChange(doc)}
                            />
                            :
                            <div>
                                <span className={styles['share-apv']}>{__('共享审核')}</span>
                                    <SelectMenu
                                        value={selectedReviewType}
                                        anchorOrigin={['right', 'bottom']}
                                        targetOrigin={['right', 'top']}
                                        closeWhenMouseLeave={true}
                                        onChange={this.changeReviewType}
                                        label={
                                            <div className={styles['select-type']}>
                                                <span className={styles['select-reviewtype']}>{ReviewStatus[selectedReviewType]}</span>
                                                <UIIcon
                                                    size="16px"
                                                    code={'\uf04c'}
                                                    color="#757575"
                                                />
                                            </div>
                                        }
                                    >
                                        <SelectMenu.Option
                                            value={ReviewType.ShareApvAll}
                                            label={ReviewStatus[ReviewType.ShareApvAll]}
                                        />
                                        <SelectMenu.Option
                                            value={ReviewType.ShareApvUnreview}
                                            label={ReviewStatus[ReviewType.ShareApvUnreview]}
                                        />
                                        <SelectMenu.Option
                                            value={ReviewType.ShareApvReviewed}
                                            label={ReviewStatus[ReviewType.ShareApvReviewed]}
                                        />
                                    </SelectMenu>
                                </div>
                    }
                </div>
                {
                    location.query && location.query.gns ?
                        <div className={styles['list-container']}>
                            <OpenDir
                                csfSysId={this.csfSysId}
                                csfTextArray={csfTextArray}
                                loading={loadingDir}
                                list={list}
                                listSelection={this.state.docSelection}
                                handleSelectionChange={this.handleDocSelectionChange}
                                doOpenDoc={this.handleOpenDoc}
                                doDownload={this.download.bind(this)}
                                onDoubleClick={this.handleDoubleClick}
                            />
                        </div>
                        :
                        <div className={styles['list-container']}>
                            <ReviewList
                                loading={loading}
                                applyInfos={
                                    selectedReviewType === ReviewType.ShareApvAll ?
                                        applyInfos.all
                                        : selectedReviewType === ReviewType.ShareApvUnreview ?
                                            applyInfos.pending
                                            : applyInfos.history
                                }
                                csfSysId={this.csfSysId}
                                reviewType={selectedReviewType}
                                listSelection={this.state.reviewSelection}
                                csfTextArray={csfTextArray}
                                handleSelectionChange={this.handleReviewSelectionChange}
                                doReview={this.handleReview}
                                doOpenDoc={this.handleOpenDoc}
                                onDoubleClick={this.handleDoubleClick}
                                doDownload={this.download.bind(this)}
                            />
                        </div>
                }
                {
                    inReview ?
                        <ReviewDialog
                            fileInReview={this.fileInReview}
                            onShareReview={this.handleShareReview}
                            onCloseReviewDialog={this.doCloseReviewDialog}
                        />
                        : null
                }
                {
                    approveException ?
                        <ReviewException
                            exceptionInfo={approveException}
                            onReviewExceptionConfirm={this.handleExceptionConfirm}
                        />
                        : null
                }
                {
                    errors.length ?
                        <MessageDialog onConfirm={confirmError}>
                            {
                                errors[0].errcode === ErrorCode.ShareApplyComplete ?
                                    getErrorMessage(ErrorCode.ShareApplyComplete)
                                    : __('文件夹不存在，可能其所在路径发生变更')
                            }
                        </MessageDialog>
                        : null
                }
            </div>
        )
    }
}