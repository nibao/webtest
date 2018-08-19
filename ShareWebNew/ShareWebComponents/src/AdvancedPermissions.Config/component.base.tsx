import * as React from 'react';
import { noop } from 'lodash';
import { bitSub, bitSum } from '../../util/accessor/accessor'
import { PureComponent } from '../../ui/decorators';
import { SharePermissionOptions, getEndtimeWithTemplate } from '../../core/permission/permission';
import WebComponent from '../webcomponent';

@PureComponent
export default class AdvancedPermissionsConfigBase extends WebComponent<Components.AdvancedPermissionsConfig.Props, Components.AdvancedPermissionsConfig.State> {

    static defaultProps = {
        showDeny: false,
        allowOwner: false,
        disabledOptions: 0,
        allow: 0,
        deny: 0,
        isowner: false,
        onChange: noop,
        accessorName: null,
        allowPerms: 0,
        template: {},
        secretMode: false,
        endtime: -1,
        onCancel: noop,
    }

    state = {
        allow: this.props.allow,
        deny: this.props.deny,
        isowner: this.props.isowner,
        endtime: this.props.endtime,
        changed: false,
        allowPermanent: false
    }

    minTime: number;  // 时间选择的最小值
    maxTime: number;  // 时间选择的最大值
    datepicker = null // 日期选择器

    componentDidMount() {
        const { minTime, maxTime, allowPermanent, endtime } = getEndtimeWithTemplate(this.props.template, this.props.secretMode)
        this.minTime = minTime
        this.maxTime = maxTime
        this.setState({
            allowPermanent
        })

        if (this.props.endtime === -1 && !allowPermanent) {
            this.setState({
                endtime,
                changed: true
            })
        }
    }

    /**
     * 关闭高级权限配置页面
     */
    protected closeAdvancedPermission() {
        this.props.onCancel();
    }

    /**
     * 更新高级权限
     */
    protected updateAdvancedPerm({ isowner, allow, deny }: Core.Permission.Perm) {
        this.setState({
            isowner,
            allow,
            deny,
            changed: true,
            endtime: isowner ? -1 : this.state.endtime
        })
    }

    /**
     * 点击高级权限设置页面的确定按钮
     */
    protected set() {
        const maxPerm = SharePermissionOptions.reduce((prev, perm) => {
            return bitSum(prev, perm.value)
        }, 0)
        const hidePerms = bitSub(maxPerm, this.props.allowPerms);
        let allow = bitSub(this.state.allow, hidePerms, this.props.disabledOptions);
        let deny = bitSub(this.state.deny, hidePerms)
        this.props.onChange({ isowner: this.state.isowner, allow, deny }, this.state.endtime);
        this.closeAdvancedPermission()
    }

    /**
     * 从永久有效切换至有效期
     */
    protected switchEndTimeMode() {
        if (this.state.endtime === -1) {
            const { endtime, minTime, maxTime, allowPermanent } = getEndtimeWithTemplate(this.props.template, this.props.secretMode)
            this.minTime = minTime
            this.maxTime = maxTime

            this.setState({
                endtime,
                changed: true,
                allowPermanent
            })
        }
    }

    /**
     * 改变有效期时间
     */
    protected changeEndTime() {
        let timevalue = new Date(this.datepicker.value).getTime() * 1000

        if (this.maxTime !== -1 && timevalue > this.maxTime) {
            timevalue = this.maxTime
        } else if (timevalue < this.minTime - 24 * 60 * 60 * 1000 * 1000) {
            timevalue = this.minTime
        }

        this.setState({
            endtime: timevalue,
            changed: true
        })
    }
}