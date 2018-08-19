import * as React from 'react';
import { omit, map } from 'lodash';
import AttributesPickerBase from './component.base';
import CascadeArea from '../../ui/CascadeArea/ui.desktop';
import CascadeAreaSelect from '../../ui/CascadeAreaSelect/ui.desktop';

export default class AttributesPicker extends AttributesPickerBase {
    generateOptions(data, depth = 0, isMatchParent?) {

        return data.map(o => {
            // 如果是第一层级，则查找匹配的顶级属性
            // 否则判断父层级是否选中，如果父层级选中则继续在当前层级中查找
            const isMatch = (depth === 0 || isMatchParent) ? o.name === this.props.path[depth] : false;

            return (
                <CascadeArea.Option
                    value={omit(o, ['child'])}
                    formatter={this.formatter}
                    defaultSelected={isMatch}
                    isLeaf={!o.child || !o.child.length}
                    key={o.id}
                    >
                    {
                        o.child ? this.generateOptions(o.child, depth + 1, isMatch) : null
                    }
                </CascadeArea.Option>
            );
        });
    }

    render() {
        return (
            <CascadeAreaSelect
                value={this.state.value}
                onSelect={this.handleSelect.bind(this)}
                formatter={path => map(path, x => x.name).join(' > ') || '---'}
                >
                <CascadeArea onlySelectLeaf={this.props.onlySelectLeaf}>
                    {
                        this.generateOptions([{ name: '---' } /* 用来设定空值 */].concat(this.state.attributes))
                    }
                </CascadeArea>
            </CascadeAreaSelect>
        );
    }
}