import * as React from 'react';
import * as classnames from 'classnames';
import '../../../assets/fonts/font.css';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop'
import Tabs from '../../ui/Tabs/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import Dialog from '../../ui/Dialog2/ui.desktop'
import DepartmentSearcher from '../DepartmentSearcher/component.desktop';
import DepartmentTree from '../DepartmentTree/component.desktop';
import ConcactTree from '../ConcactTree/component.desktop';
import ConcatSearcher from '../ConcatSearcher/component.desktop';
import * as styles from './styles.desktop.css';
import VisitorAdderBase from './component.base';
import __ from './locale';

/**
 * 组织结构 联系人 tab
 */
const TreeTabs = ({ onAddCandidate }) => (
    <Tabs>
        <Tabs.Navigator>
            <Tabs.Tab active={true}>
                {__('组织结构')}
            </Tabs.Tab>
            <Tabs.Tab>
                {__('联系人')}
            </Tabs.Tab>
        </Tabs.Navigator>
        <Tabs.Main>
            <Tabs.Content>
                <div className={classnames(styles['border-style'])}>
                    <DepartmentSearcher width={221} onSelect={onAddCandidate} />
                    <div className={styles['department-tree']}>
                        <DepartmentTree onSelect={onAddCandidate} />
                    </div>
                    <div className={styles['permission-tip']}>{__('※灰化部分不在您的共享范围内')}</div>
                </div>
            </Tabs.Content>
            <Tabs.Content>
                <div className={classnames(styles['border-style'])}>
                    <ConcatSearcher width={221} onSelect={onAddCandidate} />
                    <div className={styles['contact-tree']}>
                        <ConcactTree onSelect={onAddCandidate} />
                    </div>
                </div>
            </Tabs.Content>
        </Tabs.Main>
    </Tabs>
)

export default class VisitorAdder extends VisitorAdderBase {
    render() {
        const { candidates} = this.state;

        return (
            <Dialog
                width={'600px'}
                title={__('添加访问者')}
                onClose={this.props.onCancel}
                >
                <Panel>
                    <Panel.Main>
                        <div className={styles['layout']}>
                            <div className={classnames(styles['atom'], styles['atom-left'])}>
                                <div className={styles['padding']}>
                                    <TreeTabs onAddCandidate={this.handleAddCandidate.bind(this)} />
                                </div>
                            </div>
                            <div className={classnames(styles['atom'], styles['atom-right'])}>
                                <div className={styles['padding']}>
                                    <div className={styles['atom-title']}>
                                        {__('已选访问者：')}
                                        <a href="javascript:void(0)" onClick={this.clearCandidates.bind(this)}>{__('全部清空')}</a>
                                    </div>
                                    <div className={classnames(styles['atom-content'], styles['border-style'])}>
                                        <table>
                                            <tbody>
                                                {
                                                    (candidates && candidates.length)
                                                        ? (candidates.map((candidate, index) => (
                                                            <tr key={candidate.userid ? candidate.userid : (candidate.depid ? candidate.depid : candidate.id)}>
                                                                <td>
                                                                    <Text className={styles['name']}>{candidate.name ? candidate.name : candidate.groupname}</Text>
                                                                </td>
                                                                <td className={styles['clear-flag']}>
                                                                    <UIIcon
                                                                        code={'\uf014'}
                                                                        size={'13px'}
                                                                        onClick={this.removeCandidate.bind(this, index)}
                                                                        />
                                                                </td>
                                                            </tr>
                                                        )))
                                                        : null
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button
                            disabled={!(candidates && candidates.length)}
                            type="submit"
                            onClick={this.submitCandidates.bind(this)}
                            >
                            {__('确定')}
                        </Panel.Button>
                        <Panel.Button
                            onClick={this.props.onCancel}
                            >
                            {__('取消')}
                        </Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog>
        )
    }
}