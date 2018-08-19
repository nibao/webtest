import * as React from 'react';
import AutoComplete from '../../ui/AutoComplete/ui.desktop';
import AutoCompleteList from '../../ui/AutoCompleteList/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import ConcatSearcherBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class ConcatSearcher extends ConcatSearcherBase {

    render() {
        const results = this.state.results;
        return (
            <AutoComplete
                ref="autocomplete"
                width={ this.props.width }
                loader={ this.search.bind(this) }
                onLoad={ this.onLoad.bind(this) }
                placeholder={ __('查找访问者') }
                missingMessage={ __('未找到匹配的结果') }
                onEnter={ this.handleEnter.bind(this) }
            >
                {
                    results && results.length > 0 ?
                        <AutoCompleteList>
                            {
                                results.map((data) => (
                                    <AutoCompleteList.Item key={ data.userid ? data.userid : data.id }>
                                        <div onClick={ this.handleClick.bind(this, data) }>
                                            <Text className={ styles['item'] }>
                                                {
                                                    this.formatter(data)
                                                }
                                            </Text>
                                        </div>
                                    </AutoCompleteList.Item>
                                ))
                            }
                        </AutoCompleteList>
                        : null
                }

            </AutoComplete>
        )
    }

    /**
* 显示转换后的值
* @param 转换的对象 
*/
    formatter(data) {
        if (data.userid) {
            switch (true) {
                case data.account === '':
                    return `${data.name}`
                case data.name !== '' && data.account !== '':
                    return `${data.name}(${data.account})`
            }
        }else {
            return `${data.groupname}${__('(联系组)')}`
        }
    }
}