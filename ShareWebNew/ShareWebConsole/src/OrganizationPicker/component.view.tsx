import * as React from 'react';
import * as classnames from 'classnames';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import OrgManager from '../OrgManager/component.desktop';
import SearchDep from '../SearchDep/component.desktop';
import Button from '../../ui/Button/ui.desktop';
import OrganizationTree from '../OrganizationTree/component';
import OrganizationPickBase from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';
import * as deleteIcon from './assets/delete.png'

export default class OrganizationPick extends OrganizationPickBase {
    render() {
        return (
            <div className={styles['container']}>
                <Dialog
                    title={this.props.title}
                    width={504}
                    onClose={this.cancelAddDep.bind(this)}
                    >
                    <Panel>
                        <Panel.Main>
                            <div>
                                <FlexBox>
                                    <FlexBox.Item align="left middle">
                                        <div className={styles['search-box']}>
                                            <SearchDep onSelectDep={value => { this.selectDep(value) } } userid={this.props.userid} width="100%" selectType={this.props.selectType} />
                                        </div>
                                        <div className={styles['organization-tree']}>
                                            <OrganizationTree userid={this.props.userid} selectType={this.props.selectType} onSelectionChange={value => { this.selectDep(value) } } />
                                        </div>
                                    </FlexBox.Item>
                                    <FlexBox.Item align="right middle">
                                        <div className={styles['search-box']}>
                                            <FlexBox>
                                                <FlexBox.Item align="left middle">
                                                    <label>
                                                        {__('已选：')}
                                                    </label>
                                                </FlexBox.Item>
                                                <FlexBox.Item align="right middle">
                                                    <div>
                                                        <Button onClick={this.clearSelectDep.bind(this)} disabled={!this.state.data.length}>
                                                            {__('清空')}
                                                        </Button>
                                                    </div>
                                                </FlexBox.Item>
                                            </FlexBox>
                                        </div>
                                        <div className={styles['organization-tree']}>
                                            <ul>
                                                {
                                                    this.state.data.map(sharer => (
                                                        <li style={{ position: 'relative' }} className={styles['dep-item']}>
                                                            <div className={styles['seleted-data']}>
                                                                <Text className={styles['dep-name']}>{sharer.name}</Text>
                                                            </div>
                                                            <div className={styles['selected-data-del']}>
                                                                <UIIcon size={13} code={'\uf014'} fallback={deleteIcon} onClick={() => { this.deleteSelectDep(sharer) } } />
                                                            </div>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </FlexBox.Item>

                                </FlexBox>
                            </div>
                        </Panel.Main>
                        <Panel.Footer>
                            <Panel.Button disabled={!this.state.data.length} onClick={() => { this.confirmAddDep() } }>{__('确定')}</Panel.Button>
                            <Panel.Button onClick={this.cancelAddDep.bind(this)}>{__('取消')}</Panel.Button>
                        </Panel.Footer>
                    </Panel>
                </Dialog>
            </div>
        )
    }
}