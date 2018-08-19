import * as React from 'react';
import * as classnames from 'classnames';
import session from '../../../util/session/session';
import { positiveInteger } from '../../../util/validators/validators';
import Tip from '../../../ui/Tip/ui.desktop';
import Dialog from '../../../ui/Dialog2/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';
import MessageDialog from '../../../ui/MessageDialog/ui.desktop';
import InlineValidateBox from '../../../ui/InlineValidateBox/ui.desktop';
import Button from '../../../ui/Button/ui.desktop';
import ComboArea from '../../../ui/ComboArea/ui.desktop';
import RadioBoxOption from '../../../ui/RadioBoxOption/ui.desktop';
import Select from '../../../ui/Select/ui.desktop';
import TextBox from '../../../ui/TextBox/ui.desktop';
import FlexBox from '../../../ui/FlexBox/ui.desktop';
import Form from '../../../ui/Form/ui.desktop';
import { NodeType } from '../../OrganizationTree/helper';
import OrganizationPicker from '../../OrganizationPicker/component.view';
import Permissions from '../Permissions/component.desktop';
import { Mode } from './helper';
import ConfigBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop';

const selectOpitions = [{ showCustom: false, opition: __('永久有效') }, { showCustom: true, opition: __('自定义') }];

// SharerType 用户为1，部门值为2
const SharerType = { [NodeType.USER]: 1, [NodeType.DEPARTMENT]: 2, [NodeType.ORGANIZATION]: 2 };

const EMPTY_EXPIRE_DAYS = 0;

export default class Config extends ConfigBase {

    render() {
        return (
            <div className={styles['container']}>
                <Dialog
                    width={615}
                    title={this.props.mode === Mode.Edit ? __('编辑模板') : __('添加模板')}
                    onClose={this.close.bind(this)}
                >
                    <Panel>
                        <Panel.Main>
                            <div className={styles['container']}>
                                <Form>
                                    <Form.Row>
                                        <Form.Label align="top">
                                            {__('共享者：')}
                                        </Form.Label>
                                        <Form.Field>
                                            {
                                                this.props.mode === Mode.Edit && this.props.template.sharerInfos.some((info, key) => info.sharerId === '-2') ?
                                                    <TextBox width={240} disabled={true} value={__('所有用户')} /> :
                                                    <div className={styles['sharers-content']}>
                                                        <div className={styles['sharers-text']}>
                                                            <ComboArea
                                                                width={225}
                                                                uneditable={true}
                                                                minHeight={32}
                                                                value={this.state.template.shareInfos}
                                                                formatter={this.shareInfoFormatter}
                                                                onChange={value => { this.setShareInfos(value) }}
                                                            />
                                                        </div>
                                                        <div className={styles['form-data']}>
                                                            <Button onClick={this.openSharePicker.bind(this)}> {__('添加')} </Button>
                                                        </div>
                                                    </div>
                                            }
                                            {
                                                this.state.showShareInfosEmptyMsg ? <div className={styles['msg_text']}> {__('请添加共享者')}</div> : null
                                            }
                                        </Form.Field>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Label align="top">
                                            <label>{__('可设定的访问权限：')}</label>
                                        </Form.Label>
                                        <Form.Field>
                                            <FlexBox>
                                                <FlexBox.Item align="top">
                                                    <Permissions value={this.state.template.config.allowPerm} onPermChange={(checked, permission) => this.updateAllowPerm(checked, permission)}
                                                        onOwnerChange={(checked) => this.updateAllowOwner(checked)} owner={this.state.template.config.allowOwner} showOwner={!this.props.secretMode}>
                                                    </Permissions>
                                                </FlexBox.Item>
                                            </FlexBox>
                                        </Form.Field>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Label align="top">
                                            <label>{__('默认访问权限：')}</label>
                                        </Form.Label>
                                        <Form.Field>
                                            <FlexBox>
                                                <FlexBox.Item align="top">
                                                    <Permissions value={this.state.template.config.defaultPerm} disabledOptions={this.state.defaultDisabledOpitions} onPermChange={(checked, permission) => this.updateDefaultPerm(checked, permission)}
                                                        onOwnerChange={(checked) => this.updateDefaultOwner(checked)} owner={this.state.template.config.defaultOwner} showOwner={false}>
                                                    </Permissions>
                                                </FlexBox.Item>
                                            </FlexBox>
                                        </Form.Field>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Label align="top">
                                            <label>{__('访问有效期：')}</label>
                                        </Form.Label>
                                        <Form.Field>
                                            <div>
                                                <div className={styles['form-data']}>
                                                    <RadioBoxOption name="expiredays" value={false} checked={this.state.template.config.validExpireDays ? false : true} onChange={(check, value) => { this.onChangeLimit(check, value) }} >
                                                        {__('不限制天数设置，默认有效期：')}
                                                    </RadioBoxOption>
                                                </div>
                                                {
                                                    this.props.secretMode === false ?
                                                        this.renderDefaultExpireDaysByCustom(this.state.showCustom)
                                                        :
                                                        <div className={styles['form-data']}>
                                                            <div className={classnames(styles['form-data'], styles['input-space'])}>
                                                                <InlineValidateBox
                                                                    validateState={this.state.defaultExpireDayValidateState}
                                                                    validateMessages={{ [EMPTY_EXPIRE_DAYS]: __('此输入项不允许为空') }}
                                                                    validator={positiveInteger}
                                                                    value={this.state.template.config.defaultExpireDays}
                                                                    onChange={this.setDefaultPermTime.bind(this)}
                                                                    disabled={this.state.template.config.validExpireDays === true}
                                                                />
                                                            </div>
                                                            <div className={styles['form-data']}>
                                                                <span className={styles['day']}>{__('天')}</span>
                                                            </div>
                                                        </div>
                                                }
                                            </div>
                                            <div>
                                                <div className={styles['form-data']}>
                                                    <RadioBoxOption name="expiredays" value={true} checked={this.state.template.config.validExpireDays ? true : false} onChange={(check, value) => { this.onChangeLimit(check, value) }} >
                                                        {__('限制天数设置，且可设定的最大有效期：')}
                                                    </RadioBoxOption>
                                                </div>
                                                <div className={styles['form-data']}>
                                                    <InlineValidateBox
                                                        validateState={this.state.maxExpireDayValidateState}
                                                        validateMessages={{ [EMPTY_EXPIRE_DAYS]: __('此输入项不允许为空') }}
                                                        validator={positiveInteger}
                                                        value={this.state.template.config.maxExpireDays}
                                                        onChange={this.setMaxPermTime.bind(this)}
                                                        disabled={this.state.template.config.validExpireDays === false}
                                                    />
                                                </div>
                                                <div className={styles['form-data']}>
                                                    <span className={styles['day']}>{__('天')}</span>
                                                </div>
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                </Form>
                            </div>
                        </Panel.Main >
                        <Panel.Footer>
                            <Panel.Button type="submit" onClick={this.submit.bind(this)}>{__('确定')}</Panel.Button>
                            <Panel.Button onClick={this.close.bind(this)} >{__('取消')}</Panel.Button>
                        </Panel.Footer>
                    </Panel>
                    {
                        this.state.showSharePicker ?
                            <OrganizationPicker onCancel={this.closeSharePicker.bind(this)} title={__('添加共享者')} userid={session.get('userid')} onConfirm={(shareInfos) => this.addShareInfos(shareInfos)} convererOut={value => value = { sharerId: value.id, sharerName: value.name, sharerType: this.formatterType(value.type) }} selectType={[NodeType.DEPARTMENT, NodeType.ORGANIZATION, NodeType.USER]} />
                            :
                            null
                    }
                    {
                        this.state.existSharerNames && this.state.existSharerNames.length > 0 ? this.renderExistTemplatesDialog() : null
                    }
                </Dialog >
            </div >
        )
    }

