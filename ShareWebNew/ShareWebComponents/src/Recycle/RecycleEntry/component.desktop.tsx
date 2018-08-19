import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import DataList from '../../../ui/DataList/ui.desktop';
import Icon from '../../../ui/Icon/ui.desktop';
import IconGroup from '../../../ui/IconGroup/ui.desktop';
import Title from '../../../ui/Title/ui.desktop';
import Centered from '../../../ui/Centered/ui.desktop';
import { formatSize, decorateText } from '../../../util/formatters/formatters';
import __ from './locale';
import * as styles from './styles.desktop.css';
import * as recycle from './assets/recycle.png';
import * as loading from './assets/loading.gif';
import * as empty from './assets/clearing.png';

const RecycleEntry: React.StatelessComponent<Components.Recycle.RecycleEntry.Props> = function RecycleEntry({
    scroll,
    isLoading,
    entryDocs,
    entrySelections,
    getListRef = noop,
    handleClick = noop,
    handleSelected = noop,
    handleDoubleClick = noop,
    handleContextMenu = noop,
    handleClickEmptyBtn = noop,
    handleClickViewSize = noop,
    handleClickStorageBtn = noop,
}) {

    return (
        <div className={classnames(styles['entry-container'])}>


            <div className={styles['entry-head']}>
                <div className={styles['entry-head-item']}>
                    <div className={classnames(styles['entry-head-name'], { [styles['entry-head-name-scroll']]: scroll })}>{__('回收站名称')}</div>
                    <div className={classnames(styles['entry-head-size'], { [styles['entry-head-size-scroll']]: scroll })}>{__('大小')}</div>
                    <div className={classnames(styles['entry-head-type'])}>{__('类型')}</div>
                </div>
            </div>

            <div
                className={styles['entry-box']}
                ref={(ref) => getListRef(ref)}
            >

                {
                    isLoading || entryDocs.length === 0 ?
                        renderTips(isLoading, entryDocs, empty, loading)
                        :
                        null
                }

                <DataList
                    multiple={true}
                    onSelectionChange={handleSelected}
                    selections={entrySelections}
                    onDoubleClick={handleDoubleClick}
                    onContextMenu={handleContextMenu}
                >
                    {

                        entryDocs.map((entrydoc) =>
                            <DataList.Item
                                className={styles['entry-item']}
                                data={entrydoc}
                                key={entrydoc['docid']}
                            >
                                {
                                    <div className={styles['entry-content']}>
                                        <span className={styles['entry-content-name']}>
                                            <span onClick={(e) => { handleClick(e, entrydoc) }}>
                                                <Icon
                                                    url={recycle}
                                                    size={'32px'}
                                                />
                                                <span className={styles['entry-content-text']}>
                                                    <Title content={entrydoc['docname']}>
                                                        {decorateText(entrydoc['docname'], { limit: 40 })}
                                                    </Title>
                                                </span>

                                            </span>


                                            <IconGroup
                                                onDoubleClick={e => { e.preventDefault() }}
                                                onClick={e => e.preventDefault()}
                                                className={styles['icon-groups']}
                                            >
                                                <IconGroup.Item
                                                    code={'\uf044'}
                                                    size={16}
                                                    title={__('回收站策略')}
                                                    className={classnames(styles['action-icon'], { [styles['actived']]: entrySelections.length === 1 && entrySelections[0].docid === entrydoc.docid })}
                                                    onClick={(e) => { handleClickStorageBtn(e, entrydoc); }}
                                                />
                                                <IconGroup.Item
                                                    code={'\uf09D'}
                                                    size={16}
                                                    title={__('清空')}
                                                    className={classnames(styles['action-icon'], { [styles['actived']]: entrySelections.length === 1 && entrySelections[0].docid === entrydoc.docid })}
                                                    onClick={(e) => { handleClickEmptyBtn(e, entrydoc); }}
                                                />
                                                <IconGroup.Item
                                                    code={'\uf053'}
                                                    size={16}
                                                    title={__('查看大小')}
                                                    className={classnames(styles['action-icon'], { [styles['actived']]: entrySelections.length === 1 && entrySelections[0].docid === entrydoc.docid })}
                                                    onClick={(e) => { handleClickViewSize(e, entrydoc); }}
                                                />
                                            </IconGroup>


                                        </span>


                                        <span className={styles['entry-content-size']}>{entrydoc.hasOwnProperty('_size') ? formatSize(entrydoc['_size']) : '---'}</span>
                                        <span className={styles['entry-content-type']}>{entrydoc['typename'] === '非法文件' ? '文档库' : entrydoc['typename']}</span>

                                    </div>

                                }
                            </DataList.Item>
                        )
                    }

                </DataList>

            </div>
        </div >
    )

}


function renderTips(isLoading, entryDocs, empty, loading) {
    let type = '';
    let icon = loading;
    let iconSize = 48;
    if (isLoading) {
        type = __('正在加载，请稍候......')
    } else if (entryDocs.length === 0) {
        type = __('回收站为空。')
        icon = empty
        iconSize = 64
    }

    return (
        <Centered>
            <div className={styles['clearing-box']} >
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
    )
}

export default RecycleEntry;

