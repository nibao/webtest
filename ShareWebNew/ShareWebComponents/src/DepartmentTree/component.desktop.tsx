import * as React from 'react';
import * as classnames from 'classnames';
import '../../../assets/fonts/font.css';
import FontIcon from '../../ui/FontIcon/ui.desktop';
import Tree from '../../ui/Tree/ui.desktop';
import TreeNode from '../../ui/Tree.Node/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import DepatrmentTreeBase from './component.base';
import { NodeTypes } from './helper';
import * as styles from './styles.desktop.css';
import * as rootDepImg from './assets/images/rootDepImg.png';
import * as subDepImg from './assets/images/subDepImg.png';
import * as subUserImg from './assets/images/subUserImg.png';

/**
 * department图标
 */
const icons = {
    [NodeTypes.SUBUSER]: {
        code: '\uf007',
        fallback: subUserImg
    },
    [NodeTypes.SUBDEP]: {
        code: '\uf009',
        fallback: subDepImg
    },
    [NodeTypes.ROOTDEP]: {
        code: '\uf008',
        fallback: rootDepImg
    }
}

const DepartmentTreeNode = ({ data, loader, onSelect, formatter }) => {

    return (
        <TreeNode data={data} loader={loader} _onSelect={onSelect}
            formatter={formatter}>
            {
                (data.userinfos
                    ? data.userinfos.map((info, key) => (
                        <TreeNode data={info} isLeaf={true} _onSelect={onSelect} formatter={formatter} key={info.userid} />
                    ))
                    : []).concat(
                    data.depinfos
                        ? data.depinfos.map((info, key) => (
                            <DepartmentTreeNode data={info} loader={loader} key={info.depid} onSelect={onSelect} formatter={formatter} />
                        ))
                        : []
                    )
            }
        </TreeNode>
    )

}

function formatter(data) {
    return (
        <div className={styles['formatter']} >
            <label>
                <FontIcon font="AnyShare"
                    code={icons[data.nodeType].code}
                    fallback={icons[data.nodeType].fallback}
                    size="16px"
                    disabled={!(data.isconfigable || data.nodeType === NodeTypes.SUBUSER)} />
                <span className={classnames(styles['text'], data.isconfigable || data.nodeType === NodeTypes.SUBUSER ? styles['enabled'] : styles['disabled'])}>
                    <Text className={styles['title']}>
                        {data.name}
                    </Text>
                </span>
            </label>
        </div>
    )
}

export default class DepartmentTree extends DepatrmentTreeBase {
    render() {
        let { treeData } = this.state;
        return (
            <Tree>
                {
                    treeData.depinfos.map((data, key) => (
                        <DepartmentTreeNode data={data} loader={this.loader.bind(this)} key={data.depid}
                            formatter={formatter}
                            onSelect={this.handleSelect.bind(this)} />
                    ))
                }
            </Tree>
        )
    }

}

