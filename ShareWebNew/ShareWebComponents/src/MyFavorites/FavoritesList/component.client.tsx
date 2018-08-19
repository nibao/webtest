import * as React from 'react'
import { noop } from 'lodash'
import { EmptyResult } from '../../../ui/ui.desktop'
import FavoritesListView from './component.view'
import * as NoFavorites from '../assets/NoFavorites.png'
import * as styles from './styles.client.css'
import __ from './locale'

const FavoritesList: React.StatelessComponent<Components.MyFavorites.FavoritesList.Props> = ({
    docs,
    doFilePreview = noop,
    doDirOpen = noop,
    onFavoriteCancel = noop,
    doShare = noop,
    doLinkShare = noop,
    selections = [],
    doSelectionChange = noop,
}) => (
        <div className={styles['wrapper']}>
            {
                docs && docs.length !== 0
                    ?
                    (
                        <FavoritesListView
                            docs={docs}
                            selections={selections}
                            doSelectionChange={doSelectionChange}
                            onFavoriteCancel={onFavoriteCancel}
                            doFilePreview={doFilePreview}
                            doDirOpen={doDirOpen}
                            doShare={doShare}
                            doLinkShare={doLinkShare}
                        />
                    )
                    :
                    (
                        <EmptyResult
                            picture={NoFavorites}
                            details={__('暂无收藏')}
                        />
                    )
            }
        </div>
    )

export default FavoritesList

