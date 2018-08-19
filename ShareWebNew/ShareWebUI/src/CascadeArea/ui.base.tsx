import * as React from 'react';
import { last, forEach, without, map, noop, some } from 'lodash';

export default class CascadeAreaBase extends React.Component {
    static defaultProps = {
        onSelect: noop,

        onlySelectLeaf: false
    }

    selection = [];

    protected onSelect(selection) {
        forEach(without(this.selection, ...selection), option => option.setState({ selected: false }));
        this.selection = selection;

        if (this.props.onlySelectLeaf) {
            last(selection).props.isLeaf && this.props.onSelect(map(selection, option => option.props.value));
        } else {
            this.props.onSelect(map(selection, option => option.props.value));
        }
    }
}