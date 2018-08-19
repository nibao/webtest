import * as React from 'react';
import { noop } from 'lodash';
import { getOpenAPIConfig } from '../../core/openapi/openapi';

export default class SharePermissionsBase extends React.Component<Components.SharePermissions.Props, any> {

    static defaultProps = {
        permConfigs: [],

        onRemove: noop,

        disabledOptions: 0,

        allowPerms: 0,

        allowOwner: false,

        onChange: noop,

        doctype: null,

        onViewPermDetail: noop,

        showCSF: false,

        csfTextArray: []
    }

    state = {
        permConfigs: this.props.permConfigs
    }

    componentWillReceiveProps({ permConfigs }) {
        this.setState({
            permConfigs
        })
    }

    /**
     * 移除一条权限
     * @param key accessorid + inheritpath
     */
    protected remove(key: string) {
        this.props.onRemove(key);
    }

    /**
     * 更新权限
     * @param key accessorid + inheritpath
     * @param perm 更改后的perm
     * @param permConfig 未更改之前的permConfig
     */
    protected updatePerm(key: string, perm: Core.Permission.Perm, permConfig: Core.Permission.PermConfig) {
        const newConfig = { ...permConfig, ...perm }
        this.props.onChange(key, newConfig)
    }

    /**
     * 更新有效期
     * @param key accessorid + inheritpath
     * @param endtime 更改后的时间
     * @param permConfig 未更改之前的permConfig
     */
    protected updateEndtime(key: string, endtime: number, permConfig: Core.Permission.PermConfig) {
        const newConfig = { ...permConfig, endtime }
        this.props.onChange(key, newConfig);
    }

    /**
     * 判断一条数据权限是否可以编辑
     * (1)isowner为true且为当前用户，不可编辑
     * (2)继承的权限，即inheritpath!==''，不可编辑
     * @returns true -- 可以编辑；false -- 不可以编辑
     */
    protected isEditable(record: Core.Permission.PermConfig): boolean {
        return !((record.isowner && record.accessorid === getOpenAPIConfig('userid')) || record.inheritpath !== '')
    }

    /**
     * 规范化名字
     */
    protected formatterName(name: string): string {
        if (!name) {
            return ''
        }
        let index = name.lastIndexOf('\/');
        return name.substring(index === -1 ? 0 : index + 1, name.length)
    }

    /**
     * mobile, 切换继承自的路径是否显示
     */
    protected toggleNamepathShow(config) {
        const permConfigs = this.state.permConfigs.map(item => {
            if (item.accessorid + item.inheritpath === config.accessorid + config.inheritpath) {
                return { ...item, showNamepath: !item.showNamepath }
            }

            return item
        })
        this.setState({
            permConfigs
        })
    }
} 