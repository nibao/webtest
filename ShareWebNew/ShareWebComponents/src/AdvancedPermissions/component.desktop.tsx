import * as React from 'react';
import * as classnames from 'classnames';
import { SharePermission, ShareType } from '../../core/permission/permission';
import { bitTest } from '../../util/accessor/accessor';
import Button from '../../ui/Button/ui.desktop';
import Menu from '../../ui/Menu/ui.desktop';
import DropBox from '../../ui/DropBox/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import CheckBox from '../../ui/CheckBox/ui.desktop';
import AdvancedPermissionsBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop';

export default class AdvancedPermissions extends AdvancedPermissionsBase {
    render() {
        const {isowner, allow, deny} = this.state;
        const { allowPerms, disabledOptions, showDeny, allowOwner } = this.props;
        return (
            <div className={styles['container']}>
                <table className={styles['block']} >
                    <colgroup>
                        <col width="150" />
                        <col width="150" />
                        {showDeny ? <col width="150" /> : null}
                    </colgroup>
                    <thead>
                        <tr>
                            <th className={styles['thread']}>{__('访问权限')}</th>
                            <th className={styles['thread']}>{__('允许')}</th>
                            {showDeny ? <th className={styles['thread']}>{__('拒绝')}</th> : null}

                        </tr>
                    </thead>
                    <tbody>
                        {
                            bitTest(allowPerms, SharePermission.DISPLAY)
                                ? <tr>
                                    <td>{__('显示')}</td>
                                    <td>
                                        <CheckBox value={SharePermission.DISPLAY}
                                            checked={bitTest(allow, SharePermission.DISPLAY)}
                                            onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW})}
                                        />
                                    </td>
                                    {
                                        showDeny
                                            ? <td>
                                                <CheckBox
                                                    value={SharePermission.DISPLAY}
                                                    checked={bitTest(deny, SharePermission.DISPLAY)}
                                                    onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY})}
                                                />
                                            </td>
                                            : null
                                    }
                                </tr>
                                : null
                        }
                        {
                            bitTest(allowPerms, SharePermission.PREVIEW)
                                ? <tr>
                                    <td>{__('预览')}</td>
                                    <td>
                                        <CheckBox
                                            value={SharePermission.PREVIEW}
                                            checked={bitTest(allow, SharePermission.PREVIEW)}
                                            onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                        />
                                    </td>
                                    {showDeny ?
                                        <td>
                                            <CheckBox
                                                value={SharePermission.PREVIEW}
                                                checked={bitTest(deny, SharePermission.PREVIEW)}
                                                onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                            />
                                        </td>
                                        : null}
                                </tr>
                                : null
                        }
                        {
                            bitTest(allowPerms, SharePermission.DOWNLOAD)
                                ? <tr>
                                    <td>{__('下载')}</td>
                                    <td>
                                        <CheckBox
                                            value={SharePermission.DOWNLOAD}
                                            checked={bitTest(allow, SharePermission.DOWNLOAD)}
                                            onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                        />
                                    </td>
                                    {showDeny ?
                                        <td>
                                            <CheckBox
                                                value={SharePermission.DOWNLOAD}
                                                checked={bitTest(deny, SharePermission.DOWNLOAD)}
                                                onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                            />
                                        </td>
                                        : null}
                                </tr>
                                : null
                        }
                        {
                            bitTest(allowPerms, SharePermission.COPY)
                                ? <tr>
                                    <td>{__('复制')}</td>
                                    <td>
                                        <CheckBox
                                            value={SharePermission.COPY}
                                            checked={bitTest(allow, SharePermission.COPY)}
                                            onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                        />
                                    </td>
                                    {showDeny ?
                                        <td>
                                            <CheckBox
                                                value={SharePermission.COPY}
                                                checked={bitTest(deny, SharePermission.COPY)}
                                                onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                            />
                                        </td>
                                        : null}
                                </tr>
                                : null
                        }
                        {
                            bitTest(allowPerms, SharePermission.CREATE)
                                ? <tr>
                                    <td>{__('新建')}</td>
                                    <td>
                                        <CheckBox
                                            value={SharePermission.CREATE}
                                            checked={bitTest(allow, SharePermission.CREATE)}
                                            onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                        />
                                    </td>
                                    {showDeny ?
                                        <td>
                                            <CheckBox
                                                value={SharePermission.CREATE}
                                                checked={bitTest(deny, SharePermission.CREATE)}
                                                onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                            />
                                        </td>
                                        : null}
                                </tr>
                                : null
                        }
                        {
                            bitTest(allowPerms, SharePermission.MODIFY) && !bitTest(disabledOptions, SharePermission.MODIFY)
                                ? <tr>
                                    <td>{__('修改')}</td>
                                    <td>
                                        <CheckBox
                                            value={SharePermission.MODIFY}
                                            checked={bitTest(allow, SharePermission.MODIFY)}
                                            onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                        />
                                    </td>
                                    {showDeny ?
                                        <td>
                                            <CheckBox
                                                value={SharePermission.MODIFY}
                                                checked={bitTest(deny, SharePermission.MODIFY)}
                                                onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                            />
                                        </td>
                                        : null}
                                </tr>
                                : null
                        }
                        {
                            bitTest(allowPerms, SharePermission.DELETE) && !bitTest(disabledOptions, SharePermission.DELETE)
                                ? <tr>
                                    <td>{__('删除')}</td>
                                    <td>
                                        <CheckBox
                                            value={SharePermission.DELETE}
                                            checked={bitTest(allow, SharePermission.DELETE)}
                                            onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                        />
                                    </td>
                                    {showDeny ?
                                        <td>
                                            <CheckBox
                                                value={SharePermission.DELETE}
                                                checked={bitTest(deny, SharePermission.DELETE)}
                                                onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                            />
                                        </td>
                                        : null}
                                </tr>
                                : null
                        }
                        {showDeny && allowOwner ?
                            <tr>
                                <td>{__('所有者')}</td>
                                <td>
                                    <CheckBox
                                        checked={isowner}
                                        onChange={(checked) => { this.handleChange({ type: ShareType.OWNER, checked, permission: null }) }}
                                    />
                                </td>
                                <td >
                                </td>
                            </tr>
                            :
                            null
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}
