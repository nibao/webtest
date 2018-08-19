import * as React from 'react'
import { SearchBox, Icon, Centered } from '../../ui/ui.desktop'
import FavoritesList from './FavoritesList/component.desktop'
import ContextMenu from './ContextMenu/component.desktop'
import MyFavoritesBase from './component.base'
import * as loadImg from './assets/Loading.gif'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class MyFavorites extends MyFavoritesBase {
    render() {
        const { doShare, doLinkShare, doDownload, doFilePreview, doDirOpen } = this.props
        const { favoritesDocs, filterResults, searchKey, selections, showContextMenu, contextMenuPosition } = this.state

        return (
            <div className={styles['favorites']}>
                <div className={styles['search-field']}>
                    <SearchBox
                        disabled={favoritesDocs && favoritesDocs.length !== 0 ? false : true}
                        className={styles['search-box']}
                        width={256}
                        value={searchKey}
                        placeholder={__('搜索')}
                        onChange={this.handleSearchBoxChange.bind(this)}
                    />
                </div>

                {
                    favoritesDocs
                        ?
                        (
                            <FavoritesList
                                searchKey={searchKey}
                                docs={searchKey === '' ? favoritesDocs : filterResults}
                                doFilePreview={(e, doc) => doFilePreview(doc)}
                                doDirOpen={(doc) => { doDirOpen(doc) }}
                                onFavoriteCancel={(doc) => { this.handleCancelFavorite(doc) }}
                                doShare={doShare}
                                doLinkShare={doLinkShare}
                                doDownload={doDownload}
                                selections={selections}
                                doSelectionChange={(selections) => { this.setState({ selections: selections }) }}
                                doContextMenu={this.handleContextMenu.bind(this)}
                            />

                        )
                        :
                        (
                            <Centered>
                                <Icon
                                    url={loadImg}
                                    size={24}
                                />
                                <p
                                    className={styles['loading-text']}
                                >
                                    {__('正在加载，请稍候......')}
                                </p>
                            </Centered>
                        )
                }

                <ContextMenu
                    position={contextMenuPosition}
                    open={showContextMenu}
                    selections={selections}
                    onRequestClose={this.closeContextMenu.bind(this)}
                    onFavoriteCancel={(doc) => { this.handleCancelFavorite(doc) }}
                    doShare={doShare}
                    doLinkShare={doLinkShare}
                    doDownload={doDownload}
                    doDirOpen={(doc) => { doDirOpen(doc) }}
                />

            </div>
        )
    }
}
