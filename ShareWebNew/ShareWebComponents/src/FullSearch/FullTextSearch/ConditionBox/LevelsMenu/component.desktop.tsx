import * as React from 'react';
import * as ReactDOM from 'react-dom'
import * as classnames from 'classnames';
import Button from '../../../../../ui/Button/ui.desktop';
import PopMenu from '../../../../../ui/PopMenu/ui.desktop';
import PopMenuItem from '../../../../../ui/PopMenu.Item/ui.desktop';
import UIIcon from '../../../../../ui/UIIcon/ui.desktop';
import { decorateText } from '../../../../../util/formatters/formatters';
import LevelMenuBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';


export default class LevelMenu extends LevelMenuBase {

    render() {

        let { label, className } = this.props;
        let { titleNode, enablelevelMenu, candidateItems, clickStatus } = this.state;

        return (
            <div className={classnames(styles['level-menu'], className)} >
                <span className={styles['attr-title']}>{label}{__('：')}</span>

                <div
                    className={classnames(styles['level-button-container'])}
                    onClick={this.handleClickLevelMenuBtn.bind(this)}
                    onMouseLeave={this.handleLeaveMenuBtn.bind(this)}
                    ref="levelMenuBtn"
                >
                    <Button className={classnames(styles['level-menu-btn'], { [styles['clicked']]: clickStatus })}>
                        <div className={classnames(styles['button-box'])}>
                            <span
                                className={classnames(styles['button-text'])}
                                title={this.renderTitleNodePath(titleNode)}

                            >
                                {
                                    decorateText(this.renderTitleNodePath(titleNode), { limit: 20 })
                                }
                            </span>
                            <UIIcon
                                className={classnames(styles['expand-icon'])}
                                code={'\uF04C'}
                                size="16px"
                            >
                            </UIIcon>
                        </div>
                    </Button>
                </div>
                {

                    this.renderUnitLevelTree(candidateItems, candidateItems.anchor, enablelevelMenu, true)

                }


            </div >
        )
    }

    /**
     * 渲染层级目录标题
     */
    renderTitleNodePath(node) {
        // 遍历节点的父节点得到完整路径
        let path = [node.name];
        let parent = node['parent'];
        while (parent) {
            path.unshift(parent.name);
            parent = parent['parent'];
        }

        path.shift();
        return path.reduce((s, v) => {
            s = s + ' > ' + v;
            return s;
        }, '').slice(3)

    }

    /**
     * 渲染层级子目录树
     */
    renderUnitLevelTreeNode(node) {

        node.child.map(n =>
            n['parent'] = node
        )

        return node.child.map(n =>
            <PopMenuItem
                label={n.name}
                className={classnames(styles['condition-level-items'], { [styles['condition-level-items-expand']]: n.expand })}
                labelClassName={classnames({ [styles['label-selected']]: n.expand })}
                onMouseEnter={(e) => { this.handleExpandTreeNode(e, n) }}
                onMouseLeave={(e) => { this.handleCollapseTreeNode(e, n) }}
                onClick={() => { this.handleClickTreeNode(n) }}
                onDOMNodeMount={dom => { n.anchor = dom }}
            >
                {
                    this.renderUnitLevelTree(n, n.anchor, n.expand)
                }
                {
                    (n.expand && n.child.length !== 0) ?
                        <UIIcon
                            className={classnames(styles['expand-icon'])}
                            code={'\uF04E'}
                            size="14px"
                        >
                        </UIIcon>
                        :
                        null
                }
            </PopMenuItem >

        )


    }


    /**
     * 渲染层级目录树
     * @param node 目录
     */
    renderUnitLevelTree(node, anchor, enablelevelMenu, enableFirstLayer?) {
        return (
            <PopMenu
                /* onMouseEnter={(e) => { this.handleExpandTreePanel(e, node) }} */
                /* onMouseLeave={(e) => { this.handleCollapseTreePanel(e, node) }} */
                anchor={node.anchor}
                anchorOrigin={enableFirstLayer ? ['left', 'bottom'] : ['right', 'top']}
                targetOrigin={['left', 'top']}
                className={classnames(styles['condition-level-menu'])}
                open={node.child.length !== 0 && enablelevelMenu}
                watch={true}
                freezable={false}
                onRequestCloseWhenBlur={(close) => this.handleCloseLevelMenu(close)}

            >
                {
                    this.renderUnitLevelTreeNode(node)
                }
            </PopMenu>
        )
    }



}