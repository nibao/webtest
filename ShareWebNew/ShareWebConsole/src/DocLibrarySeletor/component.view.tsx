import * as React from 'react';
import * as classnames from 'classnames';
import DocLibrarySeletorBase from './component.base';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Tabs from '../../ui/Tabs/ui.desktop';
import CustomDocTree from '../CustomDocTree/component.view';
import { NodeType } from '../CustomDocTree/component.base';
import ArchiveDocTree from '../ArchiveDocTree/component.view';
import __ from './locale';
import * as styles from './styles.view.css';

export default class DocLibrarySeletor extends DocLibrarySeletorBase {
    render() {
        return (
            <Dialog
                title={__('浏览')}
                onClose={this.handleCancel.bind(this)}
            >
                <Panel>
                    <Panel.Main>
                        <div className={styles['container']}>
                            <div className={classnames(styles['doclib-wrapper'])}>
                                <Tabs>
                                    <Tabs.Navigator>
                                        <Tabs.Tab active={true}>
                                            {__('文档库')}
                                        </Tabs.Tab>
                                        <Tabs.Tab>
                                            {__('归档库')}
                                        </Tabs.Tab>
                                    </Tabs.Navigator>
                                    <Tabs.Main>
                                        <Tabs.Content>
                                            <div className={styles['doclibs']}>
                                                <CustomDocTree
                                                    userid={this.props.userid}
                                                    selectType={[NodeType.DOCLIBRARY, NodeType.FOLDER]}
                                                    isSearch={true}
                                                    onSelectionChange={docLib => { this.handleSelectDoc(docLib) }}
                                                />
                                            </div>
                                        </Tabs.Content>
                                        <Tabs.Content>
                                            <div className={styles['doclibs']}>
                                                <ArchiveDocTree
                                                    userid={this.props.userid}
                                                    selectType={[NodeType.DOCLIBRARY, NodeType.FOLDER]}
                                                    isSearch={true}
                                                    onSelectionChange={docLib => { this.handleSelectDoc(docLib) }}
                                                />
                                            </div>
                                        </Tabs.Content>
                                    </Tabs.Main>
                                </Tabs>
                            </div>
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button disabled={this.state.selected.length === 0} onClick={this.handleConfirm.bind(this)}>{__('确定')}</Panel.Button>
                        <Panel.Button onClick={this.handleCancel.bind(this)}>{__('取消')}</Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog >
        )
    }
}