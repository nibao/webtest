import * as React from 'react';
import { buildSelectionText, SharePermissionOptions } from '../../core/permission/permission';
import Button from '../../ui/Button/ui.desktop';
import Menu from '../../ui/Menu/ui.desktop';
import DropBox from '../../ui/DropBox/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import AdvancedPermissionsConfig from '../AdvancedPermissions.Config/component.desktop';
import PermissionSelectBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop';

export default class PermissionSelect extends PermissionSelectBase {
    render() {
        const { allow, deny, isowner, permissionOptions } = this.state;
        const { showDeny, accessorName, allowOwner, disabledOptions, allowPerms } = this.props;

        return (
            <div>
                {
                    permissionOptions ? (
                        <DropBox
                            active={this.state.active}
                            value={this.state.allow}
                            formatter={(_value) => buildSelectionText(SharePermissionOptions, { isowner, allow, deny }, this.maxPerm)}
                            width={this.props.width}
                            >
                            <Menu width={280}>
                                {
                                    permissionOptions.map(permission => (
                                        <Select.Option value={permission} onSelect={this.handleSelect.bind(this)} selected={permission.allow === allow && permission.deny === deny && permission.isowner === isowner}>
                                            {
                                                <Text>
                                                    {
                                                        buildSelectionText(SharePermissionOptions, permission, this.maxPerm)
                                                    }
                                                </Text>
                                            }
                                        </Select.Option>
                                    ))
                                }
                                <div className={styles['more']}>
                                    <Button onMouseDown={this.openAdvancedPermission.bind(this)} >
                                        {__('高级配置')}
                                    </Button>
                                </div>
                            </Menu>
                        </DropBox>
                    ) : null
                }
                {
                    this.state.editingAdvancedPermission ? (
                        <AdvancedPermissionsConfig
                            allow={allow}
                            deny={deny}
                            isowner={isowner}
                            showDeny={showDeny}
                            accessorName={accessorName}
                            allowOwner={allowOwner}
                            disabledOptions={disabledOptions}
                            onChange={this.updatePerm.bind(this)}
                            onCancel={this.closeAdvancedPermissions.bind(this)}
                            allowPerms={allowPerms}
                            />
                    ) : null
                }
            </div>
        )
    }
}
