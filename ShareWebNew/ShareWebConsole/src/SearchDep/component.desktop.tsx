import * as React from 'react';
import * as classnames from 'classnames';
import AutoComplete from '../../ui/AutoComplete/ui.desktop';
import AutoCompleteList from '../../ui/AutoCompleteList/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import SearchDepBase from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';
import { NodeType, getSearchNodeIcon } from '../OrganizationTree/helper';

export default class SearchDep extends SearchDepBase {
    render() {
        return (
            <AutoComplete
                ref="autocomplete"
                width={ this.props.width }
                loader={ this.getDepsByKey.bind(this) }
                onLoad={ data => { this.getSearchData(data) } }
                placeholder={ __('搜索') }
                missingMessage={ __('未找到匹配的结果') }
                onEnter={ this.handleEnter.bind(this) }
            >
                {
                    this.state.results && this.state.results.length ?
                        <AutoCompleteList>
                            {
                                this.state.results.map(value => (
                                    <AutoCompleteList.Item >
                                        <a className={ styles['search-item'] } onClick={ () => { this.selectItem(value) } }>
                                            <span className={ styles['selected-data-Icon'] }>
                                                <UIIcon { ...getSearchNodeIcon(value) } size={ 16 } />
                                            </span>
                                            <span className={ styles['seleted-data'] }>
                                                <Text>{ value.departmentName || value.displayName }</Text>
                                            </span>
                                        </a>
                                    </AutoCompleteList.Item>
                                ))
                            }
                        </AutoCompleteList>
                        : null
                }
            </AutoComplete>
        )
    }


}