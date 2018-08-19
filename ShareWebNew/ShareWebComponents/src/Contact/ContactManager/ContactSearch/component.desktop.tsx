import * as React from 'react';
import * as classnames from 'classnames';
import PopMenu from '../../../../ui/PopMenu/ui.desktop';
import PopMenuItem from '../../../../ui/PopMenu.Item/ui.desktop';
import SearchBox from '../../../../ui/SearchBox/ui.desktop'
import Text from '../../../../ui/Text/ui.desktop'
import { shrinkText } from '../../../../util/formatters/formatters';
import ContactSearchBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class ContactSearch extends ContactSearchBase {

    render() {
        let { anchor, result } = this.state;
        return (
            <div ref="searchInput" onFocus={this.handleSearchFocus.bind(this)} >

                <PopMenu
                    anchor={anchor}
                    anchorOrigin={['right', 'bottom']}
                    targetOrigin={['right', 'top']}
                    className={classnames(styles['contact-search-menu'])}
                    open={result}
                    watch={true}
                    freezable={false}
                    trigger={
                        <SearchBox
                            ref="searchBox"
                            width={this.props.width}
                            placeholder={__('查找联系人')}
                            loader={this.search.bind(this)}
                            onLoad={this.onLoad.bind(this)}

                        />
                    }
                    onRequestCloseWhenBlur={(close) => this.handleClose(close)}
                >
                    {
                        result ?
                            result.length === 0 ?
                                <PopMenuItem
                                    className={styles['contact-search-noresult']}
                                >
                                    {__('未找到匹配结果')}
                                </PopMenuItem>
                                :
                                result.map((res) =>
                                    <PopMenuItem
                                        className={styles['condition-search-resultItem']}
                                        onClick={() => { this.handleClickMenuItem(res) }}
                                    >
                                        <div className={styles['condition-result-name']}>
                                            <Text
                                                ellipsizeMode={'tail'}
                                                numberOfChars={20}
                                            >
                                                {res.name}
                                            </Text>
                                        </div>
                                        <div className={styles['condition-result-group']}>
                                            <Text
                                                ellipsizeMode={'tail'}
                                                numberOfChars={20}
                                            >
                                                {`${__('分组：')}${res.groupname ? res.groupname : ''}`}
                                            </Text>
                                        </div>
                                    </PopMenuItem>
                                )
                            :
                            null
                    }

                </PopMenu>
            </div>



        )
    }
}