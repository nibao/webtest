import * as React from 'react';
import { noop, isEqual } from 'lodash';
import * as classnames from 'classnames';
import Icon from '../../../ui/Icon/ui.desktop';
import Title from '../../../ui/Title/ui.desktop';
import Text from '../../../ui/Text/ui.desktop';
import DataList from '../../../ui/DataList/ui.desktop';
import IconGroup from '../../../ui/IconGroup/ui.desktop';
import LazyLoader from '../../../ui/LazyLoader/ui.desktop';
import Centered from '../../../ui/Centered/ui.desktop';
import { formatTime, formatSize, decorateText } from '../../../util/formatters/formatters';
import Thumbnail from '../../Thumbnail/component.desktop';
import __ from './locale';
import * as styles from './styles.desktop.css';
import * as empty from './assets/clearing.png';
import * as loading from './assets/loading.gif';
import * as nullsearch from './assets/nullsearch.png';

const RecycleList: React.StatelessComponent<Components.Recycle.RecycleList.Props> = function RecycleList({
    scroll,
    isClient = false,
    listDocs,
    duration,
    lazyLoad,
    isLoading,
    servertime,
    isSearchEmpty,
    listSelections,
    getListRef = noop,
    onPageChange = noop,
    getLazyLoadRef = noop,
    handleSelected = noop,
    handleContextMenu = noop,
    handleClickViewSize = noop,
    handleClickDeleteRecycle = noop,
    handleClickRestoreRecycle = noop,
}) {

    return (
        <div className={classnames(styles['list-container'])}>


            <div className={styles['list-head']}>
                <div className={styles['list-head-item']}>
                    {
                        !isClient
                            ?
                            <div className={classnames(styles['list-head-name'], { [styles['list-head-name-scroll']]: scroll })}>{__('文档名称')}</div>
                            :
                            <div className={classnames(styles['list-head-name-client'], { [styles['list-head-name-client-scroll']]: scroll })}>{__('文档名称')}</div>
                    }

                    <div className={classnames(styles['list-head-editor'], { [styles['list-head-editor-scroll']]: scroll })}>{__('删除者')}</div>
                    <div className={classnames(styles['list-head-modified'], { [styles['list-head-modified-scroll']]: scroll })}>{__('删除时间')}</div>
                    <div className={classnames(styles['list-head-size'], { [styles['list-head-size-scroll']]: scroll })}>{__('大小')}</div>
                    <div className={classnames(styles['list-head-days'], { [styles['list-head-days-scroll']]: scroll })}>{__('保留天数')}</div>
                    <div className={styles['list-head-path']}>{__('原位置')}</div>
                </div>
            </div>


            <div className={styles['list-box']}>
                {
                    isLoading || listDocs.length === 0 ?
                        renderTips(isLoading, isSearchEmpty, empty, loading, nullsearch)
                        :
                        null
                }

                <LazyLoader
                    ref={(ref) => getLazyLoadRef(ref)}
                    limit={20}
                    trigger={0.999}
                    onChange={lazyLoad ? onPageChange : noop}
                >

                    <div ref={(ref) => getListRef(ref)}>
                        <DataList
                            multiple={true}
                            onSelectionChange={handleSelected}
                            selections={listSelections}
                            onContextMenu={handleContextMenu}
                        >
                            {
                                listDocs.map((listdoc) =>
                                    <DataList.Item
                                        className={styles['list-item']}
                                        data={listdoc}
                                        checkBoxClassName={styles['list-item-checkbox']}
                                        key={listdoc['docid']}
                                    >
                                        {
                                            <div
                                                className={styles['list-content']}

                                            >
                                                <div className={styles['list-content-name']}>
                                                    <Thumbnail
                                                        doc={listdoc}
                                                        size={32}

                                                    />
                                                    <span className={styles['list-content-text']}>
                                                        <Text
                                                            ellipsizeMode={'middle'}
                                                            numberOfChars={25}
                                                        >
                                                            {listdoc['name']}
                                                        </Text>
                                                    </span>



                                                    <IconGroup
                                                        onDoubleClick={e => { e.preventDefault() }}
                                                        onClick={e => e.preventDefault()}
                                                        className={styles['icon-groups']}
                                                    >
                                                        <IconGroup.Item
                                                            code={'\uf05A'}
                                                            size={16}
                                                            title={__('还原')}
                                                            className={classnames(styles['action-icon'], { [styles['actived']]: listSelections.length === 1 && isEqual(listSelections[0], listdoc) })}
                                                            onClick={(e) => { handleClickRestoreRecycle(e, listdoc); }}
                                                        />
                                                        <IconGroup.Item
                                                            code={'\uf046'}
                                                            size={16}
                                                            title={__('删除')}
                                                            className={classnames(styles['action-icon'], { [styles['actived']]: listSelections.length === 1 && isEqual(listSelections[0], listdoc) })}
                                                            onClick={(e) => { handleClickDeleteRecycle(e, listdoc); }}
                                                        />
                                                        <IconGroup.Item
                                                            code={'\uf053'}
                                                            size={16}
                                                            title={__('查看大小')}
                                                            className={classnames(styles['action-icon'], { [styles['actived']]: listSelections.length === 1 && isEqual(listSelections[0], listdoc) })}
                                                            onClick={(e) => { handleClickViewSize(e, listdoc); }}
                                                        />
                                                    </IconGroup>

                                                </div>

                                                <div
                                                    className={styles['list-content-editor']}
                                                >
                                                    <Title
                                                        content={listdoc['editor']}
                                                    >
                                                        {decorateText(listdoc['editor'], { limit: 8 })}
                                                    </Title>
                                                </div>
                                                <div className={styles['list-content-modified']}>
                                                    {formatTime(parseInt(listdoc['modified'].toString().slice(0, 13)), 'yyyy-MM-dd HH:mm:ss')}
                                                </div>
                                                <div className={styles['list-content-size']}>
                                                    {
                                                        listdoc.hasOwnProperty('_size') ?
                                                            formatSize(listdoc['_size']) :
                                                            listdoc['size'] === -1 ? '---' :
                                                                formatSize(listdoc['size'])
                                                    }
                                                </div>
                                                <div className={classnames(styles['list-content-days'], { [styles['list-content-days-warning']]: !isLeftDaysMoreThanTenDays(duration, servertime, listdoc) })}>
                                                    {
                                                        renderKeepDays(duration, servertime, listdoc)
                                                    }
                                                </div>

                                                <div className={styles['list-content-path']}>
                                                    <Title
                                                        content={listdoc['path'].slice(6)}
                                                        className={styles['title']}
                                                    >
                                                        {decorateText(listdoc['path'].slice(6), { limit: 25 })}
                                                    </Title>
                                                </div>
                                            </div>
                                        }
                                    </DataList.Item>
                                )

                            }

                        </DataList>
                    </div>

                </LazyLoader>
            </div>


        </div >

    )

}


