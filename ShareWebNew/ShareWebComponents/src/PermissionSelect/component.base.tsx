import * as React from 'react';
import { find, noop } from 'lodash';
import { SharePermission, SharePermissionOptions } from '../../core/permission/permission';
import { bitSub, bitSum, bitTest } from '../../util/accessor/accessor'
import { PureComponent } from '../../ui/decorators';
import __ from './locale';

const PermissionOptions = [
    {
        // 显示
        isowner: false,
        allow: SharePermission.DISPLAY,
        deny: 0
    },
    {
        // 显示/新建
        isowner: false,
        allow: bitSum(SharePermission.DISPLAY + SharePermission.CREATE),
        deny: 0
    },
    {
        // 显示/预览
        isowner: false,
        allow: bitSum(SharePermission.DISPLAY + SharePermission.PREVIEW),
        deny: 0
    },
    {
        // 显示/预览/下载
        isowner: false,
        allow: bitSum(SharePermission.DISPLAY + SharePermission.PREVIEW + SharePermission.DOWNLOAD),
        deny: 0
    },
    {
        // 显示/预览/下载/复制
        isowner: false,
        allow: bitSum(SharePermission.DISPLAY + SharePermission.PREVIEW + SharePermission.DOWNLOAD + SharePermission.COPY),
        deny: 0
    },
    {
        // 显示/预览/下载/修改/新建
        isowner: false,
        allow: bitSum(SharePermission.DISPLAY + SharePermission.PREVIEW + SharePermission.DOWNLOAD + SharePermission.MODIFY + SharePermission.CREATE),
        deny: 0
    },
    {
        // 显示/预览/下载/复制/修改/新建
        isowner: false,
        allow: bitSum(SharePermission.DISPLAY + SharePermission.PREVIEW + SharePermission.DOWNLOAD + SharePermission.COPY + SharePermission.MODIFY + SharePermission.CREATE),
        deny: 0
    },
    {
        // 显示/预览/下载/复制/修改/新建/删除
        isowner: false,
        allow: bitSum(SharePermission.DISPLAY + SharePermission.PREVIEW + SharePermission.DOWNLOAD + SharePermission.COPY + SharePermission.MODIFY + SharePermission.CREATE + SharePermission.DELETE),
        deny: 0
    },
    {
        // 拒绝访问
        isowner: false,
        allow: 0,
        deny: bitSum(SharePermission.DISPLAY + SharePermission.PREVIEW + SharePermission.DOWNLOAD + SharePermission.COPY + SharePermission.MODIFY + SharePermission.CREATE + SharePermission.DELETE),

    },
    {
        // 所有者'
        isowner: true,
        allow: 0,
        deny: 0
    }

]

interface Props {
    allow: number;            // 允许权限
    deny: number;             // 拒绝权限
    isowner: boolean;         // 是否勾选所有者
    showDeny: boolean;        // 是否显示拒绝权限
    allowOwner: number;       // 是否显示所有者权限
    allowPerms: number;       // 允许显示的权限
    disabledOptions: number;  // 禁止显示的权限
    accessorName: string;     // 访问者名字
    editingkey: string;       // key
    onChange(key: string, perm: Core.Permission.Perm): void;   // 权限发生变化
}

interface State {
    allow: number,
    deny: number,
    isowner: boolean,
    active: boolean;
    editingAdvancedPermission: boolean;
    permissionOptions: Array<Core.Permission.Perm>;   // 下拉权限的组合
}


@PureComponent
export default class PermissionSelectBase extends React.Component<any, any> {
    static defaultProps: Props = {
        allow: 0,
        deny: 0,
        isowner: false,
        showDeny: false,
        allowPerms: 0,
        allowOwner: 0,
        disabledOptions: 0,
        accessorName: '',
        editingkey: '',
        onChange: noop,
    }

    state: State = {
        editingAdvancedPermission: false,
        active: false,
        allow: this.props.allow,
        deny: this.props.deny,
        isowner: this.props.isowner,
        permissionOptions: null
    }

    maxPerm: number = 0;    // 最大权限值

    nwWindow: UI.NWWindow.NWWindow;

    componentWillMount() {
        this.initPerm();
    }

    componentWillReceiveProps({allow, deny, isowner, showDeny, allowPerms, disabledOptions, allowOwner}) {
        this.initPerm({ showDeny, allowPerms, disabledOptions, allowOwner });
        this.setState({
            allow,
            deny,
            isowner
        })
    }

    /**
     * 初始化下拉权限
     */
    initPerm({showDeny, allowPerms, disabledOptions, allowOwner} = this.props): void {
        this.maxPerm = bitSub(allowPerms, disabledOptions);
        let hidePerms = SharePermissionOptions.reduce((prev, permission) => {
            if (!bitTest(this.maxPerm, permission.value)) {
                return bitSum(prev, permission.value)
            }
            return prev
        }, 0)

        let permissionOptions = PermissionOptions.reduce((prev, permission) => {
            if (!permission.allow) {
                if (showDeny) {
                    if (permission.deny) {
                        // 显示“拒绝访问”
                        return [...prev, { allow: 0, deny: this.maxPerm, isowner: false }]
                    }
                    if (allowOwner) {
                        // 显示“所有者”
                        return [...prev, { allow: 0, deny: 0, isowner: true }]
                    }
                    return prev;
                }
                // showDeny为false，不显示“拒绝访问”和“所有者”
                return prev;
            }
            // 除了拒绝访问和所有者之外的
            let allow = bitSub(permission.allow, hidePerms);
            if (!prev.find((perm) => perm.allow === allow)) {
                return [...prev, { allow, isowner: false, deny: 0 }]
            }
            return prev
        }, [])

        this.setState({
            permissionOptions
        })
    }

    /**
     * 选择下拉权限
     */
    handleSelect({value}: { value: Core.Permission.Perm }): void {
        this.setState({
            active: false,
        })
        this.set(this.props.editingkey, value);
    }

    /**
     * 设置权限值
     */
    set(key: string, {isowner, allow, deny}: Core.Permission.Perm): void {
        this.props.onChange(key, { isowner, allow, deny });
        this.setState({
            isowner,
            allow,
            deny
        })
    }

    /**
     * 切换高级权限弹窗状态
     */
    switchAdvancedPermission(status: boolean): void {
        this.setState({
            editingAdvancedPermission: status,
            active: false
        })
    }

    /**
     * 打开高级权限
     */
    openAdvancedPermission(): void {
        this.switchAdvancedPermission(true)
    }

    /**
     * 关闭高级权限弹窗
     */
    closeAdvancedPermissions(): void {
        this.setState({
            editingAdvancedPermission: false,
        });
    }

    /**
     * 更新权限值
     */
    updatePerm(perm: Core.Permission.Perm): void {
        this.set(this.props.editingkey, perm);
    }

}
