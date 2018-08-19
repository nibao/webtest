import * as React from 'react';
import { noop } from 'lodash';
import * as classnames from 'classnames';
import { DataGrid } from '@anyshare/sweet-ui';
import { EmptyResult, Centered, Icon, IconGroup, Text, Title } from '../../../ui/ui.desktop';
import { formatTime } from '../../../util/formatters/formatters';
import { isBrowser, Browser } from '../../../util/browser/browser';
import Thumbnail from '../../Thumbnail/component.desktop';
import { REQUESTTYPE, AUDITSTATUS, convertAuditStatus } from '../helper';
import * as NoRequest from '../assets/NoRequest.png';
import * as NoSearch from '../assets/NoSearch.png';
import * as loadImg from '../assets/loading.gif';
import * as styles from './styles.desktop.css';
import __ from './locale';


// 判断是否为Safari浏览器，是时，添加空的伪元素，解决Safari浏览器下显示双tooltip
const isSafari = isBrowser({ app: Browser.Safari });

/**
 * 搜索结果为空
 * @param searchValue 搜索框的搜索条件数组
 * @param type 申请类型
 */
const EmptyComponent = (searchValue, type) => {
    return searchValue.length === 0
        ?
        (
            <EmptyResult
                picture={NoRequest}
                details={type === REQUESTTYPE.ALL ? __('共享申请列表为空') : (type === REQUESTTYPE.AUDITED ? __('暂无已审核事项') : __('暂无待审核事项'))}
            />
        )
        :
        (
            <EmptyResult
                picture={NoSearch}
                details={__('抱歉，没有找到符合条件的结果')}
            />
        )
}

/**
 * 加载数据时显示的样式
 */
const RefreshingComponent = () => {
    return <Centered>
        <Icon
            url={loadImg}
            size={48}
        />
        <p
            className={styles['loading-text']}
        >
            {__('正在加载，请稍候......')}
        </p>
    </Centered>
}

const ApplyList: React.StatelessComponent<Components.ShareApply.ApplyList.Props> = ({
    type = REQUESTTYPE.ALL,
    docs = null,
    selection = undefined,
    onSelectionChange = noop,
    onRowDoubleClicked = noop,
    doDirOpen = noop,
    doFilePreview = noop,
    doDownload = noop,
    searchValue = [],
}) => (
        <div
            className={styles['container']}
        >
            <DataGrid
                data={docs}
                enableSelect={true}
                enableMultiSelect={false}
                onSelectionChange={onSelectionChange}
                onRowDoubleClicked={onRowDoubleClicked}
                selection={selection}
                EmptyComponent={EmptyComponent(searchValue, type)}
                refreshing={!docs}
                RefreshingComponent={RefreshingComponent}
                rowHoverClassName={styles['hover-action']}
                height={'100%'}
                columns={[
                    {
                        title: __('文档名称'),
                        key: 'name',
                        width: '33%',
                        renderCell: (name, record) =>
                            (
                                <div
                                    className={classnames(styles['list-name'])}
                                >
                                    <div
                                        className={classnames(styles['picture-field'], { [styles['link-style']]: record['auditStatus'] === AUDITSTATUS.PENDING })}
                                    >
                                        <Thumbnail
                                            doc={record}
                                            size={32}
                                            onClick={(e) => { doFilePreview(e, record) }}
                                        />
                                    </div>

                                    <div
                                        className={classnames(styles['name-field'], { [styles['link-style']]: record['auditStatus'] === AUDITSTATUS.PENDING })}
                                        onClick={(e) => { doFilePreview(e, record) }}
                                    >
                                        <Text
                                            className={styles['name']}
                                            numberOfChars={30}
                                            ellipsizeMode={'middle'}
                                        >
                                            {name}
                                        </Text>
                                    </div>

                                    {
                                        record['auditStatus'] === AUDITSTATUS.PENDING ?
                                            <IconGroup
                                                className={classnames(styles['operate'], { [styles['actived']]: selection && selection === record })}
                                            >
                                                <IconGroup.Item
                                                    code={'\uf02a'}
                                                    size={16}
                                                    title={__('下载')}
                                                    onClick={doDownload.bind(this, record)}
                                                />
                                                <IconGroup.Item
                                                    code={'\uf074'}
                                                    size={16}
                                                    title={__('打开所在位置')}
                                                    onClick={() => { doDirOpen(record) }}
                                                />
                                            </IconGroup>
                                            : null
                                    }
                                </div>
                            )
                    },
                    {
                        title: __('文件密级'),
                        key: 'csfText',
                        width: '8%',
                        renderCell: (csfText, record) => (
                            <div
                                className={styles['item-wrapper']}
                            >
                                <Text>
                                    {
                                        csfText
                                    }
                                </Text>
                            </div>
                        )
                    },
                    {
                        title: __('发起时间'),
                        key: 'createdate',
                        width: '13%',
                        renderCell: (createdate, record) => (
                            <div
                                className={styles['item-wrapper']}
                            >
                                <Text>
                                    {
                                        formatTime(createdate / 1000)
                                    }
                                </Text>
                            </div>
                        )
                    },
                    {
                        title: __('申请类型'),
                        key: 'accessType',
                        width: '8%',
                        renderCell: (accessType, record) => (
                            <div
                                className={styles['item-wrapper']}
                            >
                                <Text>
                                    {
                                        accessType
                                    }
                                </Text>
                            </div>
                        )
                    },
                    {
                        title: __('申请内容'),
                        key: 'accessContent',
                        width: '25%',
                        renderCell: (accessContent, record) => (
                            <div
                                className={styles['item-wrapper']}
                            >
                                <Text>
                                    {
                                        accessContent
                                    }
                                </Text>
                            </div>
                        )
                    },
                    {
                        title: __('审核员'),
                        key: 'auditornames',
                        width: '13%',
                        renderCell: (auditornames, record) => (
                            <div
                                className={styles['item-wrapper']}
                            >
                                {
                                    record['auditStatus'] !== AUDITSTATUS.FREEAUDIT ?
                                        <Title
                                            content={`${auditornames && auditornames.length !== 0 ? auditornames.join('/') : null}(${convertAuditStatus(record['auditStatus'])})`}
                                        >
                                            <div
                                                className={classnames(
                                                    styles['auditornames'],
                                                    {
                                                        [styles['safari']]: isSafari,
                                                    },
                                                )}
                                            >
                                                <span>
                                                    {
                                                        auditornames && auditornames.length !== 0 ? auditornames.join('/') : null
                                                    }
                                                </span>
                                                <span
                                                    className={classnames({ [styles['passed']]: record['auditStatus'] === AUDITSTATUS.PASSED }, { [styles['vetoed']]: record['auditStatus'] === AUDITSTATUS.VETOED })}
                                                >
                                                    {`(${convertAuditStatus(record['auditStatus'])})`}
                                                </span>

                                            </div>
                                        </Title>
                                        :
                                        <Text
                                            className={styles['passed']}
                                        >
                                            {
                                                convertAuditStatus(record['auditStatus'])
                                            }
                                        </Text>
                                }
                            </div>
                        )
                    }
                ]}
            />
        </div >
    )

export default ApplyList

