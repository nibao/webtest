import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import { DataGrid } from '@anyshare/sweet-ui';
import { Text, Title, IconGroup, Centered, Icon } from '../../../ui/ui.desktop';
import { decorateText } from '../../../util/formatters/formatters';
import Thumbnail from '../../Thumbnail/component.desktop';
import { buildCSFInfo } from '../helper';
import * as emptyImg from '../assets/emptyfolder.png';
import * as loadingImg from '../assets/loading.gif';
import * as styles from './styles.desktop.css';
import __ from './locale';

const OpenDir: React.StatelessComponent<Components.ShareReview.OpenDir.Props> = function OpenDir({
    loading,
    csfSysId,
    list,
    csfTextArray,
    listSelection,
    onDoubleClick = noop,
    handleSelectionChange = noop,
    doDownload = noop,
    doOpenDoc = noop
}) {
    const RefreshingComponent = (
        <Centered>
            <Icon url={loadingImg} size={48} />
            <div className={styles['loading']}>
                {__('正在加载，请稍候......')}
            </div>
        </Centered>
    )

    const EmptyComponent = (
        <Centered>
            <Icon
                url={emptyImg}
            />
            <div className={styles['empty-message']} >
                {__('空文件夹')}
            </div>
        </Centered>
    )
    return (
        <DataGrid
            data={list}
            enableSelect={true}
            onSelectionChange={handleSelectionChange}
            selection={listSelection}
            EmptyComponent={EmptyComponent}
            refreshing={loading}
            RefreshingComponent={RefreshingComponent}
            rowHoverClassName={styles['hover-action']}
            onRowDoubleClicked={onDoubleClick}
            height={'100%'}
            columns={[
                {
                    title: __('文档名称'),
                    key: 'name',
                    width: '80%',
                    renderCell: (name, doc) =>
                        (
                            <div className={styles['docname-item']}>
                                <Thumbnail
                                    className={styles['thumbnail']}
                                    doc={doc}
                                    size={32}
                                    onClick={(e) => doOpenDoc(e, doc)}
                                />
                                <Title
                                    content={name}
                                >
                                    <span
                                        className={styles['doc-name']}
                                        onClick={(e) => doOpenDoc(e, doc)}
                                    >
                                        {decorateText(name, { limit: 50 })}
                                    </span>
                                </Title>
                                <IconGroup
                                    className={classnames(styles['action-icon'],
                                        { [styles['actived']]: listSelection && listSelection.docid === doc.docid }
                                    )}
                                    onClick={e => e.preventDefault()}
                                    onDoubleClick={e => e.preventDefault()}
                                >
                                    <IconGroup.Item
                                        code={'\uf02a'}
                                        size={16}
                                        title={__('下载')}
                                        onClick={() => doDownload(doc)}
                                    />
                                </IconGroup>
                            </div>
                        )
                },
                {
                    title: __('文件密级'),
                    key: 'csflevel',
                    width: '20%',
                    renderCell: (csflevel, doc) => (
                        <Text className={styles['csf-level']}>
                            {
                                doc.size === -1 ?
                                    '---'
                                    : buildCSFInfo(csflevel, csfSysId, csfTextArray)}
                        </Text>
                    )
                }
            ]}
        />
    )
}

export default OpenDir;