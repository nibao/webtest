import * as React from 'react';
import { noop } from 'lodash'
import { PureComponent } from '../../ui/decorators';
import { setShareAllowPerm, unsetShareAllowPerm, setShareDenyPerm, unsetShareDenyPerm, ShareType } from '../../core/permission/permission';

@PureComponent
export default class AdvancedPermissionsBase extends React.Component<Components.AdvancedPermissions.Props, Components.AdvancedPermissions.State> {
    static defaultProps = {
        showDeny: false,
        allowOwner: false,
        disabledOptions: 0,
        allow: 0,
        deny: 0,
        isowner: false,
        allowPerms: 0,
        onChange: noop
    }

    state = {
        isowner: this.props.isowner,
        allow: this.props.allow,
        deny: this.props.deny
    }

    componentWillReceiveProps({ isowner, allow, deny }) {
        this.setState({
            isowner,
            allow,
            deny
        })
    }

    /**
     * 权限发生变化
     * @param type ShareType.OWNER, ShareType.ALLOW, ShareType.DENY
     * @param checked 是否勾选
     * @param permission 发生变化的权限值
     */
    handleChange({ type, checked, permission }: { type: number, checked: boolean, permission: number }) {
        const { isowner, allow, deny } = this.state;
        let perm;

        switch (type) {
            case ShareType.OWNER: {
                perm = {
                    isowner: checked,
                    allow: 0,
                    deny: 0
                }
                break;
            }
            case ShareType.ALLOW: {
                // 允许权限值
                perm = checked ? setShareAllowPerm({ isowner: false, allow, deny }, permission) : unsetShareAllowPerm({ isowner, allow, deny }, permission)
                break;
            }
            case ShareType.DENY: {
                // 拒绝权限
                perm = checked ? setShareDenyPerm({ isowner: false, allow, deny }, permission) : unsetShareDenyPerm({ isowner, allow, deny }, permission)
            }
        }

        this.setState({
            isowner: perm.isowner,
            allow: perm.allow,
            deny: perm.deny
        })

        this.props.onChange(perm);
    }

}