import * as React from 'react';
import * as classnames from 'classnames'
import { values } from 'lodash';
import { Button, ValidateBox, Form, Wizard, Control, Select, UIIcon, Title, AutoComplete, AutoCompleteList, Text, MessageDialog, ErrorDialog, TextBox } from '../../ui/ui.desktop';
import OrganizationTree from '../OrganizationTree/component';
import DocLibrarySeletor from '../DocLibrarySeletor/component.view';
import SearchDep from '../SearchDep/component.desktop';
import FileFlowBase from './component.base';
import { DialogStatus, FlowNameValidateStatus, FileLocationStatus } from './component.base'
import { getCurrentAuditModel } from './helper';
import * as styles from './styles.view.css';
import __ from './locale';
import { formatText } from '../../../ShareWebComponents/src/Message2/RenderMsgs/helper'

export default class FileFlow extends FileFlowBase {
    render() {
        return (
            <div className={styles['container']}>
                {
                    < Wizard
                        title={this.getWizardTitle()}
                        onCancel={this.cancelCreateFlow.bind(this)}
                        onFinish={this.completeCreateFlow.bind(this)}
                    >
                        <Wizard.Step
                            title={__('第一步：定义流程')}
                            onBeforeLeave={this.getNameLocationValidate.bind(this)}
                        >
                            <Form>
                                <Form.Row>
                                    <span className={styles['folw-name-label']}>
                                        {__('流程名称：')}
                                    </span>
                                    <ValidateBox
                                        className={styles['flow-name-validateBox']}
                                        value={this.state.flowName}
                                        onChange={(value) => this.changeFlowName(value)}
                                        validateState={this.state.flowNameValidateStatus}
                                        validateMessages={{
                                            [FlowNameValidateStatus.Empty]: __('此输入项不允许为空'),
                                            [FlowNameValidateStatus.NameIllegal]: __('不能包含 / : * ? " < > | 特殊字符，请重新输入'),
                                            [FlowNameValidateStatus.NameAlreadyExist]: __('该流程名称已存在，请重新输入')
                                        }}
                                    />
                                </Form.Row>
                                <Form.Row>
                                    <div className={styles['file-location']}>
                                        {__('文档最终保存位置：')}
                                    </div>
                                </Form.Row>
                                <Form.Row>
                                    <Title
                                        content={
                                            this.state.fileLocationFormGns !== '' ?
                                                this.state.fileLocationFormGns
                                                : null
                                        }
                                    >
                                        <ValidateBox
                                            className={styles['file-location-control']}
                                            value={this.state.fileLocationFormGns}
                                            readOnly={true}
                                            validateState={this.state.fileLocationStatus}
                                            validateMessages={{
                                                [FileLocationStatus.Empty]: __('此输入项不允许为空')
                                            }}
                                        />
                                    </Title>
                                    <Button
                                        onClick={this.updateDocTree.bind(this)}
                                        className={styles['browser-button']}
                                    >
                                        {__('浏览')}
                                    </Button>
                                </Form.Row>
                            </Form>
                        </Wizard.Step>

                        <Wizard.Step
                            title={__('第二步：选择审核模式')}
                            onBeforeLeave={this.isSelectedAccessorInfosValidate.bind(this)}
                        >
                            <div className={styles['audit-model']}>
                                <span className={styles['audit-model-label']}>
                                    {__('审核模式：')}
                                </span>
                                <Select
                                    width={346}
                                    value={this.state.auditModel}
                                    onChange={(value) => { this.updateAuditModel(value) }}
                                    menu={{ width: 346 }}
                                >
                                    <Select.Option value={'one'}>{__('同级审核')}</Select.Option>
                                    <Select.Option value={'all'}>{__('汇签审核')}</Select.Option>
                                    <Select.Option value={'level'}>{__('逐级审核')}</Select.Option>
                                </Select>
                                <Title
                                    content={
                                        __('同级审核：任意一位审核员审核通过或否决，流程结束；汇签审核：多位审核员全部审核通过，流程结束，其中任意一方否决，流程结束；逐级审核：一级审批员审核通过后，二级审核员继续审核，直至所有审核员审核通过，其中任一层级否决，流程结束')
                                    }
                                >
                                    <UIIcon
                                        className={styles['help-uiicon']}
                                        size="16"
                                        color={'#028afe'}
                                        code={'\uf055'}
                                    />
                                </Title>
                            </div>

                            <div className={styles['search-info']}>
                                <AutoComplete
                                    ref="autocomplete"
                                    placeholder={__('查找审核员')}
                                    missingMessage={__('未找到匹配的结果')}
                                    loader={this.getAccessorInfosByKey.bind(this)}
                                    onLoad={data => { this.getAccessorSearchResultByKey(data) }}
                                    autoFocus={false}
                                >
                                    {
                                        this.state.accessorSearchResult && this.state.accessorSearchResult.length ?
                                            (
                                                <AutoCompleteList>
                                                    {
                                                        this.state.accessorSearchResult.map(item =>

                                                            (<AutoCompleteList.Item>
                                                                <Title
                                                                    content={item.displayName}
                                                                >
                                                                    <a
                                                                        href="javascript:void(0);"
                                                                        className={styles['search-item']}
                                                                        onClick={() => this.selectAccessor(item)}
                                                                    >
                                                                        {item.displayName}
                                                                    </a>
                                                                </Title>
                                                            </AutoCompleteList.Item>)
                                                        )
                                                    }
                                                </AutoCompleteList>
                                            ) : null
                                    }
                                </AutoComplete>
                                <div className={classnames(styles['all-accessor-display-name'], styles['accessor-display-name-common'])}>
                                    <ul className={styles['display-name-ul-common']}>
                                        {
                                            this.state.allAccessorInfos.map((currentAccessorInfo) => {
                                                return (
                                                    <li
                                                        className={styles['accessor-display-name-item']}
                                                    >
                                                        <div
                                                            className={styles['display-name-item']}
                                                            onClick={() => this.selectAccessor(currentAccessorInfo)}
                                                        >
                                                            <UIIcon
                                                                className={styles['uiicon-person']}
                                                                size={13}
                                                                code={'\uf007'}
                                                            />
                                                            <div className={styles['display-name']}>
                                                                <a href="javascript:void(0);">
                                                                    <Title
                                                                        content={currentAccessorInfo.displayName}
                                                                    >
                                                                        <span className={styles['underline']}>{currentAccessorInfo.displayName}</span>
                                                                    </Title>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className={styles['display-info']}>
                                <div className={styles['display-info-tips']}>
                                    <Title
                                        content={`${this.state.flowName}`}
                                    >
                                        <span>
                                            <span className={classnames(styles['display-more'], styles['accessor-position'])}>

                                                {this.state.flowName}
                                            </span>
                                            {__(' 的审核员：')}
                                        </span>
                                    </Title>
                                    <span>
                                        <Button
                                            onClick={this.emptySelectedAccessor.bind(this)}
                                            className={styles['clear-button']}
                                            disabled={this.state.selectedAccessorInfos.length === 0}
                                        >
                                            {__('清空')}
                                        </Button>
                                    </span>
                                </div>
                                <div className={classnames(styles['all-selected-accessor-display-name'], styles['accessor-display-name-common'])} >
                                    <ul className={styles['display-name-ul-common']}>
                                        {
                                            this.state.selectedAccessorInfos.map((currentSelectedAccessorInfo, index) => {
                                                return (
                                                    <li
                                                        style={{ position: 'relative' }}
                                                        className={styles['selected-accessor-display-name-item-common']}
                                                    >
                                                        <div className={styles['selected-accessor-display-name-item']}>
                                                            <Title
                                                                content={
                                                                    this.state.auditModel === 'level' ?
                                                                        `${__('${number}级', { 'number': index + 1 })} ${currentSelectedAccessorInfo.displayName}`
                                                                        : `${currentSelectedAccessorInfo.displayName}`
                                                                }
                                                            >
                                                                {
                                                                    this.state.auditModel === 'level' ?
                                                                        <span className={styles['selected-index']}>
                                                                            {`${__('${number}级', { 'number': index + 1 })}`}
                                                                        </span>
                                                                        : null
                                                                }
                                                                {
                                                                    <span className={styles['selected-display-name-common']}>
                                                                        {
                                                                            currentSelectedAccessorInfo.displayName
                                                                        }
                                                                    </span>
                                                                }
                                                            </Title>
                                                        </div>
                                                        <span className={styles['selected-data-del-common']}>
                                                            <UIIcon
                                                                size={13}
                                                                code={'\uf013'}
                                                                onClick={() => { this.deleteSelectedAccessor(currentSelectedAccessorInfo) }}
                                                            />
                                                        </span>

                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                        </Wizard.Step>

                        <Wizard.Step title={__('第三步：选择适用范围')}>
                            <div className={styles['dep-search']}>
                                <div className={styles['dep-search-frame']}>
                                    <SearchDep
                                        onSelectDep={value => { this.updateApplicativeRangeResultBySearch(value) }}
                                        width="222"
                                        selectType={this.props.selectType}
                                        userid={this.props.userid}
                                    />
                                </div>
                                <div className={styles['accessor-display-name-common']}>
                                    <OrganizationTree
                                        userid={this.props.userid}
                                        selectType={this.props.selectType}
                                        onSelectionChange={value => this.updateApplicativeRangeResult(value)}
                                    />
                                </div>
                            </div>
                            <div className={classnames(styles['search-display'], styles['dep-search-common'])}>
                                <div className={styles['search-display-tips']}>
                                    <Title
                                        content={`${this.state.flowName}`}
                                    >
                                        <span>
                                            <span className={styles['display-more']}>
                                                {this.state.flowName}
                                            </span>
                                            {__(' 的适用范围：')}
                                        </span>
                                    </Title>
                                    <Button
                                        onClick={this.emptyApplicativeRangeResult.bind(this)}
                                        disabled={this.state.applicativeRangeResult.length === 0}
                                        className={styles['delete-range-button']}
                                    >
                                        {__('清空')}
                                    </Button>
                                </div>
                                <div className={styles['accessor-display-name-common']}>
                                    <ul>
                                        {
                                            this.state.applicativeRangeResult.map((applicativeRange) => {
                                                return (
                                                    <li
                                                        className={styles['selected-range-li']}
                                                    >
                                                        <Text className={classnames(styles['selected-display-name-common'], styles['selected-range'])}>
                                                            {
                                                                applicativeRange.name
                                                                || applicativeRange.departmentName
                                                                || applicativeRange.displayName
                                                                || applicativeRange.user.displayName
                                                            }
                                                        </Text>
                                                        <span className={classnames(styles['selected-data-del-common'], styles['delete-range-uiicon'])}>
                                                            <UIIcon
                                                                size={13}
                                                                code={'\uf013'}
                                                                onClick={() => { this.deleteApplicativeRangeResult(applicativeRange) }}
                                                            />
                                                        </span>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                        </Wizard.Step>
                    </Wizard>
                }

                {
                    this.state.isPickingDest ?
                        <DocLibrarySeletor
                            userid={this.props.userid}
                            onConfirmSelectDocLib={this.onBrowseConfirm.bind(this)}
                            onCancelSelectDocLib={this.onBrowseCancel.bind(this)}
                        />
                        : null
                }

                {
                    this.state.dialogStatus === DialogStatus.AccessorCountTips
                        || this.state.dialogStatus === DialogStatus.SelectedAccessorInfosEmpty
                        || this.state.dialogStatus === DialogStatus.applicativeRangeResultEmpyt ?
                        <MessageDialog
                            onConfirm={this.closeDialog.bind(this)}
                        >
                            {
                                this.getMessagesTips()
                            }
                        </MessageDialog>
                        : null
                }

                {
                    this.state.dialogStatus === DialogStatus.CreateError
                        || this.state.dialogStatus === DialogStatus.EditError ?
                        <ErrorDialog
                            onConfirm={this.closeDialog.bind(this)}
                        >
                            <ErrorDialog.Title>
                                {this.getErrorMsgTitle()}
                            </ErrorDialog.Title>
                            <ErrorDialog.Detail>
                                {this.state.errMsg}
                            </ErrorDialog.Detail>
                        </ErrorDialog>
                        : null
                }
            </div>
        )
    }

    /**
     * 获取错误提示 title
     */
    getErrorMsgTitle() {
        switch (this.state.dialogStatus) {
            case DialogStatus.CreateError:
                return __('创建流程失败,错误原因如下：')
            case DialogStatus.EditError:
                return __('编辑流程失败,错误原因如下：')
        }
    }

    /**
     * 选择审核员时 MessageDialog 提示信息
     */
    getMessagesTips() {
        switch (this.state.dialogStatus) {
            case DialogStatus.AccessorCountTips:
                return `${getCurrentAuditModel(this.state.auditModel)}${__('模式下至少需要两位审核员')}`
            case DialogStatus.SelectedAccessorInfosEmpty:
                return __('审核员不允许为空')
            case DialogStatus.applicativeRangeResultEmpyt:
                return __('适用范围不允许为空')
        }
    }

    /**
     * 根据创建流程和编辑流程两种不同的状态,获取不同的 Wizard title
     */
    getWizardTitle() {
        return _.values(this.props.process).length === 0 ?
            __('创建流程')
            : __('编辑流程')
    }
}