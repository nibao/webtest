import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import { DataGrid } from '@anyshare/sweet-ui';
import { UIIcon, Text, Title, EmptyResult, Button, IconGroup, Centered, Icon } from '../../../ui/ui.desktop';
import { formatTime, decorateText } from '../../../util/formatters/formatters';
import { AppType, ApplyOpType, ReviewType } from '../../../core/audit/audit';
import Thumbnail from '../../Thumbnail/component.desktop';
import { buildCSFInfo, buildApplyType, lastDoc, getPermission, shareContent } from '../helper';
import * as noticeImg from '../assets/notice.png';
import * as emptyImg from '../assets/empty.png';
import * as loadingImg from '../assets/loading.gif';
import * as styles from './styles.desktop.css';
import __ from './locale';

const ReviewList: React.StatelessComponent<Components.ShareReview.ReviewList.Props> = function ReviewList({
    loading,
    csfSysId,
    reviewType,
    doReview = noop,
    applyInfos,
    csfTextArray,
    listSelection,
    doOpenDoc = noop,
    onDoubleClick = noop,
    handleSelectionChange = noop,
    doDownload = noop

}) {
    const RefreshingComponent = (
        <Centered>
            <Icon url={loadingImg} size={48} />
            <div className={styles['loading']}>
                {__('正在加载，请稍候......')}
            </div>
        </Centered>
    )

    const EmptyComponent = (reviewType) => (
        <EmptyResult
            picture={emptyImg}
            details={
                reviewType === ReviewType.ShareApvAll ?
                    __('共享审核列表为空')
                    : reviewType === ReviewType.ShareApvUnreview ?
                        __('暂无待审核事项')
                        : __('暂无已审核事项')
            }
        />
    )

    return (
        <DataGrid
            data={applyInfos}
            enableSelect={true}
            onSelectionChange={handleSelectionChange}
            selection={listSelection}
            EmptyComponent={EmptyComponent(reviewType)}
            refreshing={loading}
            RefreshingComponent={RefreshingComponent}
            onRowDoubleClicked={onDoubleClick}
            rowHoverClassName={styles['hover-action']}
            height={'100%'}
            columns={[
                {
                    title: __('文档名称'),
                    key: 'docname',
                    width: '28%',
                    renderCell: (docname, applyInfo) =>
                        (
                            <div className={styles['docname-item']}>
                                {
                                    !applyInfo.auditornames ?
                                        <UIIcon
                                            size={12}
                                            className={styles['icon-wrap']}
                                            code={'\uf004'}
                                            color={'#d70000'}
                                            fallback={noticeImg}
                                        />
                                        : null
                                }
                                <Thumbnail
                                    className={classnames({ [styles['enable-open']]: !applyInfo.auditornames })}
                                    doc={applyInfo}
                                    size={32}
                                    onClick={(e) => doOpenDoc(e, applyInfo)}
                                />
                                <Title content={lastDoc(docname)}>
                                    <span
                                        className={classnames(styles['doc-name'], { [styles['active-doc']]: !applyInfo.auditornames })}
                                        onClick={(e) => doOpenDoc(e, applyInfo)}
                                    >
                                        {decorateText(lastDoc(docname), { limit: 25 })}
                                    </span>
                                </Title>
                                {
                                    !applyInfo.auditornames ?
                                        <IconGroup
                                            className={classnames(styles['action-icon'],
                                                { [styles['actived']]: listSelection && listSelection.applyid === applyInfo.applyid }
                                            )}
                                            onClick={e => e.preventDefault()}
                                            onDoubleClick={e => e.preventDefault()}
                                        >
                                            <IconGroup.Item
                                                code={'\uf02a'}
                                                size={16}
                                                title={__('下载')}
                                                onClick={() => doDownload(applyInfo)}
                                            />
                                        </IconGroup>
                                        : null
                                }
                            </div>
                        )
                },
                {
                    title: __('文件密级'),
                    key: 'csflevel',
                    width: '9%',
                    renderCell: (csflevel, applyInfo) => (
                        <Text className={styles['text-content']}>
                            {buildCSFInfo(csflevel, csfSysId, csfTextArray)}
                        </Text>
                    )
                },
                {
                    title: __('发起人'),
                    key: 'sharer',
                    width: '8%',
                    renderCell: (sharer, applyInfo) => (
                        <Text className={styles['text-content']}>
                            {sharer}
                        </Text>
                    )
                },
                {
                    title: __('发起时间'),
                    key: 'date',
                    width: '13%',
                    renderCell: (date, applyInfo) => (
                        <Text className={styles['text-content']}>
                            {formatTime((date) / 1000)}
                        </Text>
                    )
                },
                {
                    title: __('申请类型'),
                    key: 'apptype',
                    width: '10%',
                    renderCell: (apptype, applyInfo) => (
                        <Text className={styles['text-content']}>
                            {buildApplyType(apptype)}
                        </Text>
                    )
                },
                {
                    title: __('申请内容'),
                    key: 'detail',
                    width: '20%',
                    renderCell: (detail, applyInfo) => (
                        renderApplyContent(applyInfo, csfSysId, csfTextArray)
                    )
                },
                {
                    title: __('操作'),
                    key: 'applyid',
                    width: '9%',
                    renderCell: (applyid, applyInfo) => (
                        renderReviewOperation(applyInfo, doReview)
                    )
                }
            ]}

        />
    )
}

function renderApplyContent(applyInfo, csfSysId, csfTextArray) {
    switch (applyInfo.apptype) {
        case AppType.InternalShare:
        case AppType.OwnerConfig:
            return (
                <Text className={styles['text-content']}>
                    {`${shareContent(applyInfo).shareText}${applyInfo.detail.optype === ApplyOpType.Delete ? __('取消') : ''}${shareContent(applyInfo).permText}`}
                </Text>
            )

        case AppType.ExternalShare:
            return (
                <Text className={styles['text-content']}>
                    {`
                    ${__('给外部用户共享：')}
                    ${getPermission(applyInfo)}
                    ${__('至：')}
                    ${applyInfo.detail.endtime === -1 ? __('永久有效') : formatTime(applyInfo.detail.endtime / 1000)}
                    ${applyInfo.detail.accessLimit === (-1 || 0) ? '' :
                            applyInfo.detail.accessLimit === 1 ?
                                __('限制打开次数：1次')
                                :
                                __('限制打开次数：${accessLimit}次', { accessLimit: applyInfo.detail.accessLimit })}
                    `}
                </Text>
            )

        case AppType.SecurityLevelChange:
            return (
                <Text className={styles['text-content']}>
                    {`${__('将文件密级更改为：')}${buildCSFInfo(applyInfo.detail.applycsflevel, csfSysId, csfTextArray)}`}
                </Text>
            )
    }

}

function renderReviewOperation(applyInfo, doReview) {
    if (!applyInfo.auditornames) {
        return (
            <Button
                onClick={(e) => { e.stopPropagation(); doReview(applyInfo) }}
            >
                {__('审核')}
            </Button>
        )
    } else {
        if (applyInfo.approveindex !== -1) {
            return (
                <span className={styles['approval-passed']}>{__('已通过')}</span>
            )
        } else if (applyInfo.vetoindex !== -1) {
            return (
                <span className={styles['approval-rejected']}>{__('已否决')}</span>
            )
        }
    }

}

export default ReviewList;