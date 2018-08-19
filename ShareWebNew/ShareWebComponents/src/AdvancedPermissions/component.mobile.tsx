import * as React from 'react'
import * as classnames from 'classnames'
import { SharePermission, ShareType } from '../../core/permission/permission';
import { bitTest } from '../../util/accessor/accessor';
import CheckBox from '../../ui/CheckBox/ui.mobile'
import AdvancedPermissionsBase from './component.base'
import * as styles from './styles.mobile.css'
import __ from './locale'

export default class AdvancedPermissions extends AdvancedPermissionsBase {
    render() {
        const { isowner, allow, deny } = this.state;
        const { allowPerms, disabledOptions, allowOwner } = this.props;

        return (
            <div>
                <div className={styles['line-area']}>
                    {__('访问权限')}
                </div>
                {
                    bitTest(allowPerms, SharePermission.DISPLAY) ?
                        <div className={classnames(styles['line-area'], styles['grey-back'])}>
                            <div className={styles['perm-label']}>
                                {__('显示')}
                            </div>
                            <div className={styles['perm-value']}>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.DISPLAY}
                                        checked={bitTest(allow, SharePermission.DISPLAY)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                    />
                                    {__('允许')}
                                </label>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.DISPLAY}
                                        checked={bitTest(deny, SharePermission.DISPLAY)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                    />
                                    {__('拒绝')}
                                </label>
                            </div>
                        </div>
                        : null
                }
                {
                    bitTest(allowPerms, SharePermission.PREVIEW) ?
                        <div className={classnames(styles['line-area'], styles['grey-back'])}>
                            <div className={styles['perm-label']}>
                                {__('预览')}
                            </div>
                            <div className={styles['perm-value']}>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.PREVIEW}
                                        checked={bitTest(allow, SharePermission.PREVIEW)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                    />
                                    {__('允许')}
                                </label>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.PREVIEW}
                                        checked={bitTest(deny, SharePermission.PREVIEW)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                    />
                                    {__('拒绝')}
                                </label>
                            </div>
                        </div>
                        : null
                }
                {
                    bitTest(allowPerms, SharePermission.DOWNLOAD) ?
                        <div className={classnames(styles['line-area'], styles['grey-back'])}>
                            <div className={styles['perm-label']}>
                                {__('下载')}
                            </div>
                            <div className={styles['perm-value']}>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.DOWNLOAD}
                                        checked={bitTest(allow, SharePermission.DOWNLOAD)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                    />
                                    {__('允许')}
                                </label>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.DOWNLOAD}
                                        checked={bitTest(deny, SharePermission.DOWNLOAD)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                    />
                                    {__('拒绝')}
                                </label>
                            </div>
                        </div>
                        : null
                }
                {
                    bitTest(allowPerms, SharePermission.COPY) ?
                        <div className={classnames(styles['line-area'], styles['grey-back'])}>
                            <div className={styles['perm-label']}>
                                {__('复制')}
                            </div>
                            <div className={styles['perm-value']}>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.COPY}
                                        checked={bitTest(allow, SharePermission.COPY)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                    />
                                    {__('允许')}
                                </label>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.COPY}
                                        checked={bitTest(deny, SharePermission.COPY)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                    />
                                    {__('拒绝')}
                                </label>
                            </div>
                        </div>
                        : null
                }
                {
                    bitTest(allowPerms, SharePermission.CREATE) ?
                        <div className={classnames(styles['line-area'], styles['grey-back'])}>
                            <div className={styles['perm-label']}>
                                {__('新建')}
                            </div>
                            <div className={styles['perm-value']}>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.CREATE}
                                        checked={bitTest(allow, SharePermission.CREATE)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                    />
                                    {__('允许')}
                                </label>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.CREATE}
                                        checked={bitTest(deny, SharePermission.CREATE)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                    />
                                    {__('拒绝')}
                                </label>
                            </div>
                        </div>
                        : null
                }
                {
                    bitTest(allowPerms, SharePermission.MODIFY) && !bitTest(disabledOptions, SharePermission.MODIFY) ?
                        <div className={classnames(styles['line-area'], styles['grey-back'])}>
                            <div className={styles['perm-label']}>
                                {__('修改')}
                            </div>
                            <div className={styles['perm-value']}>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.MODIFY}
                                        checked={bitTest(allow, SharePermission.MODIFY)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                    />
                                    {__('允许')}
                                </label>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.MODIFY}
                                        checked={bitTest(deny, SharePermission.MODIFY)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                    />
                                    {__('拒绝')}
                                </label>
                            </div>
                        </div>
                        : null
                }
                {
                    bitTest(allowPerms, SharePermission.DELETE) && !bitTest(disabledOptions, SharePermission.DELETE) ?
                        <div className={classnames(styles['line-area'], styles['grey-back'])}>
                            <div className={styles['perm-label']}>
                                {__('删除')}
                            </div>
                            <div className={styles['perm-value']}>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.DELETE}
                                        checked={bitTest(allow, SharePermission.DELETE)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.ALLOW })}
                                    />
                                    {__('允许')}
                                </label>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        value={SharePermission.DELETE}
                                        checked={bitTest(deny, SharePermission.DELETE)}
                                        onChange={(checked, permission) => this.handleChange({ checked, permission, type: ShareType.DENY })}
                                    />
                                    {__('拒绝')}
                                </label>
                            </div>
                        </div>
                        : null
                }
                {
                    allowOwner ?
                        <div className={classnames(styles['line-area'], styles['grey-back'])}>
                            <div className={styles['perm-label']}>
                                {__('所有者')}
                            </div>
                            <div className={styles['perm-value']}>
                                <label className={styles['allow-deny-value']}>
                                    <CheckBox
                                        checked={isowner}
                                        onChange={(checked) => { this.handleChange({ type: ShareType.OWNER, checked, permission: null }) }}
                                    />
                                    {__('允许')}
                                </label>
                                <div className={styles['allow-deny-value']} />
                            </div>
                        </div>
                        : null
                }
            </div>
        )
    }
}