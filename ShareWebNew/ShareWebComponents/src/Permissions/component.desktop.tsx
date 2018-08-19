import * as React from 'react';
import * as classnames from 'classnames';
import Text from '../../ui/Text/ui.desktop';
import { buildSelectionText, SharePermissionOptions } from '../../core/permission/permission';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import PermissionsBase from './component.base';
import * as styles from './styles.desktop.css';


const Item = ({ record, name, isCurUser }) => (
    <div className={styles['item']}>
        <div className={classnames(styles['form'], isCurUser ? styles['bold'] : null)}>
            <Text>{name}</Text>
        </div>
        <div className={classnames(styles['form'], styles['permission-form'], isCurUser ? styles['bold'] : null)}>
            <Text>
                {
                    record.allowvalue || record.denyvalue ?
                        buildSelectionText(SharePermissionOptions, { allow: record.allowvalue, deny: record.denyvalue, isowner: false })
                        :
                        buildSelectionText(SharePermissionOptions, { isowner: true })
                }
            </Text>
        </div>
        <div className={styles['pad']} />
    </div>
)


export default class Permissions extends PermissionsBase {

    render() {
        const userid = getOpenAPIConfig('userid');

        return (
            <div className={styles['container']}>
                {
                    this.state.permConfigs.map((permConfig) => (
                        <Item
                            record={permConfig}
                            name={this.formatterName(permConfig.accessorname)}
                            isCurUser={userid === permConfig.accessorid}
                        />
                    ))
                }
            </div>
        )
    }

    /**
      * 规范化名字
      */
    private formatterName(name: string): string {
        if (!name) {
            return ''
        }
        const index = name.lastIndexOf('\/');
        return name.substring(index === -1 ? 0 : index + 1, name.length)
    }

}