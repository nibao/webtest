import * as React from 'react';
import * as classnames from 'classnames'
import AutoComplete from '../../ui/AutoComplete/ui.desktop';
import AutoCompleteList from '../../ui/AutoCompleteList/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import DepatrmentSearcherBase from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class DepartmentSearcher extends DepatrmentSearcherBase {

    formatter(data) {
        if (data.userid) {
            switch (true) {
                case data.account === '':
                    return `${data.name}`
                case data.name !== '' && data.account !== '':
                    return `${data.name}(${data.account})`
            }
        } else {
            return `${data.name}(${__('部门')})`
        }
    }

    render() {
        const { results } = this.state;
        return (
            <AutoComplete
                ref="autocomplete"
                width={this.props.width}
                loader={this.loader.bind(this)}
                onLoad={this.handleLoad.bind(this)}
                placeholder={__('查找访问者')}
                missingMessage={__('未找到匹配的结果')}
                onEnter={this.handleEnter.bind(this)}
            >
                {
                    (results && results.length) ? (
                        <AutoCompleteList>
                            {
                                results.map((data) => (
                                    <AutoCompleteList.Item key={data.userid ? data.userid : data.depid}>
                                        <div onClick={this.handleClick.bind(this, data)}>
                                            <Text className={styles['item']}>
                                                {
                                                    this.formatter(data)
                                                }
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