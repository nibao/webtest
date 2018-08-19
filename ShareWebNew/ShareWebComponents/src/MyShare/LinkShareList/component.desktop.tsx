import * as React from 'react';
import { noop } from 'lodash';
import * as classnames from 'classnames';
import { DataGrid } from '@anyshare/sweet-ui';
import { EmptyResult, Centered, Icon, IconGroup, Text } from '../../../ui/ui.desktop';
import { formatTime } from '../../../util/formatters/formatters';
import { buildSelectionText, LinkSharePermissionOptions } from '../../../core/permission/permission';
import Thumbnail from '../../Thumbnail/component.desktop';
import Toolbar from '../ToolBar/component.desktop';
import * as NoShare from '../assets/NoShare.png';
import * as loadImg from '../assets/loading.gif';
import * as styles from './styles.desktop.css';
import __ from './locale';

/**
 * 顶部导航栏
 */
const ToolbarComponent = (selection, doLinkShareCancel) => {
    return <Toolbar
        selection={selection}
        doShareCancel={doLinkShareCancel}
    />
}

/**
 * 结果为空时显示
 */
const EmptyComponent = () => (
    <EmptyResult
        picture={NoShare}
        details={__('外链共享列表为空')}
    />
)

/**
 * 正在加载时显示
 */
const RefreshingComponent = () => (
    <Centered>
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
)

const LinkShareList: React.StatelessComponent<Components.MyShare.LinkShareList.Props> = ({
    docs = null,
    selection = [],
    onSelectionChange = noop,
    onRowDoubleClicked = noop,
    onIconGroupClick = noop,
    doLinkShareDetailShow = noop,
    doLinkShareCancel = noop,
    doLinkShare = noop,
    doDirOpen = noop,
    doFilePreview = noop,
}) => (
        <div
            className={styles['container']}
        >
            <div
                className={styles['container']}
            >
                <DataGrid
                    data={docs}
                    enableSelect={true}
                    enableMultiSelect={true}
                    DataGridToolbar={{
                        enableSelectAll: true
                    }}
                    ToolbarComponent={ToolbarComponent(selection, doLinkShareCancel)}
                    onSelectionChange={onSelectionChange}
                    onRowDoubleClicked={onRowDoubleClicked}
                    selection={selection}
                    EmptyComponent={EmptyComponent()}
                    refreshing={!docs}
                    RefreshingComponent={RefreshingComponent}
                    rowHoverClassName={styles['hover-action']}
                    height={'100%'}
                    columns={[
                        {
                            title: __('文档名称'),
                            key: 'name',
                            width: '35%',
                            renderCell: (name, record) =>
                                (
                                    <div
                                        className={classnames(styles['list-name'])}
                                    >
                                        <div
                                            className={styles['picture-field']}
                                        >
                                            <Thumbnail
                                                doc={record}
                                                size={32}
                                                onClick={(e) => { doFilePreview(e, record) }}
                                            />
                                        </div>

                                        <div
                                            className={styles['name-field']}
                                            onClick={(e) => { doFilePreview(e, record) }}
                                        >
                                            <Text
                                                className={styles['name']}
                                                numberOfChars={27}
                                                ellipsizeMode={'middle'}
                                            >
                                                {name}
                                            </Text>
                                        </div>

                                        <IconGroup
                                            className={classnames(styles['operate'], { [styles['actived']]: selection.length === 1 && selection[0] === record })}
                                            onClick={(e) => { onIconGroupClick(e, record) }}
                                        >
                                            <IconGroup.Item
                                                code={'\uf030'}
                                                size={16}
                                                title={__('取消共享')}
                                                onClick={() => { doLinkShareCancel([record]) }}
                                            />
                                            <IconGroup.Item
                                                code={'\uf026'}
                                                size={16}
                                                title={__('外链共享')}
                                                onClick={() => { doLinkShare(record) }}
                                            />
                                            <IconGroup.Item
                                                code={'\uf074'}
                                                size={16}
                                                title={__('打开所在位置')}
                                                onClick={() => { doDirOpen(record) }}
                                            />
                                        </IconGroup>
                                    </div>
                                )
                        },
                        {
                            title: __('访问详情'),
                            key: 'access_status',
                            width: '8%',
                            renderCell: (access_status, record) => (
                                <div >
                                    {
                                        access_status === 1
                                            ?
                                            <span
                                                className={styles['details']}
                                                onClick={(e) => doLinkShareDetailShow(e, record)}
                                            >
                                                {__('查看')}
                                            </span>
                                            :
                                            <span
                                                className={styles['no-details']}
                                            >
                                                {__('暂无')}
                                            </span>
                                    }
                                </div>
                            )
                        },
                        {
                            title: __('共享时间'),
                            key: 'modify_time',
                            width: '13%',
                            renderCell: (modify_time, record) => (
                                <div
                                    className={styles['item-wrapper']}
                                >
                                    <Text>
                                        {
                                            formatTime(modify_time / 1000)
                                        }
                                    </Text>
                                </div>
                            )
                        },
                        {
                            title: __('访问权限'),
                            key: 'perm',
                            width: '14%',
                            renderCell: (perm, record) => (
                                <div
                                    className={styles['item-wrapper']}
                                >
                                    <Text>
                                        {
                                            buildSelectionText(LinkSharePermissionOptions, { allow: perm })
                                        }
                                    </Text>
                                </div>
                            )
                        },
                        {
                            title: __('有效期至'),
                            key: 'end_time',
                            width: '13%',
                            renderCell: (end_time, record) => (
                                <div
                                    className={styles['item-wrapper']}
                                >
                                    <Text>
                                        {
                                            formatTime(end_time / 1000)
                                        }
                                    </Text>
                                </div>
                            )
                        },
                        {
                            title: __('路径'),
                            key: 'namepath',
                            width: '17%',
                            renderCell: (namepath, record) => (
                                <div
                                    className={styles['item-wrapper']}
                                >
                                    <Text>
                                        {
                                            namepath.slice(6)
                                        }
                                    </Text>
                                </div>
                            )
                        },
                    ]}
                />
            </div >
        </div >
    )

export default LinkShareList

