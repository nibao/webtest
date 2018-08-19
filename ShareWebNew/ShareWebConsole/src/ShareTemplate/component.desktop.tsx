import * as React from 'react';
import * as classnames from 'classnames';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import SearchBox from '../../ui/SearchBox/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import ConfirmDialog from '../../ui/ConfirmDialog/ui.desktop';
import ToolBar from '../../ui/ToolBar/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import { getErrorTemplate, getErrorMessage } from '../../core/exception/exception';
import Config from './Config/component.desktop';
import ShareTemplateBase, { ErrorType } from './component.base';
import { Mode } from './Config/helper';
import * as styles from './styles.desktop.css';
import __ from './locale';
import * as edit from './assets/edit.png';

export default class ShareTemplate extends ShareTemplateBase {

    render() {
        return (
            <div className={ styles['container'] }>
                {
                    this.state.showConfig ?
                        <Config mode={ this.state.mode } secretMode={ this.state.secretMode } template={ this.state.select } onCancel={ this.onCancel.bind(this) } onSubmit={ this.onSubmit.bind(this) }
                            onError={ this.onShowError.bind(this) } />
                        :
                        null
                }
                {
                    this.state.errorType === ErrorType.NORMAL ?
                        null :
                        this.showErrorMsg(this.state.errorType)
                }
                {
                    this.state.showClearHistory ?
                        this.renderClearHistoryDialog()
                        :
                        null
                }
                <div className={ styles['datagrid'] }>
                    <span className={ styles['tips_text'] }>{ __('以下列表中的共享者，在发起内链共享时，将按照对应的模板策略，对访问者进行权限配置') }</span>
                    <span className={ styles['clear_history'] }><a onClick={ this.openClearHistory.bind(this) }>{ __('清除超出模板限制的历史内链共享') }</a> </span>
                </div>

                <div className={ styles['info-header'] }>
                    <ToolBar>
                        <ToolBar.Button icon={ '\uf018' } onClick={ this.addTemplate.bind(this) }>
                            { __('添加模板') }
                        </ToolBar.Button>
                        <ToolBar.Button icon={ '\uf01c' } onClick={ this.editTempate.bind(this) } disabled={ !this.state.select } fallback={ edit }>
                            { __('编辑模板') }
                        </ToolBar.Button>
                        <ToolBar.Button icon={ '\uf014' } onClick={ () => { this.deleteTemplate(this.state.select) } } disabled={ !this.state.select || (this.state.select.sharerInfos[0] && this.state.select.sharerInfos[0].sharerId === '-2') }>
                            { __('删除模板') }
                        </ToolBar.Button>
                        <div style={ { float: 'right' } }>
                            <SearchBox
                                placeholder={ __('搜索共享者') }
                                loader={ this.getTemplatesByKey.bind(this) }
                                onLoad={ data => { this.onLoad(data) } }
                                value={ this.state.searchKey }
                                onChange={ this.searchChange.bind(this) }
                                onFetch={ this.setLoadingStatus.bind(this) }
                            />
                        </div>
                    </ToolBar>
                </div>

                <DataGrid
                    headless={ true }
                    width={ '100%' }
                    height={ 500 }
                    data={ this.state.data }
                    select={ true }
                    onSelectionChange={ value => { this.onSelect(value) } }
                    getDefaultSelection={ this.setSelectTemplate.bind(this) }
                >
                    <DataGrid.Field
                        field="name"
                        width="450"
                        formatter={ (name, record) => (
                            <div className={ styles['table-row-data'] }>
                                <Form>
                                    <Form.Row>
                                        <Form.Label>
                                            <div className={ styles['row-left'] }>
                                                { __('共享者：') }
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <div className={ styles['row-padding'] }>
                                                <Text>
                                                    {
                                                        this.formatterShareInfos(record.sharerInfos)
                                                    }
                                                </Text>
                                            </div>
                                        </Form.Field>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Label>
                                            <div className={ styles['row-left'] }>
                                                { __('默认访问权限：') }
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <div className={ styles['row-padding'] }>
                                                <Text>
                                                    {
                                                        this.formatterDefaultPerm(record.config, this.state.secretMode)
                                                    }
                                                </Text>
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                </Form>
                            </div>
                        ) }
                    />
                    <DataGrid.Field
                        field="name"
                        width="450"
                        formatter={ (name, record) => (
                            <div className={ styles['table-row-data'] }>
                                <Form>
                                    <Form.Row>
                                        <Form.Label>
                                            <div className={ styles['row-right'] }>
                                                { __('可设定的访问权限：') }
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <div className={ styles['row-padding'] }>
                                                <Text>
                                                    {
                                                        this.formatterAllowPerm(record.config, this.state.secretMode)
                                                    }
                                                </Text>
                                            </div>
                                        </Form.Field>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Label>
                                            <div className={ styles['row-right'] }>
                                                { __('访问有效期：') }
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <div className={ styles['row-padding'] }>
                                                <Text>
                                                    {
                                                        this.formatterExpireDays(record.config)
                                                    }
                                                </Text>
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                </Form>
                            </div>
                        ) }
                    />
                </DataGrid>
            </div>
        )

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

    // 清除历史的提示
    renderClearHistoryDialog() {
        return (
            <ConfirmDialog onCancel={ this.closeClearHistory.bind(this) } onConfirm={ this.clearHistory.bind(this) }>
                <p>{ __('此操作将清除所有超出模板限制的历史内链共享，您确定要执行此操作吗？') }</p>
            </ConfirmDialog>
        )
    }

}