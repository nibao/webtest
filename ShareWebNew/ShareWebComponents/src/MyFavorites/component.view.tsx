import * as React from 'react'
import { Icon, Centered } from '../../ui/ui.desktop'
import MyFavoritesBase from './component.base'
import FavoritesList from './FavoritesList/component.client'
import * as styles from './styles.client.css'
import * as loadImg from './assets/Loading.gif'
import __ from './locale'

export default class MyFavoritesView extends MyFavoritesBase {
    render() {
        const { doDirOpen, doFilePreview, doShare, doLinkShare } = this.props
        const { favoritesDocs, selections } = this.state

        return (
            <div
                className={styles['datalist-wrapper']}
            >
                {
                    favoritesDocs
                        ?
                        (
                            <FavoritesList
                                docs={favoritesDocs}
                                selections={selections}
                                doSelectionChange={(selections) => { this.setState({ selections: selections }) }}
                                onFavoriteCancel={(doc) => { this.handleCancelFavorite(doc) }}
                                doFilePreview={doFilePreview}
                                doDirOpen={doDirOpen}
                                doShare={doShare}
                                doLinkShare={doLinkShare}
                            />
                        )
                        :
                        (
                            <div className={styles['loading']}>
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
                            </div>
                        )
                }
            </div>
        )
    }
}