function renderKeepDays(duration, servertime, doc) {
    if (duration === -1) {
        return __('永久')
    }

    if ((servertime - doc.modified) < 0) {
        return `0${__('天')}`
    }
    let days = Math.floor(duration - (servertime - doc.modified) / (24 * 60 * 60 * 1000 * 1000));

    if (days >= 1) {
        return `${days}${__('天')}`
    } else {
        return `0${__('天')}`
    }
};

function isLeftDaysMoreThanTenDays(duration, servertime, doc) {
    if (duration === -1) {
        return true;
    }
    if ((servertime - doc.modified) < 0) {
        return false;
    }
    let days = Math.floor(duration - (servertime - doc.modified) / (24 * 60 * 60 * 1000 * 1000));
    return days > 10;
};

function renderTips(isLoading, isSearchEmpty, empty, loading, nullsearch) {
    let type = '';
    let icon = loading;
    let iconSize = 64;
    if (isLoading) {
        type = __('正在加载，请稍候......')
        iconSize = 48
    } else {
        if (isSearchEmpty) {
            type = __('抱歉，没有符合条件的搜索结果')
            icon = nullsearch
        } else {
            type = __('回收站为空')
            icon = empty
        }
    }

    return (
        <div className={styles['result-loading']}>
            <Centered>
                <div className={styles['clearing-box']}>
                    <Icon
                        url={icon}
                        size={iconSize}
                    />
                    <div className={styles['clearing-message']} >
                        {
                            type
                        }
                    </div>
                </div>
            </Centered>
        </div>
    )
}
export default RecycleList;