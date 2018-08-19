import * as React from 'react';
import * as classnames from 'classnames';
import session from '../../util/session/session';
import { positiveIntegerAndMaxLength } from '../../util/validators/validators';
import SearchBox from '../../ui/SearchBox/ui.desktop';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import ToolBar from '../../ui/ToolBar/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import ValidateBox from '../../ui/ValidateBox/ui.desktop';
import LinkChip from '../../ui/LinkChip/ui.desktop';
import EditSystemManager from '../EditSystemManager/component.view';
import OrganizationPicker from '../OrganizationPicker/component.view';
import { NodeType } from '../OrganizationTree/helper';
import DownloadLimitBase from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';


const EMPTY_LIMIT_NUM = 0;

export default class DownloadLimit extends DownloadLimitBase {
    render() {
        return (
            <div className={styles['container']}>
                {
                    this.state.showSetMail ?
                        (
                            <EditSystemManager
                                adminId={this.props.adminId}
                                account={this.props.account}
                                displayName={this.props.displayName}
                                onEditSuccess={this.editManagerSuccess.bind(this)}
                                onEditCancel={this.hideSetMail.bind(this)}
                                doRedirect={this.props.doRedirect}
                            />
                        ) :
                        null
                }
                {
                    this.state.showOrganizationPicker ?
                        <OrganizationPicker
                            userid={session.get('userid')}
                            convererOut={value => { return this.convererOutData(value) }}
                            selectType={[NodeType.DEPARTMENT, NodeType.ORGANIZATION, NodeType.USER]}
                            onCancel={() => { this.toggleAddLimitDownload(false) }}
                            onConfirm={limitDownload => { this.confirmAddLimitDownload(limitDownload) }}
                            title={__('添加用户')}
                            data={this.state.editUsers}
                        />
                        :
                        null
                }
                {
                    this.state.showEditNum ?
                        this.renderEditLimit()
                        :
                        null
                }
                <CheckBoxOption checked={this.state.limit} onChange={this.changeLimit.bind(this)} >
                    {__('限制以下用户个人每日下载文件最大次数，未添加的用户不受限制')}
                </CheckBoxOption>
                <div className={classnames(styles['download-limit'], { [styles['disabled']]: !this.state.limit })}>
                    <div className={styles['sub-title']}>
                        {__('请及时')}
                        <LinkChip className={styles['link']} onClick={this.showSetMail.bind(this)}>{__('设置邮箱')}</LinkChip>
                        {__('，当用户达到下载阈值时，您将收到邮件通知')}
                    </div>

                    <div className={styles['info-header']}>
                        <ToolBar>
                            <ToolBar.Button icon={'\uf018'} onClick={this.addUser.bind(this)} disabled={!this.state.limit}>
                                {__('添加用户')}
                            </ToolBar.Button>

                            <div style={{ float: 'right' }}>
                                <SearchBox
                                    placeholder={__('搜索')}
                                    loader={this.searchData.bind(this)}
                                    onLoad={this.onLoad.bind(this)}
                                    value={this.state.searchKey}
                                    onChange={this.searchChange.bind(this)}
                                    onFetch={this.setLoadingStatus.bind(this)}
                                    disabled={!this.state.limit}
                                />
                            </div>
                        </ToolBar>
                    </div>


                    <DataGrid
                        width={'100%'}
                        height={500}
                        data={this.state.data}
                        select={true}
                    >
                        <DataGrid.Field
                            field="name"
                            width="400"
                            label={__('用户')}
                            formatter={(users, record) => (
                                <div className={styles['table-row-data']}>
                                    <div className={styles['field_left']}>
                                        <Text>
                                            {
                                                [...record.userInfos, ...record.depInfos].map(value => { return value.objectName }).join(',')
                                            }
                                        </Text>
                                    </div>
                                    <div className={styles['form-data']}>
                                        <UIIcon size={16} code={'\uf01c'} onClick={() => this.editUser(record.userInfos, record.depInfos, record)} disabled={!this.state.limit} />
                                    </div>
                                </div>
                            )}
                        />
                        <DataGrid.Field
                            field="name"
                            width="400"
                            label={__('个人每日下载文件最大次数')}
                            formatter={(download, record) => (
                                <div className={styles['table-row-data']}>
                                    <div className={styles['field_left']} title={record.limitValue}>
                                        {record.limitValue}
                                    </div>
                                    <div className={styles['form-data']}>
                                        <UIIcon size={16} code={'\uf01c'} onClick={() => this.editLimitNum(record.limitValue, record)} disabled={!this.state.limit} />
                                    </div>
                                </div>
                            )}
                        />
                        <DataGrid.Field
                            field="name"
                            width="200"
                            label={__('操作')}
                            formatter={(name, record) => (
                                <div className={styles['table-row-data']}>
                                    <div className={styles['form-data']}>
                                        <UIIcon size={16} code={'\uf013'} onClick={() => { this.deleteDownload(record.id, record) }} disabled={!this.state.limit} />
                                    </div>
                                </div>
                            )}
                        />
                    </DataGrid>
                </div>
            </div>
        )
    }

    renderEditLimit() {
        return (
            <Dialog
                title={__('设置')}
                onClose={this.cancelEditLimitNum.bind(this)}
            >
                <Panel>
                    <Panel.Main>
                        <div className={styles['form-data']}>
                            {__('个人每日下载文件最大次数：')}
                        </div>
                        <div className={classnames(styles['form-data'], styles['input-space'])}>
                            <ValidateBox
                                width={50}
                                validateState={this.state.validateState}
                                validateMessages={{ [EMPTY_LIMIT_NUM]: __('此输入项不允许为空') }}
                                validator={positiveIntegerAndMaxLength(5)}
                                value={this.state.limitNum}
                                onChange={value => { this.setLimitNum(value) }}
                            >
                            </ValidateBox>
                        </div>
                        <div className={classnames(styles['form-data'], styles['input-space'])}>
                            {__(' 次')}
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button type="submit" onClick={this.set.bind(this)}>
                            {__('确定')}
                        </Panel.Button>
                        <Panel.Button type="submit" onClick={this.cancelEditLimitNum.bind(this)}>
                            {__('取消')}
                        </Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog>

        )
    }

}