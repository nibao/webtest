import * as React from 'react';
import TreeBase from './ui.base';
import TreeNode from '../Tree.Node/ui.mobile';
import * as styles from './styles.mobile.css';

export default class Tree extends TreeBase {
    static Node = TreeNode;

    render() {
        return (
            <div className={styles['root']}>
                {
                    this.extendsChildren(this.props.children)
                }
            </div>
        )
    }
}