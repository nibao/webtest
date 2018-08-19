import * as React from 'react';
import * as classnames from 'classnames';
import FlexBox from '../../../ui/FlexBox/ui.desktop';
import ValidateBox from '../../../ui/ValidateBox/ui.desktop';
import Text from '../../../ui/Text/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Thumbnail from '../../Thumbnail/component.desktop';
import StackBar from '../../../ui/StackBar/ui.desktop';
import { maxLength } from '../../../util/validators/validators';
import { formatSize } from '../../../util/formatters/formatters';
import { ValidateState } from './helper';
import GrounpItemBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop';

export default class GrounpItem extends GrounpItemBase {

    render() {
        const maxsize = formatSize(Number(this.props.maxSize), 2, { minUnit: 'GB' });
        const { docid, used, quota, docname, nameTip, quotaTip } = this.state;
        /**
         * 输入框气泡状态
         */
        const ValidateMessages = {
            [ValidateState.MaxSize]: __('最大可分配空间 ${maxsize}。', { maxsize: maxsize }),
            [ValidateState.QuotaNotEnough]: __('配额空间不足，请重新输入。'),
            [ValidateState.SizeError]: __('无法将所有个人配额都分配给群组，请重新输入。'),
            [ValidateState.FormError]: __('群组名不能包含 \\ / : * ? " < > | 特殊字符，请重新输入。'),
            [ValidateState.Empty]: __('此输入项不允许为空。'),
            [ValidateState.LimitError]: __('配额空间值为不超过 1000000GB 的正数，支持小数点后两位，请重新输入。'),
            [ValidateState.SmallQuota]: __('配额空间不能小于已用空间${used}，请重新输入。', { used: formatSize(used) }),
        }
        const quotaDisplay = Number((quota * Math.pow(1024, 3)).toFixed(2));
        const editing = this.props.activeId === docid;

        return (
            <div className={styles['grounp-item']}>
                <FlexBox>
                    <FlexBox.Item style={{ verticalAlign: 'middle' }}>
                        <div style={{ width: '220px' }}>
                            <Thumbnail
                                type="GROUPDOC"
                                size={24}
                                className={styles['grounp-icon']}
                            ></Thumbnail>
                            <div className={classnames(styles['quota-box'], styles['name-box'])}>
                                {
                                    editing ?
                                        <ValidateBox
                                            autoFocus={true}
                                            selectOnFocus={[docname.length]}
                                            className={this.props.warning ? classnames(styles['common'], styles['warning']) : styles['common']}
                                            placeholder={__('请输入群组文档名称')}
                                            value={docname}
                                            validateState={nameTip}
                                            validateMessages={ValidateMessages}
                                            onChange={(value) => this.handleChange(value, 'docname')}
                                            validator={maxLength(128, false)}
                                        /> :
                                        <Text className={styles['docname']}>{docname}</Text>
                                }
                            </div>
                        </div>

                    </FlexBox.Item>
                    <FlexBox.Item width="310px">
                        {
                            editing ? (
                                <div className={styles['quota-box']}>
                                    <ValidateBox
                                        className={this.props.warning ? classnames(styles['common'], styles['warning']) : styles['common']}
                                        placeholder={__('请输入配额空间')}
                                        value={quota}
                                        validateState={quotaTip}
                                        validateMessages={ValidateMessages}
                                        onChange={(value) => this.handleChange(value, 'quota')}
                                        validator={this.checkquota.bind(this)}
                                        onFocus={this.handleFocusQuota.bind(this)}
                                        onBlur={this.handleBlurQuota.bind(this)}
                                    /> GB
                                </div>
                            ) : (
                                    <StackBar width="280px" className={styles['stack-bar']}>
                                        <StackBar.Stack
                                            rate={used / quotaDisplay}
                                            background="#cccccc">
                                        </StackBar.Stack>
                                        <StackBar.Stack
                                            rate={(quotaDisplay - used) / quotaDisplay}
                                            background="#ffffff">
                                        </StackBar.Stack>
                                        <div className={styles['quota-detail']}>
                                            {formatSize(used)}/
                                            {formatSize(quotaDisplay)}
                                        </div>
                                    </StackBar>
                                )
                        }
                    </FlexBox.Item>
                    <FlexBox.Item>
                        <div className={styles['oper-icon-wrap']}>
                            <UIIcon
                                size={16}
                                code={editing ? '\uf00a' : '\uf091'}
                                className={styles['oper-icon']}
                                disabled={editing && this.state.editDisabled}
                                onClick={() => editing ? this.handleSave() : this.handleEdit(docid, this.props.index)}
                                title={editing ? __('确定') : __('编辑')}
                            />
                        </div>
                        <div className={styles['oper-icon-wrap']}>
                            <UIIcon
                                size={16}
                                code={editing ? '\uf017' : '\uf000'}
                                className={styles['oper-icon']}
                                onClick={() => editing ? this.handleCancle() : this.props.onDel(docid)}
                                title={editing ? __('取消') : __('刪除')}
                            />
                        </div>
                    </FlexBox.Item>
                </FlexBox>
            </div>

        )

    }
}