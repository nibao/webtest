import * as React from 'react';
import * as classnames from 'classnames';
import { docname } from '../../core/docs/docs';
import { isTopView } from '../../core/entrydoc/entrydoc';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import Tree from '../../ui/Tree/ui.desktop';
import TreeNode from '../../ui/Tree.Node/ui.desktop';
import { getIcon } from '../helper';
import ShareCenterBase from './component.base';
import CenterCondition from './CenterCondition/component.desktop';
import * as styles from './styles.desktop.css';
import * as loading from './assets/loading.gif'

export default class ShareCenter extends ShareCenterBase {

    render() {

        const { isLoading, phase, currentPhase, subject, currentSubject, edition, currentEdition, book, currentBook, unit, type, currentType,currentBookIndex } = this.state;
        return (
            <div className={classnames(styles['share-center-container'])}>
                {
                    isLoading ?
                        <div className={styles['loading']}>
                            <FlexBox>
                                <FlexBox.Item align={'center middle'}>
                                    <div className={styles['loading-box']} >
                                        <Icon url={loading} />
                                        <div className={styles['loading-message']}>{'正在加载，请稍候......'}</div>
                                    </div>
                                </FlexBox.Item>
                            </FlexBox>
                        </div> : null

                }
                <ul className={classnames(styles['share-center-condition'])} >
                    <CenterCondition
                        name={'学段'}
                        items={phase}
                        currentItem={currentPhase}
                        handleClick={this.handleClickPhase.bind(this)}
                    />
                    <CenterCondition
                        name={'课程'}
                        items={subject}
                        currentItem={currentSubject}
                        handleClick={this.handleClickSubject.bind(this)}
                    />
                    <CenterCondition
                        name={'版本'}
                        items={edition}
                        currentItem={currentEdition}
                        handleClick={this.handleClickEdition.bind(this)}
                    />
                    <CenterCondition
                        name={'教材'}
                        items={book}
                        currentItem={currentBook}
                        handleClick={this.handleClickBook.bind(this)}
                        currentBookIndex={currentBookIndex}
                    />
                </ul>
                <div className={classnames(styles['unit-container'])}>
                    <div className={classnames(styles['unit-title'])}>{'目录'}:</div>
                    <div className={classnames(styles['share-center-item'])}>
                        {
                            this.renderBookUnitTree(unit)
                        }
                    </div>
                </div>

                <div className={classnames(styles['type-container'])}>
                    {'类型'}:
                    <select
                        name="selectedType"
                        id="selectedType"
                        defaultValue={currentType}
                        onChange={this.handleTypeSelectionChange.bind(this)}
                        className={classnames(styles['type-selection'])}
                    >
                        {
                            type.map((entries) =>
                                <option
                                    value={entries['code']}

                                >
                                    {entries['name']}
                                </option>
                            )
                        }
                    </select>
                </div>
            </div >
        )
    }


    /**
     * 显示模板
     */
    formatter(doc) {
        return (
            <div className={classnames(styles['name-box'], { [styles['name-view-box']]: isTopView(doc) })} title={docname(doc)}>
                {getIcon(doc, { size: isTopView(doc) ? 32 : 24 })}
                <span className={styles['name']}>{docname(doc)}</span>
            </div>
        )
    }

    /**
     * 生成节点
     */
    nodesGenerator(nodes, parent) {
        nodes.map(node => {
            node['parent'] = parent;
        })

        return nodes.map(node => (
            <TreeNode
                checkbox={this.checkBoxVisible(node)}
                key={node.code}
                data={node}
                isLeaf={node.courses.length === 0}
                formatter={this.formatter}
                onExpand={() => { this.forceUpdate(); }}>
                {

                    node.courses.length !== 0 ? this.nodesGenerator(node.courses, node) : null
                }
            </TreeNode>
        ))
    }

    /**
     * 渲染教材目录树
     * @param unit 教材目录
     */
    renderBookUnitTree(unit) {
        let parent = null;
        return (
            <div className={styles['contianer']}>
                <Tree selectMode={this.props.selectMode} onSelectionChange={this.handleUnitSelectionChange.bind(this)}>
                    {
                        this.nodesGenerator(unit, parent)
                    }
                </Tree>
            </div>
        )
    }

}