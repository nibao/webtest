import * as React from 'react';
import * as classnames from 'classnames';
import { buildSelectionText, SharePermissionOptions, formatterErrorText } from '../../core/permission/permission';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { formatTime } from '../../util/formatters/formatters';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop'
import Text from '../../ui/Text/ui.desktop';
import PermissionSelect from '../PermissionSelect/component.client';
import ValidityBox2 from '../ValidityBox2/component.desktop';
import SharePermissionsBase from './component.base'
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class SharePermissions extends SharePermissionsBase {

    render() {
        const { permConfigs, disabledOptions, allowPerms, displayErrCode } = this.props;

        return (
            <div className={styles['container']}>
                <DataGrid
                    className={styles['data-grid']}
                    data={permConfigs}
                    locator={() => -1}
                    height={395}
                >
                    <DataGrid.Field
                        field="accessorname"
                        label={__('访问者')}
                        width="75px"
                        formatter={(accessorname, record) => (
                            <div className={classnames(styles['text'], record.isNewAdded ? styles['new-add'] : null)}>
                                <Text>
                                    {this.formatterName(accessorname)}
                                </Text>
                            </div>

                        )}
                    />
                    <DataGrid.Field
                        field="namepath"
                        label={__('继承自')}
                        width="100px"
                        formatter={(namepath, { isNewAdded }) => (
                            <div className={classnames(styles['text'], isNewAdded ? styles['new-add'] : null)}>
                                <Text>
                                    {namepath}
                                </Text>
                            </div>
                        )}
                    />
                    <DataGrid.Field
                        field="permvalue"
                        label={__('访问权限')}
                        width="140px"
                        formatter={(allow, record, { index }) => (
                            !this.isEditable(record) ?
                                <div className={classnames(styles['text'], record.isNewAdded ? styles['new-add'] : null)}>
                                    <Text>
                                        {buildSelectionText(SharePermissionOptions, { allow: record.allow, deny: record.deny, isowner: record.isowner })}
                                    </Text>
                                </div>
                                :
                                <div className={classnames(record.isNewAdded ? styles['new-add'] : null)}>
                                    <PermissionSelect
                                        allow={record.allow}
                                        deny={record.deny}
                                        isowner={record.isowner}
                                        showDeny={true}
                                        disabledOptions={disabledOptions}
                                        editingkey={record.accessorid + record.inheritpath}
                                        accessorName={this.formatterName(record.accessorname)}
                                        width={'100%'}
                                        allowPerms={allowPerms}
                                        allowOwner={record.allowOwner}
                                        onChange={(key, perm) => this.updatePerm(key, perm, record)}
                                    />
                                </div>
                        )}

                    />
                    <DataGrid.Field
                        field="endtime"
                        label={__('有效期')}
                        width="100px"
                        formatter={(endtime, record, { index }) => (
                            !this.isEndtimeEditable(record) ?
                                <div className={classnames(styles['text'], record.isNewAdded ? styles['new-add'] : null)}>
                                    <Text>
                                        {this.formatteValidity(endtime)}
                                    </Text>
                                </div>
                                :
                                <div className={classnames(record.isNewAdded ? styles['new-add'] : null)}>
                                    <ValidityBox2
                                        width="100%"
                                        defaultSelect={record.defaultSelectDays === -1 ? 30 : record.defaultSelectDays}
                                        selectRange={record.timeRange}
                                        value={(endtime)}
                                        disableEarlierDays={true}
                                        allowPermanent={record.allowPermanent}
                                        onChange={(perm) => { this.updateEndtime(record.accessorid + record.inheritpath, perm, record) }}
                                    />
                                </div>
                        )}
                    />
                    <DataGrid.Field
                        field="accessorid"
                        label={__('操作')}
                        width="50px"
                        formatter={(accessorid, record) => (
                            this.isEditable(record) ?
                                <div className={classnames(styles['delete'], record.isNewAdded ? styles['new-add'] : null)}>
                                    <UIIcon
                                        code={'\uf014'}
                                        size={'13px'}
                                        onClick={this.remove.bind(this, record.accessorid + record.inheritpath)}
                                    />
                                </div>
                                : null
                        )}
                    />
                </DataGrid>
                {
                    displayErrCode
                        ? <div className={styles['no-permission']}>
                            {formatterErrorText(displayErrCode)}
                        </div>
                        : null
                }
            </div>
        )
    }

    /**
     * 规范化时间
     */
    formatteValidity(endtime: number): string {
        if (endtime === -1) {
            return __('永久有效');
        } else {
            return formatTime(endtime / 1000, 'yyyy-MM-dd')
        }
    }

    /**
     * 判断时间有效期是否可以编辑
     * (1)权限不可以编辑，有效期也不可以编辑
     * (2)权限可以编辑， 如果选中了所有者，则不可以编辑；反之可以编辑
     */
    isEndtimeEditable(record) {
        if (!this.isEditable(record)) {
            // 如果权限不可以编辑，那么有效期也不可以编辑
            return false
        }
        // 所有者，不可以编辑
        return !record.isowner
    }

}