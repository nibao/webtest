import * as React from 'react'
import * as classnames from 'classnames'
import { bitSub } from '../../util/accessor/accessor'
import { formatTime } from '../../util/formatters/formatters';
import { buildPermText, SharePermissionOptions } from '../../core/permission/permission'
import { UIIcon } from '../../ui/ui.desktop'
import Card from '../../ui/Card/ui.mobile'
import Text from '../../ui/Text/ui.mobile'
import SharePermissionsBase from './component.base'
import * as styles from './styles.mobile'
import __ from './locale'

/**
 * 移动端内链
 */

export default class SharePermissions extends SharePermissionsBase {
    /**
    * 707研究所权限配置用户名后加上密级
     * @param name  访问者的名字
     * @param record 访问者的具体信息 
     * @returns 用户名+密级
    */
    private formatterName(name: string, config: any): string {
        if (!name) {
            return ''
        }
        let index = name.lastIndexOf('\/');

        if (this.props.showCSF && config.accessortype === 'user') {
            // 707权限配置，用户后面加上密级
            const csfName = this.props.csfTextArray[config.csflevel - 5]

            return name.substring(index === -1 ? 0 : index + 1, name.length) + '(' + csfName + ')'
        }

        return name.substring(index === -1 ? 0 : index + 1, name.length)
    }

    render() {
        const { permConfigs } = this.state;

        return (
            <div className={styles['container']}>
                {
                    permConfigs.map(config => this.renderConfig(config))
                }
            </div>
        )
    }

    renderConfig(config: any) {
        const isEditable = this.isEditable(config)

        return (
            <div className={styles['card']}>
                <Card className={classnames({ [styles['new-added']]: config.isNewAdded })}>
                    <div className={styles['line-area']}>
                        <Text className={styles['text']}>
                            {this.formatterName(config.accessorname, config)}
                        </Text>
                        {
                            isEditable ?
                                <div
                                    className={styles['delete']}
                                    onClick={this.remove.bind(this, config.accessorid + config.inheritpath)}
                                >
                                    {__('删除')}
                                </div>
                                : null
                        }
                    </div>
                    {
                        config.isowner ?
                            <div className={styles['line-area']}>
                                <div className={classnames(styles['perm-label'], styles['text-color'])}>
                                    {__('访问权限')}
                                </div>
                                <div className={styles['perm-value']}>
                                    {__('所有者')}
                                </div>
                            </div>
                            :
                            this.renderPermInfo({ allow: config.allow, deny: config.deny }, this.props.allowPerms, this.props.disabledOptions)
                    }
                    <div className={styles['line-area']}>
                        <div className={classnames(styles['perm-label'], styles['text-color'])}>
                            {__('有效期')}
                        </div>
                        <div className={styles['perm-value']}>
                            {this.formatteValidity(config.endtime)}
                        </div>
                    </div>
                    {
                        config.inheritpath ?
                            <div
                                className={classnames(styles['line-area'], styles['namepath-config'])}
                                onClick={() => this.toggleNamepathShow(config)}
                            >
                                <div className={styles['config']}>
                                    {__('继承自')}
                                </div>
                                <UIIcon
                                    className={styles['icon']}
                                    code={config.showNamepath ? '\uf04b' : '\uf04c'}
                                    size={24}
                                    color={'#aaa'}
                                />
                            </div>
                            : null
                    }
                    {
                        config.showNamepath ?
                            <div className={styles['path-area']}>
                                {config.namepath}
                            </div>
                            : null
                    }
                    {
                        isEditable ?
                            <div
                                className={classnames(styles['line-area'], styles['detail-config'])}
                                onClick={() => this.props.onViewPermDetail(config)}
                            >
                                <div className={styles['config']}>
                                    {__('详情配置')}
                                </div>
                                <UIIcon
                                    className={styles['icon']}
                                    code={'\uf04e'}
                                    size={24}
                                    color={'#aaa'}
                                />
                            </div>
                            : null
                    }
                </Card>
            </div>
        )
    }

    renderPermInfo(perm: { allow: number, deny: number }, allowPerms: number, disabledOptions: number) {
        const maxPerm = bitSub(allowPerms, disabledOptions)

        const { allowText, denyText } = buildPermText(SharePermissionOptions, perm, maxPerm)

        return (
            <div>
                {
                    allowText ?
                        <div className={styles['line-area']}>
                            <div className={classnames(styles['perm-label'], styles['text-color'])}>
                                {__('允许')}
                            </div>
                            <div className={styles['perm-value']}>
                                {allowText}
                            </div>
                        </div>
                        : null
                }
                {
                    denyText ?
                        <div className={styles['line-area']}>
                            <div className={classnames(styles['perm-label'], styles['text-color'])}>
                                {__('拒绝')}
                            </div>
                            <div className={styles['perm-value']}>
                                {denyText}
                            </div>
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
            return __('至') + formatTime(endtime / 1000, 'yyyy-MM-dd')
        }
    }
}