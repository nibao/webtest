import * as React from 'react';
import * as classnames from 'classnames'
import { noop } from 'lodash';
import '../../../assets/fonts/font.css';
import Tree from '../../ui/Tree/ui.desktop';
import TreeNode from '../../ui/Tree.Node/ui.desktop';
import FontIcon from '../../ui/FontIcon/ui.desktop';
import { NodeTypes } from './helper';
import * as styles from './styles.desktop.css';
import * as groupImg from './assets/images/group.png';
import * as userImg from './assets/images/user.png';
import ConcactBase from './component.base';

const icons = {
    [NodeTypes.USER]: {
        code: '\uf007',
        fallback: userImg
    },
    [NodeTypes.GROUP]: {
        code: '\uf008',
        fallback: groupImg
    },
}

const ConcactTreeNode = ({data, formatter, onSelect, loader}) => {
    return (
        <TreeNode data={data} formatter={formatter} loader={loader} _onSelect={onSelect}>
            {
                data.userinfos ? data.userinfos.map((info, key) => (
                    <TreeNode data={info} isLeaf={true} formatter={formatter} _onSelect={onSelect} key={info.userid} />
                ))
                    : []

            }
        </TreeNode>
    )
}

function formatter(data) {
    return (
        <div className={styles['formatter']} title={data.groupname ? data.groupname : data.name}>
            <label>
                <FontIcon font="AnyShare"
                    code={icons[data.id ? NodeTypes.GROUP : NodeTypes.USER].code}
                    fallback={icons[data.id ? NodeTypes.GROUP : NodeTypes.USER].fallback}
                    size="16px"
                    />
                <span className={styles['text']}>
                    {data.groupname ? data.groupname : data.name}
                </span>
            </label>
        </div>
    )
}



export default class Concact extends ConcactBase {

    render() {
        return (
            <div>
                <Tree>
                    {
                        this.state.groups.map((data, key) => (
                            <ConcactTreeNode formatter={formatter} data={data} loader={this.getUserInfos.bind(this)} key={data.id} onSelect={this.handleSelect.bind(this)} />
                        ))
                    }

                </Tree>
            </div>
        )
    }

}