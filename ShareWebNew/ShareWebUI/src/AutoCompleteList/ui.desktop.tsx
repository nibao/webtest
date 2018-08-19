import * as React from 'react';
import AutoCompleteListItem from '../AutoCompleteList.Item/ui.desktop';
import AutoCompleteListBase from './ui.base'
import * as styles from './styles.desktop.css';

export default class AutoCompleteList extends AutoCompleteListBase {

    static Item = AutoCompleteListItem;

    render() {
        return (
            <div
                className={styles['autocomplte-list']}
                style={{ 'maxHeight': this.props.maxHeight }}
                onMouseMove={this.setSelectByMouseMove.bind(this)}
            >
                <ul
                    ref="list"
                >
                    {
                        React.Children.map(this.props.children, (child, index) => React.cloneElement(child, {
                            selected: this.props.selectIndex === index,
                            onMouseOver: (e) => this.handleMouseOver(e, index)
                        }))
                    }
                </ul>
            </div>
        )
    }
}