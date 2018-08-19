import * as React from 'react'
import { noop } from 'lodash'
import { NWWindow } from '../../ui/ui.client'
import { ClientComponentContext } from '../helper'
import MyFavoritesView from './component.view'
import __ from './locale'

const MyFavorites: React.StatelessComponent<Components.MyFavorites.Props> = ({
    doDirOpen = noop,
    doFilePreview = noop,
    doShare = noop,
    doLinkShare = noop,
    onOpenFavoritesDialog = noop,
    onCloseFavoritesDialog = noop,
    onFavoriteCancel = noop,
    favoritedDocid = undefined,
    favorited = undefined,
    docs = undefined,
    fields,
    id,
}) => (
        <NWWindow
            id={id}
            title={__('我的收藏')}
            width={1100}
            height={650}
            onOpen={onOpenFavoritesDialog}
            onClose={onCloseFavoritesDialog}
            {...fields}
        >
            <ClientComponentContext.Consumer>
                <MyFavoritesView
                    doDirOpen={doDirOpen}
                    doFilePreview={doFilePreview}
                    doShare={doShare}
                    doLinkShare={doLinkShare}
                    onFavoriteCancel={onFavoriteCancel}
                    favoritedDocid={favoritedDocid}
                    favorited={favorited}
                    docs={docs}
                />
            </ClientComponentContext.Consumer>
        </NWWindow>
    )

export default MyFavorites