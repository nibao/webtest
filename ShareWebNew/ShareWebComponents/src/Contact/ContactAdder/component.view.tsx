import * as React from 'react';
import { noop } from 'lodash';
import * as classnames from 'classnames';
import '../../../assets/fonts/font.css';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Title from '../../../ui/Title/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';
import LinkButton from '../../../ui/LinkButton/ui.desktop';
import DataGrid from '../../../ui/DataGrid/ui.desktop';
import { decorateText } from '../../../util/formatters/formatters';
import DepartmentSearcher from '../../DepartmentSearcher/component.desktop';
import DepartmentTree from '../../DepartmentTree/component.desktop';
import __ from './locale';
import * as styles from './styles.desktop.css';


const ContactAdderView: React.StatelessComponent<Components.Contact.ContactAdder.Props> = function ContactAdderView({
    candidates,
    onAddContactCancel = noop,
    clearCandidates = noop,
    removeCandidate = noop,
    submitCandidates = noop,
    handleAddCandidate = noop,

}) {

    return (
        <Panel>
            <Panel.Main>
                <div className={styles['layout']}>
                    <div className={classnames(styles['atom'], styles['atom-left'])}>
                        <div className={styles['padding']}>
                            <div className={styles['atom-title']}>
                                {__('从下面左侧“部门列表” 中选择对象，添加至右侧列表。')}
                            </div>
                            <div className={classnames(styles['border-style'])}>
                                <DepartmentSearcher
                                    width={220}
                                    onSelect={handleAddCandidate}
                                />
                                <div className={styles['department-tree']}>
                                    <DepartmentTree onSelect={handleAddCandidate} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classnames(styles['atom'], styles['atom-right'])}>
                        <div className={styles['padding']}>
                            <div className={styles['atom-title']}>
                                <LinkButton
                                    onClick={clearCandidates}
                                    className={styles['atom-title-action']}
                                    disabled={candidates.length === 0}
                                >
                                    {__('清空')}
                                </LinkButton>

                            </div>
                            <div className={classnames(styles['atom-content'])}>

                                <DataGrid
                                    className={styles['list-body']}
                                    data={candidates}
                                    select={true}
                                >
                                    <DataGrid.Field
                                        label={__('显示名')}
                                        field="name"
                                        width="70"
                                        formatter={(name, candidate) => (
                                            <span className={styles['list-body-name']}>
                                                <Title
                                                    content={candidate.name}
                                                >
                                                    {decorateText(candidate.name, { limit: 20 })}


                                                </Title>
                                            </span>
                                        )}
                                    />

                                    <DataGrid.Field
                                        label={__('操作')}
                                        field="operation"
                                        width="30"
                                        formatter={(operation, candidate) => (
                                            <span className={styles['list-body-operation']}>
                                                <UIIcon
                                                    className={styles['clear-flag']}
                                                    code={'\uf014'}
                                                    size={'13px'}
                                                    onClick={() => removeCandidate(candidate)}
                                                />
                                            </span>
                                        )}
                                    />

                                </DataGrid>

                            </div>
                        </div>
                    </div>
                </div>
            </Panel.Main>
            <Panel.Footer>
                <Panel.Button
                    disabled={!(candidates && candidates.length)}
                    type="submit"
                    onClick={submitCandidates}
                >
                    {__('确定')}
                </Panel.Button>
                <Panel.Button
                    onClick={onAddContactCancel}
                >
                    {__('取消')}
                </Panel.Button>
            </Panel.Footer>
        </Panel>

    )
}



export default ContactAdderView;