    renderDefaultExpireDaysByCustom(showCustom) {
        return (
            showCustom ?
                <div className={styles['form-data']}>
                    <div className={styles['form-data']}>
                        <Select
                            onChange={this.handleSelect.bind(this)}
                            disabled={this.state.template.config.validExpireDays === true}
                            width={110}
                            menu={{ width: 110 }}>
                            {
                                selectOpitions.map(({ showCustom, opition }) => {
                                    return <Select.Option
                                        value={showCustom}
                                        selected={this.state.showCustom === showCustom}
                                    >
                                        {opition}
                                    </Select.Option>
                                })
                            }
                        </Select>
                    </div>
                    <div className={classnames(styles['form-data'], styles['input-space'])}>
                        <InlineValidateBox
                            validateState={this.state.defaultExpireDayValidateState}
                            validateMessages={{ [EMPTY_EXPIRE_DAYS]: __('此输入项不允许为空') }}
                            validator={positiveInteger} value={this.state.template.config.defaultExpireDays}
                            onChange={this.setDefaultPermTime.bind(this)}
                            disabled={this.state.template.config.validExpireDays === true}
                        />
                    </div>
                    <div className={styles['form-data']}>
                        <span className={styles['day']}>{__('天')}</span>
                    </div>
                </div> :
                <div className={styles['form-data']}>
                    <Select
                        onChange={this.handleSelect.bind(this)}
                        disabled={this.state.template.config.validExpireDays === true}
                        width={110}
                        menu={{ width: 110 }}>
                        {
                            selectOpitions.map(({ showCustom, opition }) => {
                                return <Select.Option
                                    value={showCustom}
                                    selected={this.state.showCustom === showCustom}
                                >
                                    {opition}
                                </Select.Option>
                            })
                        }
                    </Select>
                </div>
        )
    }


    // 已存在模板策略提示
    renderExistTemplatesDialog() {
        return (
            <MessageDialog onConfirm={this.back.bind(this)}>
                <p>{__('共享者${shareInfos}已存在模板策略，不能重复添加', { shareInfos: this.formatterShareInfos(this.state.existSharerNames) })}</p>
            </MessageDialog>
        )
    }

    // 有效期天数为空提示
    renderEmptyExpireDaysTips() {
        return (
            <FlexBox>
                <FlexBox.Item align="right">
                    <Tip>
                        <p><span className={styles['msg_text']}>{__('此输入项不允许为空')}</span></p>
                    </Tip>
                </FlexBox.Item>
            </FlexBox>
        )
    }

    formatterShareInfos(sharerNames) {
        return sharerNames.reduce((prevs, sharerName, index, array) => {
            if (sharerNames.length - 1 === index) {
                return prevs + '"' + sharerName + '"'
            } else {
                return prevs + '"' + sharerName + '"' + ','
            }

        }, '')
    }

    formatterType(type) {
        return SharerType[type]
    }
}
