import * as React from 'react';
import { noop, omit, map } from 'lodash';
import { customAttribute } from '../../core/attributes/attributes';
import { PureComponent } from '../../ui/decorators';

@PureComponent
export default class EnumPickerBase extends React.Component<any, any> {
    static defaultProps = {
        name: '',

        onLoad: noop,

        onSelect: noop
    }

    state = {
        serializedOptions: []
    }

    componentWillMount() {
        this.loadAttribute().then(serializedOptions => this.loadSelected(serializedOptions));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.name && nextProps.name !== this.props.name) {
            this.loadSelected(this.state.serializedOptions)
        }
    }

    /**
     * 加载完整路径
     */
    loadSelected(serializedOptions) {
        const selected = serializedOptions.find(option => option.name === this.props.name)

        if (selected) {
            this.setState({ selected });
            this.props.onLoad(selected);
        }
    }

    /**
     * 获取attributeId下的层级结构
     */
    loadAttribute() {
        return customAttribute(this.props.attributeId).then(options => {
            const serializedOptions = [{ name: '', id: null }].concat(map(options, option => omit(option, ['child'])))
            this.setState({ serializedOptions });
            return serializedOptions;
        })
    }

    /**
     * 选中层级事件
     */
    handleSelect(option) {
        this.props.onSelect(option);
    }
}