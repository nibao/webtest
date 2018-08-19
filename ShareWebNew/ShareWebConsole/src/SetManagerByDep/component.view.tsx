import * as React from 'react';
import { decimal } from '../../util/validators/validators';
import { getErrorMessage } from '../../core/exception/exception';
import { Dialog2 as Dialog, FlexBox, ComboArea, Button, Panel, ValidateBox, CheckBoxOption, ProgressCircle, MessageDialog } from '../../ui/ui.desktop';
import SetManagerByDepBase from './component.base';
import SearchDep from '../SearchDep/component.desktop';
import { NodeType } from '../OrganizationTree/helper';
import OrganizationTree from '../OrganizationTree/component';
import __ from './locale';
import * as styles from './styles.view.css';

export default class SetManagerByDep extends SetManagerByDepBase {
    render() {
        return (
            <div>
                {
                    this.state.isConfigManager ?
                        (
                            <Dialog
                                title={__('设置组织管理员')}
                                onClose={this.props.onCancel}
                            >
                                <Panel>
                                    <Panel.Main>
                                        <FlexBox>
                                            <FlexBox.Item align="left top">
                                                <div className={styles['dep-box']}>
                                                    <ComboArea
                                                        minHeight={80}
                                                        width={380}
                                                        uneditable={true}
                                                        value={this.state.managers}
                                                        formatter={this.userDataFormatter}
                                                        onChange={data => { this.deleteManager(data) }}
                                                    />
                                                </div>
                                            </FlexBox.Item>
                                            <FlexBox.Item align="right top">
                                                <div className={styles['dep-btn']}>
                                                    <Button onClick={this.openAddManager}>
                                                        {__('添加')}
                                                    </Button>
                                                </div>
                                            </FlexBox.Item>
                                        </FlexBox>
                                    </Panel.Main>
                                    <Panel.Footer>
                                        <Panel.Button
                                            onClick={this.onConfirmManager} >
                                            {
                                                __('确定')
                                            }
                                        </Panel.Button>
                                        <Panel.Button
                                            onClick={this.props.onCancel}
                                        >
                                            {
                                                __('取消')
                                            }
                                        </Panel.Button>
                                    </Panel.Footer>
                                </Panel>

                            </Dialog>
                        ) :
                        null
                }

                {
                    this.state.isAddingManager ?
                        (
                            <Dialog
                                title={__('添加组织管理员')}
                                onClose={this.cancelAddManager}
                            >
                                <Panel>
                                    <Panel.Main>
                                        <FlexBox>
                                            <FlexBox.Item>
                                                <div>
                                                    <div className={styles['search-box']}>
                                                        <SearchDep
                                                            onSelectDep={this.selectUser}
                                                            selectType={[NodeType.USER]}
                                                            userid={this.props.userid}
                                                            width="222"
                                                        />
                                                    </div>
                                                    <div className={styles['organization-tree']}>
                                                        <OrganizationTree
                                                            userid={this.props.userid}
                                                            selectType={[NodeType.USER]}
                                                            onSelectionChange={this.selectUser}
                                                        />
                                                    </div>
                                                </div>
                                            </FlexBox.Item>
                                            <FlexBox.Item align="left top">
                                                <div>
                                                    <div className={styles['add-manager-selected']}>
                                                        <span>
                                                            {
                                                                __('已选：')
                                                            }
                                                        </span>
                                                        <span>
                                                            {
                                                                this.state.currentUser && this.state.currentUser.user ?
                                                                    this.state.currentUser.user.displayName :
                                                                    ''
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className={styles['add-manager-selected']}>
                                                        <CheckBoxOption
                                                            value={this.state.isLimitUserSpace}
                                                            checked={this.state.isLimitUserSpace}
                                                            onChange={this.changeUserSpaceStatus}
                                                            disabled={!this.state.currentUser}
                                                        >
                                                            {
                                                                __('限制其用户管理最大可分配空间为：')
                                                            }
                                                        </CheckBoxOption>
                                                    </div>
                                                    <div className={styles['add-manager-space']}>
                                                        <ValidateBox
                                                            validateState={this.state.limitUserSpaceEmpty}
                                                            validateMessages={{ [true]: __('此输入项不能为空。') }}
                                                            value={this.state.limitUserSpace}
                                                            disabled={!this.state.isLimitUserSpace}
                                                            validator={decimal}
                                                            onChange={this.changeUserSpace}
                                                        />
                                                        <span>
                                                            GB
                                                        </span>
                                                    </div>
                                                    <div className={styles['add-manager-selected']}>
                                                        <CheckBoxOption
                                                            value={this.state.isLimitDocSpace}
                                                            checked={this.state.isLimitDocSpace}
                                                            onChange={this.changeDocSpaceStatus}
                                                            disabled={!this.state.currentUser}
                                                        >
                                                            {
                                                                __('限制其文档管理最大可分配空间为：')
                                                            }
                                                        </CheckBoxOption>
                                                    </div>
                                                    <div className={styles['add-manager-space']}>
                                                        <ValidateBox
                                                            validateState={this.state.limitDocSpaceEmpty}
                                                            validateMessages={{ [true]: __('此输入项不能为空。') }}
                                                            value={this.state.limitDocSpace}
                                                            disabled={!this.state.isLimitDocSpace}
                                                            validator={decimal}
                                                            onChange={this.changeDocSpace}
                                                        />
                                                        <span>
                                                            GB
                                                        </span>
                                                    </div>
                                                </div>
                                            </FlexBox.Item>
                                        </FlexBox>


                                    </Panel.Main>

                                    <Panel.Footer>
                                        <Panel.Button
                                            onClick={this.onConfirmAddManager}
                                            disabled={!this.state.currentUser}
                                        >
                                            {
                                                __('确定')
                                            }
                                        </Panel.Button>
                                        <Panel.Button onClick={this.cancelAddManager}>
                                            {
                                                __('取消')
                                            }
                                        </Panel.Button>
                                    </Panel.Footer>
                                </Panel>
                            </Dialog>
                        ) :
                        null
                }

                {
                    this.state.isSetting ?
                        (<ProgressCircle detail={__('正在配置管组织理员...')} />) :
                        null
                }
                {
                    this.state.errorStatus && this.state.errorStatus.error && this.state.errorStatus.error.errID ?
                        (
                            <MessageDialog onConfirm={this.closeError}>
                                {
                                    getErrorMessage(this.state.errorStatus.error.errID)
                                }
                            </MessageDialog>
                        ) :
                        null
                }
            </div>
        )
    }

}