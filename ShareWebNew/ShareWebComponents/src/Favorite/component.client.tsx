import * as React from 'react'
import { UIIcon, Text } from '../../ui/ui.desktop'
import { NWWindow, MessageDialog } from '../../ui/ui.client'
import Thumbnail from '../Thumbnail/component.desktop'
import { formatterErrorMessage } from './helper'
import FavoriteBase from './component.base'
import * as styles from './style.client.css'
import __ from './locale'

export default class Favorite extends FavoriteBase {
    render() {
        const { doc, favorited, errorCode } = this.state

        return (
            <div className={styles['div']}>

                <div className={styles['file-icon']}>
                    <Thumbnail
                        doc={doc}
                        size={24}
                    />
                </div>

                <Text
                    className={styles['text']}
                    ellipsizeMode={'middle'}
                    numberOfChars={15}
                >
                    {doc ? doc.name : null}
                </Text>

                {
                    doc
                        ?
                        (
                            favorited
                                ?
                                (
                                    <UIIcon
                                        className={styles['icon']}
                                        size={16}
                                        code={'\uf095'}
                                        color={'#f6cf57'}
                                        title={__('取消收藏')}
                                        onClick={this.handleCancelFavorited.bind(this, doc)}
                                    />
                                )
                                :
                                (
                                    <UIIcon
                                        className={styles['icon']}
                                        size={16}
                                        code={'\uf094'}
                                        title={__('收藏')}
                                        onClick={this.handleFavorited.bind(this, doc)}
                                    />
                                )
                        ) : null
                }

                {
                    errorCode
                        ?
                        (
                            <NWWindow
                                title={__('提示')}
                                onOpen={nwWindow => this.noPermissionsWindow = nwWindow}
                                onClose={() => this.setState({ errorCode: undefined })}
                                modal={true}
                            >
                                <MessageDialog
                                    onConfirm={() => this.noPermissionsWindow.close()}
                                >
                                    {formatterErrorMessage(errorCode, doc)}
                                </MessageDialog>
                            </NWWindow>
                        ) : null
                }
            </div >
        )
    }
}


