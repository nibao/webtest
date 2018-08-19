import * as React from 'react';
import { map, assign, cloneDeep } from 'lodash';
import AttrTextField from '../../ui/AttrTextField/ui.client';
import ExtraMetaInfoBase from './component.base';
import * as styles from './styles.client.css';
import __ from './locale';

export default class ExtraMetaInfo extends ExtraMetaInfoBase {

    render() {
        return (
            <div className={styles['container']}>
                {
                    this.state.displayedAttrs && this.state.displayedAttrs.length
                        ?
                        <div>
                            <div className={styles['title']}>{__('更多属性')}</div>
                            <div className={styles['pad']} />
                            <div className={styles['content-padding']}>
                                <div className={styles['meta-block']}>
                                    {
                                        this.renderAttr()
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
            </div>
        )
    }

    renderAttr() {
        return (
            <div>
                {
                    map(this.state.displayedAttrs, attr => {
                        return <AttrTextField attr={attr} />
                    })
                }
            </div>
        )
    }
}