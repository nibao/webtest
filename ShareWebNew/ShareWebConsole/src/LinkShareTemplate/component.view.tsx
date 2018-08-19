import * as React from 'react';
import Button from '../../ui/Button/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import SearchBox from '../../ui/SearchBox/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import ToolBar from '../../ui/ToolBar/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import ConfirmDialog from '../../ui/ConfirmDialog/ui.desktop';
import { buildSelectionText, LinkSharePermissionOptions } from '../../core/permission/permission';
import { getErrorTemplate, getErrorMessage } from '../../core/exception/exception';
import LinkShareTemplateConfig from '../LinkShareTemplateConfig/component.view';
import * as styles from './styles.view';
import LinkShareTemplateBase from './component.base';
import { EditTempalteStatus, ErrorType } from './component.base';
import * as deleteIcon from './assets.delete.png';
import __ from './locale';
import * as edit from './assets/edit.png'

export default class LinkShareTemplate extends LinkShareTemplateBase {
    render() {
        return (
            <div className={ styles['container'] }>

                <div>
                    { __('以下列表中的共享者，在开启外链时，将按照对应的模板策略，发起外链共享') }
                </div>
                <div className={ styles['info-header'] }>
                    <ToolBar>
                        <ToolBar.Button onClick={ this.triggerCreate.bind(this) } icon={ '\uf018' }> { __('添加模板') }</ToolBar.Button>
                        <ToolBar.Button disabled={ !this.state.currentData } onClick={ this.triggerEdit.bind(this) } icon={ '\uf01c' } fallback={ edit }> { __('编辑模板') } </ToolBar.Button>
                        <ToolBar.Button disabled={ !this.state.currentData || (this.state.currentData.sharerInfos[0] && this.state.currentData.sharerInfos[0].sharerId === '-2') } onClick={ () => { this.deleteData(this.state.currentData) } } icon={ '\uf014' }>{ __('删除模板') } </ToolBar.Button>
                        <div style={ { float: 'right' } }>
                            <SearchBox
                                value={ this.state.searchKey }
                                placeholder={ __('搜索共享者') }
                                onChange={ this.searchChange.bind(this) }
                                loader={ this.searchData.bind(this) }
                                onFetch={ this.setLoadingStatus.bind(this) }
                                onLoad={ data => { this.updateTemplateData(data) } }
                            />
                        </div>
                    </ToolBar>

                </div>
                <DataGrid
                    headless={ true }
                    data={ this.state.templateData }
                    select={ true }
                    height={ 480 }
                    onSelectionChange={ value => { this.selectData(value) } }
                    getDefaultSelection={ this.selectChangedData.bind(this) }
                >
                    <DataGrid.Field
                        field="name"
                        width="230"
                        formatter={ (name, record) => (
                            <div>
                                <Form>
                                    <Form.Row>
                                        <Form.Label>
                                            <div className={ styles['row-padding'] }>
                                                { __('共享者：') }
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <div className={ styles['row-padding-text'] }>
                                                <Text>
                                                    {
                                                        record.sharerInfos[0].sharerId === '-2' ? __('所有用户') :
                                                            record.sharerInfos.map(value => { return value.sharerName }).join(',')
                                                    }
                                                </Text>
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Label>
                                            <div className={ styles['row-padding'] }>
                                                { __('外链有效期：') }
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <div className={ styles['row-padding'] }>
                                                {
                                                    record.config.limitExpireDays ?
                                                        __('限制天数设置') + __('（最大有效期：${expire}天）', { 'expire': record.config.allowExpireDays }) :
                                                        __('不限制天数设置') + __('（默认有效期：${expire}天）', { 'expire': record.config.allowExpireDays })
                                                }
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                </Form>
                            </div>
                        ) }
                    >
                    </DataGrid.Field>
                    <DataGrid.Field
                        field="perm"
                        width="200"
                        formatter={ (name, record) => (
                            <div>
                                <Form>
                                    <Form.Row>
                                        <Form.Label>
                                            <div className={ styles['row-padding'] }>
                                                { __('可设定的访问权限：') }
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <div className={ styles['row-padding'] }>
                                                <Text>
                                                    {
                                                        buildSelectionText(LinkSharePermissionOptions, { allow: record.config.allowPerm })
                                                    }
                                                </Text>
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Label>
                                            <div className={ styles['row-padding'] }>
                                                { __('访问密码：') }
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <div className={ styles['row-padding'] }>
                                                {
                                                    record.config.accessPassword ?
                                                        __('强制使用') :
                                                        __('非强制使用')
                                                }
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                </Form>
                            </div>
                        ) }
                    >
                    </DataGrid.Field>
                    <DataGrid.Field
                        field="times"
                        width="200"
                        formatter={ (name, record) => (
                            <div>
                                <Form>
                                    <Form.Row>
                                        <Form.Label>
                                            <div className={ styles['row-padding'] }>
                                                { __('默认访问权限：') }
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <div className={ styles['row-padding'] }>
                                                <Text>
                                                    {
                                                        buildSelectionText(LinkSharePermissionOptions, { allow: record.config.defaultPerm })
                                                    }
                                                </Text>
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Label>
                                            <div className={ styles['row-padding'] }>
                                                { __('外链打开次数：') }
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <div className={ styles['row-padding'] }>
                                                {
                                                    record.config.limitAccessTimes ?
                                                        __('限制') + __('（可设定最多次数：${time}次）', { 'time': record.config.allowAccessTimes }) :
                                                        __('不限制') + __('（默认次数：${time}次）', { 'time': record.config.allowAccessTimes })
                                                }
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                </Form>
                            </div>
                        ) }
                    >
                    </DataGrid.Field>
                </DataGrid>

                {
                    this.state.showEditDialog === EditTempalteStatus.NORMAL ?
                        null :
                        this.getEditDialog(this.state.showEditDialog)
                }
                {
                    this.state.errorType === ErrorType.NORMAL ?
                        null :
                        this.showErrorMsg(this.state.errorType)
                }
            </div>)
    }

    getEditDialog(editType) {
        switch (editType) {
            case EditTempalteStatus.CREATE:
                return <LinkShareTemplateConfig
                    mode={ editType }
                    onError={ this.onShowError.bind(this) }
                    onCancelSetTemplate={ () => { this.cancelSetData() } }
                    onConfirmSetTemplate={ () => { this.saveSetData() } }
                />;
            case EditTempalteStatus.EDIT:
                return <LinkShareTemplateConfig
                    mode={ editType }
                    template={ this.state.currentData }
                    onError={ this.onShowError.bind(this) }
                    onCancelSetTemplate={ () => { this.cancelSetData() } }
                    onConfirmSetTemplate={ () => { this.saveSetData() } }
                />;
        }
    }

    showErrorMsg(error) {
        return (
            <MessageDialog onConfirm={ this.closeErrorDialog.bind(this) }>
                <p>
                    {
                        getErrorMessage(error)
                    }
                </p>
            </MessageDialog>
        )
    }
}