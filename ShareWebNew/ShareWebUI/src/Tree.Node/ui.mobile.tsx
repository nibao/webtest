import * as React from 'react';
import * as classnames from 'classnames';
import CheckBox from '../CheckBox/ui.mobile';
import TreeNodeBase from './ui.base';
import LinkChip from '../LinkChip/ui.mobile';
import LinkIcon from '../LinkIcon/ui.mobile';
import * as styles from './styles.mobile.css';
import * as collapsed from './assets/collapsed.mobile.png';
import * as expanded from './assets/expanded.mobile.png';

export default class TreeNode extends TreeNodeBase {
    render() {
        return (
            <div className={classnames(styles['node'])}>
                <div className={classnames(styles['detail'], { [styles['selected']]: this.state.selected })}>
                    {
                        !this.props.isLeaf ?
                            <LinkIcon
                                className={styles['toggler']}
                                url={this.state.collapsed ? collapsed : expanded}
                                size="22"
                                onClick={() => this.toggleNode(this.props.data)}
                                />
                            : null

                    }
                    <LinkChip
                        className={styles['name']}
                        onClick={this.selectNode.bind(this)}
                        >
                        {
                            this.props.checkbox
                                ? <CheckBox checked={this.state.selected} onClick={this.handleCheckBoxChange.bind(this)} />
                                : null
                        }
                        {
                            this.props.formatter(this.props.data)
                        }
                    </LinkChip>
                </div>
                {
                    this.props.children ?
                        <div className={classnames(styles['branch'], { [styles['collapsed']]: this.state.collapsed, [styles['expanded']]: !this.state.collapsed })}>
                            {
                                this.props.children
                            }
                        </div>
                        : null
                }
            </div>
        )
    }
}