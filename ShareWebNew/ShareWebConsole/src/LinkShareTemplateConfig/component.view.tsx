import * as React from 'react';
import * as classnames from 'classnames';
import session from '../../util/session/session';
import { positiveInteger } from '../../util/validators/validators';
import { bitTest } from '../../util/accessor/accessor';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import ComboArea from '../../ui/ComboArea/ui.desktop';
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop';
import RadioBoxOption from '../../ui/RadioBoxOption/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import InlineValidateBox from '../../ui/InlineValidateBox/ui.desktop';
import { getErrorTemplate, getErrorMessage } from '../../core/exception/exception';
import { LinkSharePermission } from '../../core/permission/permission';
import OrganizationPicker from '../OrganizationPicker/component.view';
import { NodeType } from '../OrganizationTree/helper';
import LinkShareTemplateConfigBase from './component.base';
import { Mode, ErrorType, ValidateState } from './component.base';
import * as styles from './styles.view';
import __ from './locale';

export default class LinkShareTemplateConfig extends LinkShareTemplateConfigBase {
    render() {

        return (
            <div className={styles['container']}>
                {
                    this.state.errorType === ErrorType.NORMAL || this.state.errorType === ErrorType.SHARECONFLICT ?
                        this.showEditDialog() :
                        null
                }
                {
                    this.showErrorDialog()
                }
            </div>
        )
    }
    showEditDialog() {
        const { config: { allowPerm, defaultPerm } } = this.state.template;
        return (
            <div>
                <Dialog
                    title={this.props.mode === Mode.CREATE ? __('添加模板') : __('编辑模板')}
                    onClose={this.cancelTemplateSet.bind(this)}

                >
                    <Panel>
                        <Panel.Main>
                            <Form>
                                <Form.Row>
                                    <Form.Label align='top'>
                                        {__('共享者：')}
                                    </Form.Label>
                                    <Form.Field>
                                        {
                                            this.state.template.sharerInfos[0] && this.state.template.sharerInfos[0].sharerId === '-2' ? <TextBox width={240} disabled={true} value={__('所有用户')} /> :
                                                <FlexBox>
                                                    <FlexBox.Item>
                                                        <div className={styles['sharers-text']}>
                                                            <ComboArea
                                                                width={225}
                                                                uneditable={true}
                                                                minHeight={32}
                                                                value={this.state.template.sharerInfos}
                                                                formatter={this.formatterSharer.bind(this)}
                                                                onChange={value => { this.setLimitRange(value) }}
                                                            />
                                                        </div>
                                                    </FlexBox.Item>
                                                    <FlexBox.Item align='left top'>
                                                        <Button onClick={() => { this.toggleAddLimitRange(true) }}> {__('添加')} </Button>
                                                    </FlexBox.Item>
                                                </FlexBox>
                                        }
                                    </Form.Field>
                                </Form.Row>
                                {
                                    this.state.validateResult.sharer === ValidateState.NO_SHARER ?
                                        <Form.Row>
                                            <Form.Label>
                                            </Form.Label>
                                            <Form.Field>
                                                <div className={styles['warn-font']}>
                                                    {__('请添加共享者。')}
                                                </div>
                                            </Form.Field>
                                        </Form.Row>
                                        :
                                        null
                                }
                                <Form.Row>
                                    <Form.Label>
                                        {__('可设定的访问权限：')}
                                    </Form.Label>
                                    <Form.Field>
                                        <FlexBox>
                                            <FlexBox.Item>
                                                <div>
                                                    <CheckBoxOption checked={bitTest(allowPerm, LinkSharePermission.PREVIEW)} value={allowPerm} onChange={value => { this.updateAllowPerm(value, LinkSharePermission.PREVIEW) }} >
                                                        {__('预览')}
                                                    </CheckBoxOption>
                                                </div>
                                            </FlexBox.Item>
                                            <FlexBox.Item>
                                                <div>
                                                    <CheckBoxOption checked={bitTest(allowPerm, LinkSharePermission.DOWNLOAD)} value={allowPerm} onChange={value => { this.updateAllowPerm(value, LinkSharePermission.DOWNLOAD) }} >
                                                        {__('下载')}
                                                    </CheckBoxOption>
                                                </div>
                                            </FlexBox.Item>
                                            <FlexBox.Item>
                                                <div>
                                                    <CheckBoxOption checked={bitTest(allowPerm, LinkSharePermission.UPLOAD)} value={allowPerm} onChange={value => { this.updateAllowPerm(value, LinkSharePermission.UPLOAD) }} >
                                                        {`${__('上传')}${__('（仅对文件夹）')}`}
                                                    </CheckBoxOption>
                                                </div>
                                            </FlexBox.Item>
                                        </FlexBox>
                                    </Form.Field>
                                </Form.Row>
                                {
                                    this.state.validateResult.allowPerm === ValidateState.NO_ALLOW_PERM ?
                                        <Form.Row>
                                            <Form.Label>
                                            </Form.Label>
                                            <Form.Field>
                                                <div className={styles['warn-font']}>
                                                    {__('最少要选择一个可设定的访问权限。')}
                                                </div>
                                            </Form.Field>
                                        </Form.Row>
                                        :
                                        null
                                }
                                <Form.Row>
                                    <Form.Label>
                                        {__('默认访问权限：')}
                                    </Form.Label>
                                    <Form.Field>
                                        <FlexBox>
                                            <FlexBox.Item>
                                                <div>
                                                    <CheckBoxOption checked={bitTest(defaultPerm, LinkSharePermission.PREVIEW)} disabled={!(allowPerm & LinkSharePermission.PREVIEW)} value={defaultPerm} onChange={value => { this.updateDefaultPerm(value, LinkSharePermission.PREVIEW) }}>
                                                        {__('预览')}
                                                    </CheckBoxOption>
                                                </div>
                                            </FlexBox.Item>
                                            <FlexBox.Item>
                                                <div>
                                                    <CheckBoxOption checked={bitTest(defaultPerm, LinkSharePermission.DOWNLOAD)} disabled={!(allowPerm & LinkSharePermission.DOWNLOAD)} value={defaultPerm} onChange={value => { this.updateDefaultPerm(value, LinkSharePermission.DOWNLOAD) }}>
                                                        {__('下载')}
                                                    </CheckBoxOption>
                                                </div>
                                            </FlexBox.Item>
                                            <FlexBox.Item>
                                                <div>
                                                    <CheckBoxOption checked={bitTest(defaultPerm, LinkSharePermission.UPLOAD)} disabled={!(allowPerm & LinkSharePermission.UPLOAD)} value={defaultPerm} onChange={value => { this.updateDefaultPerm(value, LinkSharePermission.UPLOAD) }} >
                                                        {`${__('上传')}${__('（仅对文件夹）')}`}
                                                    </CheckBoxOption>
                                                </div>
                                            </FlexBox.Item>
                                        </FlexBox>
                                    </Form.Field>
                                </Form.Row>
                                {
                                    this.state.validateResult.defualtPerm === ValidateState.NO_DEFAULT_PERM ?
                                        <Form.Row>
                                            <Form.Label>
                                            </Form.Label>
                                            <Form.Field>
                                                <div className={styles['warn-font']}>
                                                    {__('最少要选择一个默认访问权限。')}
                                                </div>
                                            </Form.Field>
                                        </Form.Row>
                                        :
                                        null
                                }
                                <Form.Row>
                                    <Form.Label>
                                        {__('外链有效期：')}
                                    </Form.Label>
                                    <Form.Field>
                                        <div className={styles['allow-expire']}>
                                            <RadioBoxOption name="expireday" value={false} checked={!this.state.template.config.limitExpireDays} onChange={(check, value) => { this.selectLimitExpireDay(check, value) }} >
                                                {__('不限制天数设置，默认有效期：')}
                                            </RadioBoxOption>
                                            <span className={styles['form-Item-data']}>
                                                <InlineValidateBox
                                                    validateState={!this.state.template.config.limitExpireDays && this.state.validateResult.expireValue}
                                                    validateMessages={{ [ValidateState.NO_EXPIRE_VALUE]: __('此输入项不能为空。') }}
                                                    validator={positiveInteger}
                                                    value={!this.state.template.config.limitExpireDays ? this.state.template.config.allowExpireDays : ''}
                                                    disabled={this.state.template.config.limitExpireDays}
                                                    onChange={value => { this.setAllowExpireDay(value) }}
                                                />
                                            </span>
                                            {__(' 天')}
                                        </div>
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label></Form.Label>
                                    <Form.Field>
                                        <div className={styles['limit-expire']}>
                                            <RadioBoxOption name="expireday" value={true} checked={this.state.template.config.limitExpireDays} onChange={(check, value) => { this.selectLimitExpireDay(check, value) }} >
                                                {__('限制天数设置，且可设定的最大有效期：')}
                                            </RadioBoxOption>
                                            <span className={styles['form-Item-data']}>
                                                <InlineValidateBox
                                                    validateState={this.state.template.config.limitExpireDays && this.state.validateResult.expireValue}
                                                    validateMessages={{ [ValidateState.NO_EXPIRE_VALUE]: __('此输入项不能为空。') }}
                                                    validator={positiveInteger}
                                                    value={this.state.template.config.limitExpireDays ? this.state.template.config.allowExpireDays : ''}
                                                    disabled={!this.state.template.config.limitExpireDays}
                                                    onChange={value => { this.setAllowExpireDay(value) }}
                                                />
                                            </span>
                                            {__(' 天')}
                                        </div>
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label>
                                        {__('访问密码：')}
                                    </Form.Label>
                                    <Form.Field>
                                        <CheckBoxOption checked={this.state.template.config.accessPassword} value={this.state.template.config.accessPassword} onChange={(value) => { this.setAccessPassword(value) }} >
                                            {__('强制共享者必须使用访问密码')}
                                        </CheckBoxOption>
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label>
                                        {__('外链打开次数：')}
                                    </Form.Label>
                                    <Form.Field>
                                        <div className={styles['limit-times']}>
                                            <RadioBoxOption name="accesstimes" value={false} checked={!this.state.template.config.limitAccessTimes} onChange={(check, value) => { this.setLimitAccessTimes(check, value) }} >
                                                {__('不限制，可设定限制时默认打开次数：')}
                                            </RadioBoxOption>
                                            <span className={styles['form-Item-data']}>
                                                <InlineValidateBox
                                                    validateState={!this.state.template.config.limitAccessTimes && this.state.validateResult.timesValue}
                                                    validateMessages={{ [ValidateState.NO_TIMES_VALUE]: __('此输入项不能为空。') }}
                                                    validator={positiveInteger}
                                                    value={!this.state.template.config.limitAccessTimes ? this.state.template.config.allowAccessTimes : ''}
                                                    disabled={this.state.template.config.limitAccessTimes}
                                                    onChange={value => { this.setAllowAccessTimes(value) }}
                                                />
                                            </span>
                                            {__(' 次')}
                                        </div>
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label></Form.Label>
                                    <Form.Field>
                                        <div className={styles['allow-times']}>
                                            <RadioBoxOption name="accesstimes" value={true} checked={this.state.template.config.limitAccessTimes} onChange={(check, value) => { this.setLimitAccessTimes(check, value) }} >
                                                {__('限制，且可设定的最多打开次数：')}
                                            </RadioBoxOption>
                                            <span className={styles['form-Item-data']}>
                                                <InlineValidateBox
                                                    validateState={this.state.template.config.limitAccessTimes && this.state.validateResult.timesValue}
                                                    validateMessages={{ [ValidateState.NO_TIMES_VALUE]: __('此输入项不能为空。') }}
                                                    validator={positiveInteger}
                                                    value={this.state.template.config.limitAccessTimes ? this.state.template.config.allowAccessTimes : ''}
                                                    disabled={!this.state.template.config.limitAccessTimes}
                                                    onChange={value => { this.setAllowAccessTimes(value) }}
                                                />
                                            </span>
                                            {__(' 次')}
                                        </div>
                                    </Form.Field>
                                </Form.Row>
                            </Form>

                        </Panel.Main>
                        <Panel.Footer>
                            <Panel.Button onClick={this.confirmTemplateSet.bind(this)}>{__('确定')}</Panel.Button>
                            <Panel.Button onClick={this.cancelTemplateSet.bind(this)}>{__('取消')}</Panel.Button>
                        </Panel.Footer>
                    </Panel>
                </Dialog>
                {
                    this.state.showOrganizationPicker ?
                        <OrganizationPicker
                            userid={session.get('userid')}
                            convererOut={value => { return this.convererData(value) }}
                            selectType={[NodeType.DEPARTMENT, NodeType.ORGANIZATION, NodeType.USER]}
                            onCancel={() => { this.toggleAddLimitRange(false) }}
                            onConfirm={limitRange => { this.confirmAddLimitRange(limitRange) }}
                            title={__('添加共享者')}
                        /> :
                        null
                }
            </div>)
    }

    showErrorDialog() {
        switch (this.state.errorType) {
            case ErrorType.NORMAL:
                return (<div></div>)
            case ErrorType.SHARECONFLICT:
                return (
                    <MessageDialog onConfirm={this.closeConflictDialog.bind(this)}>
                        <p>{__('共享者“${sharers}”已存在模板策略，不能重复添加。', { sharers: this.state.repeatAddSharer })}</p>
                    </MessageDialog>
                )
        }
    }
}   