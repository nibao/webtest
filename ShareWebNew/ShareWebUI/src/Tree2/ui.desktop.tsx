import * as React from 'react'
import UIIcon from '../UIIcon/ui.desktop';
import TreeBase, { NodeStatus, SelectStatus, SelectType } from './ui.base'
import * as classnames from 'classnames'
import * as styles from './styles.desktop.css'

export default class Tree extends TreeBase {

    static defaultProps = {
        data: [],
        indent: 10,
        selectType: SelectType.UNRESTRICTED,

        ExpandedIcon: <span className={styles['switch-icon']}><UIIcon code="\uf04c" size={18} /></span>,
        ExpandingIcon: <span className={styles['switch-icon']}><UIIcon code="\uf04e" size={18} /></span>,
        UnexpandedIcon: <span className={styles['switch-icon']}><UIIcon code="\uf04e" size={18} /></span>,
        LeafIcon: <span className={styles['switch-icon']}>{' '}</span>,

        getNodeChildren: () => null,
        renderNode: () => null,
    }

    /**
    * 渲染树
    * @param nodeId 
    */
    private renderTreeNode(nodeId = '') {
        const dataGroup = this.treeData[nodeId]
        if (dataGroup && dataGroup.length) {
            const {
                checkbox,
                renderNode,
                indent,
                isLeaf,
                ExpandedIcon,
                ExpandingIcon,
                UnexpandedIcon,
                LeafIcon
            } = this.props
            const { nodeStatus, selectStatus } = this.state
            const ids = nodeId.split('.')
            const depth = ids.length - 1
            return (
                <ul className={classnames(styles['tree'], { [styles['expand']]: nodeStatus[nodeId] === NodeStatus.EXPANDED })}>
                    {
                        dataGroup.map((data, index, group) => {
                            const showCheckBox = typeof checkbox === 'function' ? checkbox(data, index, group) : checkbox
                            const currentNodeId = `${nodeId}.${index}`
                            const status = nodeStatus[currentNodeId]
                            let SwitchIcon = null
                            if (isLeaf(data, index, group)) {
                                SwitchIcon = LeafIcon
                            } else {
                                switch (status) {
                                    case NodeStatus.EXPANDED:
                                        SwitchIcon = ExpandedIcon
                                        break
                                    case NodeStatus.EXPANDING:
                                        SwitchIcon = ExpandingIcon
                                        break
                                    default:
                                        SwitchIcon = UnexpandedIcon
                                        break
                                }
                            }
                            return (
                                <li className={styles['node']} key={currentNodeId}>
                                    <div style={{ paddingLeft: indent * depth }}>
                                        <div
                                            className={styles['switch']}
                                            onClick={() => this.toggleExpand(currentNodeId)}
                                        >
                                            {SwitchIcon}
                                        </div>
                                        {
                                            showCheckBox ?
                                                <input
                                                    type="checkbox"
                                                    ref={ref => ref && (ref.indeterminate = selectStatus[currentNodeId] === SelectStatus.HALF)}
                                                    checked={selectStatus[currentNodeId] === SelectStatus.TRUE || selectStatus[currentNodeId] === SelectStatus.HALF}
                                                    onClick={() => this.toggleSelect(currentNodeId)}
                                                />
                                                : null
                                        }
                                        {
                                            renderNode(data, index, group)
                                        }
                                    </div>
                                    {
                                        this.renderTreeNode(currentNodeId)
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            )
        }
        return null
    }

    render() {
        return this.renderTreeNode()
    }
}