import * as React from 'react';
import { includes } from 'lodash';
import * as classnames from 'classnames';
import CheckBoxOption from '../../../ui/CheckBoxOption/ui.desktop';
import { SharePermission } from '../../../core/permission/permission';
import { bitTest } from '../../../util/accessor/accessor';
import PermissionsBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop';

export default class Permissions extends PermissionsBase {
    render() {
        return (
            <div className={styles['container']}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <CheckBoxOption value={SharePermission.DISPLAY} checked={this.isChecked(SharePermission.DISPLAY, this.state.permvalue)} disabled={true} onChange={this.changeAllowPermValue.bind(this)} >
                                    {__('显示')}
                                </CheckBoxOption>
                            </td>

                            <td>
                                <CheckBoxOption value={SharePermission.PREVIEW} checked={this.isChecked(SharePermission.PREVIEW, this.state.permvalue)} disabled={this.isDisabledPerm(this.props.disabledOptions, SharePermission.PREVIEW)} onChange={this.changeAllowPermValue.bind(this)} >
                                    {__('预览')}
                                </CheckBoxOption>
                            </td>


                            <td>
                                <CheckBoxOption value={SharePermission.DOWNLOAD} checked={this.isChecked(SharePermission.DOWNLOAD, this.state.permvalue)} disabled={this.isDisabledPerm(this.props.disabledOptions, SharePermission.DOWNLOAD)} onChange={this.changeAllowPermValue.bind(this)} >
                                    {__('下载')}
                                </CheckBoxOption>
                            </td>


                            <td>
                                <CheckBoxOption value={SharePermission.COPY} checked={this.isChecked(SharePermission.COPY, this.state.permvalue)} disabled={this.isDisabledPerm(this.props.disabledOptions, SharePermission.COPY)} onChange={this.changeAllowPermValue.bind(this)} >
                                    {__('复制')}
                                </CheckBoxOption>
                            </td>
                        </tr>
                        <tr>

                            <td className={styles['second-line']}>
                                <CheckBoxOption value={SharePermission.MODIFY} checked={this.isChecked(SharePermission.MODIFY, this.state.permvalue)} disabled={this.isDisabledPerm(this.props.disabledOptions, SharePermission.MODIFY)} onChange={this.changeAllowPermValue.bind(this)} >
                                    {__('修改')}
                                </CheckBoxOption>
                            </td>

                             <td className={styles['second-line']}>
                                <CheckBoxOption value={SharePermission.CREATE} checked={this.isChecked(SharePermission.CREATE, this.state.permvalue)} disabled={this.isDisabledPerm(this.props.disabledOptions, SharePermission.CREATE)} onChange={this.changeAllowPermValue.bind(this)} >
                                    {__('新建')}
                                </CheckBoxOption>
                            </td>

                             <td className={styles['second-line']}>
                                <CheckBoxOption value={SharePermission.DELETE} checked={this.isChecked(SharePermission.DELETE, this.state.permvalue)} disabled={this.isDisabledPerm(this.props.disabledOptions, SharePermission.DELETE)} onChange={this.changeAllowPermValue.bind(this)} >
                                    {__('删除')}
                                </CheckBoxOption>
                            </td>
                            {
                                this.props.showOwner ?
                                     <td className={styles['second-line']}>
                                        <CheckBoxOption checked={this.state.isowner} disabled={this.isDisabledPerm(this.props.disabledOptions, -1)} onChange={this.changeOwnerValue.bind(this)} >
                                            {__('所有者')}
                                        </CheckBoxOption>
                                    </td>
                                    :
                                    null
                            }

                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    /**
     * 检测权限总值是否包含该权限
     * @param permission 
     * @param permvalue 
     */
    private isChecked(permission, permvalue) {
        return bitTest(permvalue, permission);
    }

    private isDisabledPerm(disabled = [], permission) {
        return includes(disabled, permission)
    }

}
