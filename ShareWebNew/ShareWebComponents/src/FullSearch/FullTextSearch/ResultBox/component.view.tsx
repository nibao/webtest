import * as React from 'react';
import * as classnames from 'classnames';
import { isEqual, noop } from 'lodash';
import { findType } from '../../../../core/extension/extension';
import { isUserId } from '../../../../core/user/user'
import Button from '../../../../ui/Button/ui.desktop';
import DataList from '../../../../ui/DataList/ui.desktop';
import Icon from '../../../../ui/Icon/ui.desktop';
import LazyLoader from '../../../../ui/LazyLoader/ui.desktop';
import PopMenu from '../../../../ui/PopMenu/ui.desktop';
import PopMenuItem from '../../../../ui/PopMenu.Item/ui.desktop';
import IconGroup from '../../../../ui/IconGroup/ui.desktop';
import Thumbnail from '../../../Thumbnail/component.desktop';
import UIIcon from '../../../../ui/UIIcon/ui.desktop';
import Title from '../../../../ui/Title/ui.desktop';
import Text from '../../../../ui/Text/ui.desktop';
import Centered from '../../../../ui/Centered/ui.desktop';
import { formatTime, formatTimeRelative, formatSize, decorateText } from '../../../../util/formatters/formatters';
import __ from './locale';
import * as styles from './styles.desktop.css';
import * as empty from '../assets/empty.png';
import * as loading from '../assets/loading.gif';

