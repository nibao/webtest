import * as React from 'react'
import * as classnames from 'classnames'
import { noop } from 'lodash'
import { formatTime } from '../../util/formatters/formatters'
import RadioBox from '../../ui/RadioBox/ui.mobile'
import AppBar from '../../ui/AppBar/ui.mobile'
import AdvancedPermissions from '../AdvancedPermissions/component.mobile'
import AdvancedPermissionsConfigBase from './component.base'
import * as styles from './styles.mobile.css'
import __ from './locale'

export default class AdvancedPermissionsConfig extends AdvancedPermissionsConfigBase {
    render() {
        const { showDeny, disabledOptions, allowOwner, allowPerms, accessorName, onCancel } = this.props;
        const { allow, deny, isowner, endtime, changed, allowPermanent } = this.state;

        return (
            <div className={styles['container']}>
                <AppBar>
                    <div className={styles['header-left-area']}>
                        <div
                            className={classnames(
                                styles['header-enable-btn'],
                                styles['header-button']
                            )}
                            onClick={onCancel}
                        >
                            {__('取消')}
                        </div>
                    </div>
                    <div className={styles['header-text']}>
                        {__('详情配置')}
                    </div>
                    <div className={styles['header-right-area']}>
                        <div
                            className={classnames(
                                styles['header-button'],
                                changed && (allow || deny || (isowner && allowOwner)) ? styles['header-enable-btn'] : styles['header-disabled-btn'],
                            )}
                            onClick={changed && (allow || deny || (isowner && allowOwner)) ? this.set.bind(this) : noop}
                        >
                            {__('确定')}
                        </div>
                    </div>
                </AppBar>
                <div className={styles['content-area']}>
                    <div className={classnames(styles['line-area'], styles['grey-back'])}>
                        <div className={styles['perm-label']}>
                            {__('访问者')}
                        </div>
                        <div className={styles['perm-value']}>
                            {accessorName}
                        </div>
                    </div>
                    <AdvancedPermissions
                        showDeny={showDeny}
                        disabledOptions={disabledOptions}
                        allowOwner={allowOwner}
                        allow={allow}
                        deny={deny}
                        isowner={isowner}
                        onChange={this.updateAdvancedPerm.bind(this)}
                        allowPerms={allowPerms}
                    />
                    <div className={styles['line-area']}>
                        {__('有效期至')}
                    </div>
                    <div className={classnames(styles['line-area'], styles['grey-back'], !allowPermanent ? styles['disable'] : null)}>
                        <div className={styles['perm-label']}>
                            {__('永久有效')}
                        </div>
                        <div className={styles['perm-value-time']}>
                            <label className={styles['radio-box']}>
                                <RadioBox
                                    name="endtime"
                                    value={'-1'}
                                    onCheck={() => this.setState({ endtime: -1, changed: true })}
                                    checked={endtime === -1}
                                    disabled={!allowPermanent}
                                />
                            </label>
                        </div>
                    </div>
                    <div className={classnames(styles['line-area'], styles['grey-back'], isowner ? styles['disable'] : null)}>
                        <div className={styles['perm-label']}>
                            {__('指定日期')}
                        </div>
                        <div className={styles['perm-value-time']}>
                            {
                                endtime !== -1 || !allowPermanent ?
                                    <div
                                        className={styles['time-area']}
                                    >
                                        <input
                                            ref={datepicker => this.datepicker = datepicker}
                                            type="date"
                                            name="date"
                                            required
                                            value={formatTime(endtime / 1000, 'yyyy-MM-dd')}
                                            placeholder={formatTime(endtime / 1000, 'yyyy-MM-dd')}
                                            onChange={this.changeEndTime.bind(this)}
                                        />
                                    </div>
                                    :
                                    null
                            }
                            <label className={styles['radio-box']}>
                                <RadioBox
                                    name="endtime"
                                    value={0}
                                    onCheck={() => this.switchEndTimeMode()}
                                    disabled={isowner}
                                    checked={endtime !== -1 || !allowPermanent}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}