import * as React from 'react';
import AutoComplete from '../../ui/AutoComplete/ui.desktop';
import AutoCompleteList from '../../ui/AutoCompleteList/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import VisitorSearcherBase from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class VisitorSearcher extends VisitorSearcherBase {

    formatter(data: any): string {
        if (data.userid) {
            switch (true) {
                case data.account === '':
                    return `${data.name}`
                case data.name !== '' && data.account !== '':
                    return `${data.name}(${data.account})`
            }
        }else {
            return data.depid ? `${data.name}(${__('部门')})` : `${data.groupname}(${__('联系组')})`
        }
    }

    render() {
        const { results } = this.state;
        return (
            <AutoComplete
                ref="autocomplete"
                width={ this.props.width }
                loader={ this.loader.bind(this) }
                placeholder={ __('请输入...') }
                missingMessage={ __('未找到匹配的结果') }
                onEnter={ this.handleEnter.bind(this) }
                onLoad={ this.handleLoad.bind(this) }
            >
                {
                    (results && results.length) ? (
                        <AutoCompleteList>
                            {
                                results.map((data) => (
                                    <AutoCompleteList.Item key={ data.userid ? data.userid : (data.depid ? data.depid : data.id) }>
                                        <div onClick={ this.handleClick.bind(this, data) }>
                                            <Text className={ styles['item'] }>
                                                { this.formatter(data) }
                                            </Text>
                                        </div>
                                    </AutoCompleteList.Item>
                                ))
                            }
                        </AutoCompleteList>
                    ) : null
                }
            </AutoComplete>
        )
    }
}          