const ResultBoxView: React.StatelessComponent<Components.FullSearch.FullTextSearch.ResultBox.Props> = function ResultBoxView({
    count,
    client = false,
    isLoading,
    resultDocs,
    keysfields = ['basename', 'content'],
    sortSelection,
    resultHighlight,
    resultSelection,
    resultTagsShown,
    resultCollections,
    onLazyLoad = noop,
    onWarningChange = noop,
    onGetLazyLoadRef = noop,
    handlePreviewFile = noop,
    handleSelectResult = noop,
    handleClickAddTags = noop,
    handleClickShowTags = noop,
    handleLinkToFilePath = noop,
    handleClickLinkButton = noop,
    handleClickShareButton = noop,
    handleClickSortSelection = noop,
    handleClickCollectButton = noop,
    handleClickDownloadButton = noop,

}) {

    let sortTypes = [
        { name: __('按匹配度排序'), value: '' },
        { name: __('按修改时间降序'), value: '-modified' },
        { name: __('按修改时间升序'), value: 'modified' },
        { name: __('按创建时间降序'), value: '-created' },
        { name: __('按创建时间升序'), value: 'created' },
        { name: __('按文件大小降序'), value: '-size' },
        { name: __('按文件大小升序'), value: 'size' }
    ]

    return (
        <div className={classnames(styles['result-box'])}>
            <div className={styles['result-head']}>
                {
                    !resultDocs ?
                        null
                        :
                        <div className={styles['result-head-item']}>
                            {__('共')}
                            <span className={styles['result-length']}>
                                {count}
                            </span>
                            {__('条搜索结果')}
                            {__('（实际可见条数取决于您的访问权限）')}
                        </div>

                }
                <PopMenu
                    anchorOrigin={['right', 'bottom']}
                    targetOrigin={['right', 'top']}
                    triggerEvent={resultDocs && resultDocs.length > 0 && 'mouseover'}
                    freezable={false}
                    watch={true}
                    autoFix={false}
                    trigger={
                        <Button
                            className={classnames(styles['result-sort-btn'])}
                            onClick={() => onWarningChange()}
                            disabled={!resultDocs || resultDocs.length === 0}
                        >
                            <span className={classnames(styles['button-text'])}>
                                {sortSelection.name}
                            </span>
                            <UIIcon
                                className={classnames(styles['expand-icon'])}
                                code={'\uF04C'}
                                size="14px"
                            >
                            </UIIcon>
                        </Button>
                    }
                    closeWhenMouseLeave={true}
                    onRequestCloseWhenClick={close => close()}

                >
                    {
                        sortTypes.map((type) => (
                            <PopMenuItem
                                className={styles['sort-menu-btn']}
                                icon={isEqual(type, sortSelection) ? '\uf068' : undefined}
                                label={type.name}
                                onClick={() => { handleClickSortSelection(type) }}
                            >
                            </PopMenuItem>
                        ))
                    }
                </PopMenu>




            </div>
            {
                isLoading ?
                    <div className={styles['result-loading']}>
                        <Centered>
                            <div className={styles['loading-box']} >
                                <Icon
                                    url={loading}
                                    size={48}
                                />
                                {
                                    <div className={styles['loading-message']}>{__('正在搜索，请稍候......')}</div>
                                }
                            </div>
                        </Centered>
                    </div>
                    :
                    (!resultDocs || resultDocs.length === 0) ?
                        <Centered>
                            {
                                <div className={styles['loading-box']} >
                                    <Icon
                                        url={empty}
                                        size={64}
                                    />

                                    {
                                        !resultDocs ?
                                            <div className={styles['loading-message']}>{__('此处显示搜索结果')}</div>
                                            :
                                            <div className={styles['loading-message']}>{__('抱歉，没有找到符合条件的结果')}</div>
                                    }
                                </div>
                            }
                        </Centered>
                        :
                        null
            }
            {
                <LazyLoader
                    ref={(ref) => onGetLazyLoadRef(ref)}
                    limit={20}
                    trigger={0.999}
                    onChange={!isLoading ? onLazyLoad : noop}
                >
                    <DataList
                        multiple={true}
                        onSelectionChange={(selections) => handleSelectResult(selections)}
                        selections={resultSelection}
                        className={styles['result-content-datalist']}
                    >
                        {
                            resultDocs && resultDocs.map((doc) =>
                                <DataList.Item
                                    key={doc['docid']}
                                    className={styles['result-item']}
                                    data={doc}
                                    checkbox={false}
                                >

                                    <div className={styles['result-content']}>
                                        <div className={styles['result-title']}>
                                            {
                                                findType(doc['basename'] + doc['ext']) !== 'IMG' ?
                                                    <Thumbnail
                                                        className={styles['result-icon']}
                                                        doc={doc}
                                                        size={32}
                                                        onClick={() => handlePreviewFile(doc)}
                                                    />
                                                    :
                                                    <Thumbnail
                                                        className={styles['result-icon']}
                                                        type={'IMG'}
                                                        size={32}
                                                        onClick={() => handlePreviewFile(doc)}
                                                    />

                                            }
                                            <div className={styles['result-title-link']}>
                                                <div
                                                    className={styles['result-name']}
                                                    title={doc['basename']}
                                                    onClick={() => handlePreviewFile(doc)}
                                                >
                                                    {
                                                        renderHighlightHtml(
                                                            resultHighlight[doc['docid']] && resultHighlight[doc['docid']].hasOwnProperty('basename') ?
                                                                resultHighlight[doc['docid']]['basename'][0] + doc['ext'] :
                                                                doc['basename'] + doc['ext']
                                                        )
                                                    }
                                                </div>

                                                <IconGroup
                                                    onDoubleClick={e => { e.preventDefault() }}
                                                    onClick={e => e.preventDefault()}
                                                    className={styles['icon-groups']}
                                                >
                                                    <IconGroup.Item
                                                        className={classnames(styles['result-menu-btn'], {
                                                            [styles['collect-menu-btn']]: resultCollections[doc['docid']],
                                                            [styles['active-menu-btn']]: resultSelection.length === 1 && resultSelection[0] === doc
                                                        })}
                                                        code={resultCollections[doc['docid']] ? '\uf095' : '\uf094'}
                                                        size="16px"
                                                        title={resultCollections[doc['docid']] ? __('取消收藏') : __('收藏')}
                                                        onClick={(e) => { handleClickCollectButton(e, doc); }}
                                                    />
                                                    <IconGroup.Item
                                                        className={classnames(styles['result-menu-btn'], { [styles['active-menu-btn']]: resultSelection.length === 1 && resultSelection[0] === doc })}
                                                        code={'\uf025'}
                                                        size="16px"
                                                        title={__('内链共享')}
                                                        onClick={(e) => { handleClickShareButton(e, doc); }}
                                                    />
                                                    <IconGroup.Item
                                                        className={classnames(styles['result-menu-btn'], { [styles['active-menu-btn']]: resultSelection.length === 1 && resultSelection[0] === doc })}
                                                        code={'\uf026'}
                                                        size="16px"
                                                        title={__('外链共享')}
                                                        onClick={(e) => { handleClickLinkButton(e, doc); }}
                                                    />
                                                    {
                                                        client ?
                                                            null
                                                            :
                                                            <IconGroup.Item
                                                                className={classnames(styles['result-menu-btn'], { [styles['active-menu-btn']]: resultSelection.length === 1 && resultSelection[0] === doc })}
                                                                code={'\uf02A'}
                                                                size="16px"
                                                                title={__('下载')}
                                                                onClick={(e) => { handleClickDownloadButton(e, doc); }}
                                                            />

                                                    }

                                                </IconGroup>

                                            </div>

                                        </div>

                                        <div className={styles['result-box']}>

                                            {
                                                findType(doc['basename'] + doc['ext']) === 'IMG' ?
                                                    <div className={styles['result-body']}>
                                                        <Thumbnail
                                                            className={styles['result-thumbnail']}
                                                            doc={doc}
                                                            size={64}
                                                            onClick={() => handlePreviewFile(doc)}
                                                        />
                                                    </div>
                                                    :
                                                    resultHighlight[doc['docid']] && resultHighlight[doc['docid']]['content'] ?
                                                        <div className={styles['result-body']}>
                                                            {renderHighlightHtml(resultHighlight[doc['docid']]['content'][0])}
                                                        </div>
                                                        :
                                                        null
                                            }


                                            {
                                                doc['tags'].length === 0 ?
                                                    null
                                                    :

                                                    <div className={classnames(styles['result-tags'], { [styles['result-tags-visible']]: resultTagsShown[doc.docid] })}>
                                                        <UIIcon
                                                            className={(styles['result-tags-icon'])}
                                                            code={resultTagsShown[doc.docid] ? '\uf04c' : '\uf04e'}
                                                            size="17px"
                                                            onClick={(e) => { e.stopPropagation(); handleClickShowTags(doc); }}
                                                        >

                                                        </UIIcon>
                                                        {
                                                            doc['tags'].map((tag) => (
                                                                <Button
                                                                    className={classnames(styles['result-tag'], { [styles['resutl-tag-visible']]: resultTagsShown[doc.docid] })}
                                                                    onClick={(e) => { e.stopPropagation(); handleClickAddTags(tag) }}

                                                                >
                                                                    {tag}
                                                                </Button>
                                                            ))
                                                        }
                                                    </div>


                                            }

                                            <div className={styles['result-details']}>
                                                <Text
                                                    ellipsizeMode={'middle'}
                                                    numberOfChars={12}
                                                    className={styles['result-author']}
                                                >
                                                    {
                                                        (isUserId(doc['creator']) || !doc['creator']) ?
                                                            __('未知用户')
                                                            : doc['creator']
                                                    }
                                                </Text>
                                                <span>{__('创建于：')}</span>
                                                <span className={styles['result-create']}>
                                                    {
                                                        doc['created'] === 0 || !doc['created'] ?
                                                            __('未知时间') :
                                                            formatTimeRelative(doc['created'] / 1000)
                                                    }
                                                </span>
                                                <Text
                                                    ellipsizeMode={'middle'}
                                                    numberOfChars={12}
                                                    className={styles['result-author']}
                                                >
                                                    {
                                                        (isUserId(doc['editor']) || !doc['editor']) ?
                                                            __('未知用户')
                                                            : doc['editor']
                                                    }
                                                </Text>
                                                <span>{__('修改于：')}</span>
                                                <span className={styles['result-modified']}>
                                                    {formatTimeRelative(doc['modified'] / 1000)}
                                                </span>
                                                <span className={styles['result-size']}>
                                                    {formatSize(doc['size'])}
                                                </span>
                                                <span>{__('所在位置：')}</span>
                                                <span
                                                    className={styles['result-path']}
                                                    onClick={() => { handleLinkToFilePath(doc) }}
                                                >
                                                    <Text>
                                                        {doc['parentpath'].slice(6)}
                                                    </Text>
                                                </span>

                                                {
                                                        /* <UIIcon
                                                            className={(styles['result-menu-btn'])}
                                                            code={'\uf084'}
                                                            size="17px"
                                                            onClick={() => { this.handleClickCopyPathButton(doc); }}
                                                        >

                                                        </UIIcon> */}

                                            </div>
                                        </div>
                                    </div>


                                </DataList.Item>
                            )
                        }

                    </DataList>
                </LazyLoader>
            }


        </div>

    )
}

/**
 * 高亮显示搜索关键字部分
 */
function renderHighlightHtml(resultHtml) {
    resultHtml = resultHtml
        .replace(/\<em\>/g, '\uf000')
        .replace(/\<\/em\>/g, '\uf001')
        .replace(/\</g, '&lt;')
        .replace(/\>/g, '&gt;')
        .replace(/\uf001/g, '</em>')
        .replace(/\uf000/g, '<em>')

    return (
        <span dangerouslySetInnerHTML={{ __html: resultHtml }} />
    );
}


export default ResultBoxView;
