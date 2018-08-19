import * as React from 'react'
import * as classnames from 'classnames'
import DocLibAccessBase, { Status, ValidateStates, ValidateMessages, ErrMsgs } from './component.base'
import ToolBar from '../../ui/ToolBar/ui.desktop'
import SearchBox from '../../ui/SearchBox/ui.desktop'
import ValidateBox from '../../ui/ValidateBox/ui.desktop'
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop'
import DataGrid from '../../ui/DataGrid/ui.desktop'
import UIIcon from '../../ui/UIIcon/ui.desktop'
import Text from '../../ui/Text/ui.desktop'
import DocLibSelector from '../DocLibSelector/component.view'
import MessageDialog from '../../ui/MessageDialog/ui.desktop'
import __ from './locale'
import * as styles from './styles.view.css'
import * as editImg from './assets/images/edit.png'

export default class DocLibAccess extends DocLibAccessBase {
    render() {
        let { netInfos, docLibInfos, editing, currentNet, enabled, ipValidateState, subNetMaskValidateState, errors } = this.state,
            netDisabled = !enabled,
            docLibDisabled = !(enabled && currentNet && currentNet.id) || editing;
        return (
            <div className={styles['container']}>
                <div>
                    <CheckBoxOption checked={enabled} onChange={this.handleToggle.bind(this)}>
                        {__('启用文档库IP网段限制：请将IP网段与文档库（包括归档库）绑定，被绑定的文档库只能在指定的网段内访问，未被绑定的文档库不受限制。')}
                    </CheckBoxOption>
                </div>
                <div>
                    <div className={classnames(styles['fl'], styles['net-container'], { [styles['disabled']]: netDisabled })}>
                        <div className={styles['net-wrapper']}>
                            <div className={styles['info-header']}>
                                <ToolBar>
                                    <ToolBar.Button icon={'\uf018'} onClick={this.handleAddNet.bind(this)} disabled={netDisabled}>{__('添加网段')}</ToolBar.Button>
                                    <div className={styles['fr']}>
                                        <SearchBox
                                            disabled={netDisabled}
                                            placeholder={__('请输入IP')}
                                            loader={this.searchNet.bind(this)}
                                            onLoad={this.handleSearchNetLoaded.bind(this)}
                                        />
                                    </div>
                                </ToolBar>
                            </div>
                            <DataGrid height="450" className={styles['data-grid']} select={!editing} data={netInfos} onSelectionChange={this.handleSelectNet.bind(this)}>
                                <DataGrid.Field
                                    field="ip"
                                    label={__('IP地址')}
                                    width="100"
                                    formatter={
                                        (ip, netInfo) => (editing && currentNet.id === netInfo.id ?
                                            <div className={styles['ip-input']}>
                                                <ValidateBox width={130} autoFocus={true} validateMessages={ValidateMessages} validateState={ipValidateState} value={currentNet.ip} onChange={ip => this.handleNetChange({ ip })} onBlur={this.handleNetBlur.bind(this)} />
                                            </div> :
                                            <div>{ip}</div>
                                        )
                                    }
                                />
                                <DataGrid.Field
                                    field="subNetMask"
                                    label={__('子网掩码')}
                                    width="100"
                                    formatter={
                                        (subNetMask, netInfo) => (editing && currentNet.id === netInfo.id ?
                                            <div className={styles['subnetmask-input']}>
                                                <ValidateBox width={130} validateMessages={ValidateMessages} validateState={subNetMaskValidateState} value={currentNet.subNetMask} onChange={subNetMask => this.handleNetChange({ subNetMask })} onBlur={this.handleNetBlur.bind(this)} />
                                            </div> :
                                            <div>{subNetMask}</div>
                                        )
                                    }
                                />
                                <DataGrid.Field
                                    field="id"
                                    label={__('操作')}
                                    width="40"
                                    formatter={
                                        (id, netInfo) => {
                                            if (editing) {
                                                return currentNet.id === netInfo.id ?
                                                    <div>
                                                        <UIIcon
                                                            code={'\uf00a'} color="#9a9a9a" size="20px"
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                this.handleSubmitNet()
                                                            }}
                                                            className={styles['fl']}
                                                        />
                                                        <UIIcon code={'\uf017'} color="#9a9a9a" size="20px"
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                this.handleCancelEditNet(netInfo)
                                                            }}
                                                            className={styles['fr']} />
                                                    </div> : null
                                            } else {
                                                return <div>
                                                    <UIIcon
                                                        code={'\uf01c'} color="#9a9a9a" size="20px" fallback={editImg}
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            this.handleEditNet(netInfo)
                                                        }}
                                                        className={styles['fl']} />
                                                    <UIIcon
                                                        code={'\uf013'} color="#9a9a9a" size="20px"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            this.handleDeleteNet(netInfo)
                                                        }}
                                                        className={styles['fr']} />
                                                </div>
                                            }
                                        }
                                    }
                                />
                            </DataGrid>
                        </div>
                    </div>
                    <div className={classnames(styles['fr'], styles['doclib-container'], { [styles['disabled']]: docLibDisabled })}>
                        <div className={styles['doclib-wrapper']}>
                            <div className={styles['info-header']}>
                                <ToolBar>
                                    <ToolBar.Button icon={'\uf018'} onClick={this.handleAddDocLib.bind(this)} disabled={docLibDisabled}>{__('添加文档库')}</ToolBar.Button>
                                    <div className={styles['fr']}>
                                        <SearchBox
                                            disabled={docLibDisabled}
                                            placeholder={__('请输入库名称')}
                                            loader={this.searchDocLib.bind(this)}
                                            onLoad={this.handleSearchDocLibLoaded.bind(this)}
                                        />
                                    </div>
                                </ToolBar>
                            </div>
                            <DataGrid height="450" className={styles['data-grid']} data={docLibInfos}>
                                <DataGrid.Field
                                    field="name"
                                    label={__('绑定的文档库')}
                                    width="200"
                                    formatter={name => <Text>{name}</Text>}
                                />
                                <DataGrid.Field
                                    field="id"
                                    label={__('操作')}
                                    width="40"
                                    formatter={
                                        (id, lib) => (
                                            <UIIcon
                                                code={'\uf013'} color="#9a9a9a" size="20px"
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    this.handleDeleteDocLib(lib)
                                                }} />
                                        )
                                    }
                                />
                            </DataGrid>
                        </div>
                    </div>
                </div>
                {
                    this.state.status === Status.AddDocLib ?
                        <DocLibSelector docLibs={[0, 1]} onConfirmSelectDocLib={this.handleSubmitDocLib.bind(this)} onCancelSelectDocLib={this.handleCancelAddDocLib.bind(this)} /> :
                        null
                }
                {
                    errors.length ?
                        <MessageDialog onConfirm={this.handleConfirmError.bind(this)}>
                            {ErrMsgs[errors[0].error.errMsg]}
                        </MessageDialog>
                        : null
                }
            </div>
        )
    }
}