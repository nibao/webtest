import * as React from 'react';
import { noop, omit } from 'lodash';
import { customAttribute } from '../../core/attributes/attributes';
import { shallowEqual } from '../../util/accessor/accessor';
import { PureComponent } from '../../ui/decorators';

@PureComponent
export default class AttributesPickerBase extends React.Component<any, any> {
    static defaultProps = {
        path: [],

        onlySelectLeaf: false,

        onLoad: noop,

        onSelect: noop
    }

    state = {
        value: [],

        attributes: []
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.path && !shallowEqual(nextProps.path, this.props.path)) {
            this.loadPath(this.state.attributes)
        }
    }

    componentWillMount() {
        this.loadAttribute().then(attributes => this.loadPath(attributes));
    }

    /**
     * 加载完整路径
     */
    loadPath(attributes) {
        const value = this.findPath(attributes);
        this.setState({ value });
        this.props.onLoad(value);
    }

    /**
     * 获取attributeId下的层级结构
     */
    loadAttribute() {
        return customAttribute(this.props.attributeId).then(attributes => {
            this.setState({ attributes });
            return attributes;
        })
    }

    /**
     * 递归查找attributes下的匹配路径
     */
    findPath(attributes, result = []) {
        const finded = attributes.find(attr => attr.name === this.props.path[result.length]);

        if (finded && finded.child) {
            result.push(omit(finded, ['child']));
            return this.findPath(finded.child, result)
        }

        return result;
    }

    /**
     * 层级对象格式化
     */
    formatter(attr) {
        return attr.name;
    }

    /**
     * 选中层级事件
     */
    handleSelect(path) {
        this.props.onSelect(path);
    }
}