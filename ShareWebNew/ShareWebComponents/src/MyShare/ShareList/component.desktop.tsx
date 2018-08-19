import * as React from 'react';
import { noop } from 'lodash';
import * as classnames from 'classnames';
import { DataGrid } from '@anyshare/sweet-ui';
import { EmptyResult, Centered, Icon, IconGroup, Text, UIIcon } from '../../../ui/ui.desktop';
import Thumbnail from '../../Thumbnail/component.desktop';
import Toolbar from '../ToolBar/component.desktop';
import DetailsList from '../DetailsList/component.desktop';
import * as NoShare from '../assets/NoShare.png';
import * as loadImg from '../assets/loading.gif';
import * as styles from './styles.desktop.css';
import __ from './locale';

/**
 * 导航栏
 */
const ToolbarComponent = (selection, doShareCancel) => {
    return <Toolbar
        selection={selection}
        doShareCancel={doShareCancel}
    />
}

/**
 * 内链共享列表为空
 */
const EmptyComponent = () => (
    <EmptyResult
        picture={NoShare}
        details={__('内链共享列表为空')}
    />

)

/**
 * 正在加载列表数据
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

/**
 * 展开内链配置详情
 */
const RowExtraComponent = (shareDocDetail) => (
    <DetailsList
        details={shareDocDetail}
    />
)

const ShareList: React.StatelessComponent<Components.MyShare.ShareList.Props> = ({
    docs = null,
    selection = [],
    record = undefined,
    shareDocDetail = [],
    onSelectionChange = noop,
    onIconGroupClick = noop,
    onRowDoubleClicked = noop,
    doShareCancel = noop,
    doShareDetailShow = noop,
    doShare = noop,
    doDirOpen = noop,
    doFilePreview = noop,
}) => (
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
                HeaderComponent={null}
                ToolbarComponent={ToolbarComponent(selection, doShareCancel)}
                onSelectionChange={onSelectionChange}
                onRowDoubleClicked={onRowDoubleClicked}
                selection={selection}
                EmptyComponent={EmptyComponent}
                refreshing={!docs}
                RefreshingComponent={RefreshingComponent}
                rowHoverClassName={styles['hover-action']}
                height={'100%'}
                showRowExtraOf={record}
                RowExtraComponent={() => RowExtraComponent(shareDocDetail)}
                columns={[
                    {
                        title: __('文档名称'),
                        key: 'name',
                        width: '45%',
                        renderCell: (name, doc) =>
                            (
                                <div
                                    className={classnames(styles['list-name'])}
                                >
                                    <div
                                        className={styles['picture-field']}
                                    >
                                        <Thumbnail
                                            doc={doc}
                                            size={32}
                                            onClick={(e) => { doFilePreview(e, doc) }}
                                        />
                                    </div>

                                    <div
                                        className={styles['name-field']}
                                        onClick={(e) => { doFilePreview(e, doc) }}
                                    >
                                        <Text
                                            className={styles['name']}
                                            numberOfChars={40}
                                            ellipsizeMode={'middle'}
                                        >
                                            {name}
                                        </Text>
                                    </div>

                                    <IconGroup
                                        className={classnames(styles['operate'], { [styles['actived']]: selection.length === 1 && selection[0] === doc })}
                                        onClick={(e) => { onIconGroupClick(e, doc) }}
                                    >
                                        <IconGroup.Item
                                            code={'\uf030'}
                                            size={16}
                                            title={__('取消共享')}
                                            onClick={() => { doShareCancel([doc]) }}
                                        />
                                        <IconGroup.Item
                                            code={'\uf025'}
                                            size={16}
                                            title={__('内链共享')}
                                            onClick={() => { doShare(doc) }}
                                        />
                                        <IconGroup.Item
                                            code={'\uf074'}
                                            size={16}
                                            title={__('打开所在位置')}
                                            onClick={() => { doDirOpen(doc) }}
                                        />
                                    </IconGroup>
                                </div>
                            )
                    },
                    {
                        title: __('共享详情'),
                        key: 'details',
                        width: '10%',
                        renderCell: (details, doc) => (
                            <div
                                className={styles['details-wrapper']}
                                onClick={(e) => { doShareDetailShow(e, doc) }}
                            >
                                <span
                                    className={styles['details']}
                                >
                                    {__('查看')}
                                </span>

                                <UIIcon
                                    className={styles['uiicon']}
                                    code={doc === record ? '\uF04B' : '\uF04C'}
                                    size={13}
                                    color={'#5a8cb4'}
                                />

                            </div>
                        )
                    },
                    {
                        title: __('访问者'),
                        key: 'accessor_names',
                        width: '20%',
                        renderCell: (accessor_names, doc) => (
                            <div
                                className={styles['item-wrapper']}
                            >
                                <Text>{accessor_names}</Text>
                            </div>
                        )
                    },
                    {
                        title: __('路径'),
                        key: 'path',
                        width: '25%',
                        renderCell: (path, doc) => (
                            <div
                                className={styles['item-wrapper']}
                            >
                                <Text>{path.replace(/\\/g, '/')}</Text>
                            </div>
                        )
                    },
                ]}
            />
        </div >
    )

export default ShareList

