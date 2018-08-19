import * as React from 'react';
import * as classnames from 'classnames';
import { formatTime, shrinkText, decorateText } from '../../util/formatters/formatters';
import SearchBox from '../../ui/SearchBox/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import TextArea from '../../ui/TextArea/ui.desktop';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import ToolBar from '../../ui/ToolBar/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop';
import RadioBoxOption from '../../ui/RadioBoxOption/ui.desktop';
import ConfirmDialog from '../../ui/ConfirmDialog/ui.desktop';
import { getIcon } from '../iconHelper';
import IllegalDocSeparationBase from './component.base';
import ConfirmDelete from './ConfirmDelete/component.view';
import ConfirmRestore from './ConfirmRestore/component.view';
import WithinAppealValidity from './WithinAppealValidity/component.view';
import { CASE, ApprovalStatus } from './helper';
import * as styles from './styles.desktop';
import __ from './locale';

export default class IllegalDocSeparation extends IllegalDocSeparationBase {

    render() {
        return (
            <div className={styles['container']}>
                {
                    this.renderDataGrid()
                }
                {
                    this.state.confirmDelete ?
                        <ConfirmDelete
                            onConfirm={this.comfirmDeleteFiles.bind(this)}
                            onCancel={this.cancelDelete.bind(this)}
                        />
                        : null
                }
                {
                    this.state.toggleConfirmRevert ?
                        <ConfirmRestore
                            onConfirm={this.confirmRevertFiles.bind(this)}
                            onCancel={this.cancelRevert.bind(this)}
                        />
                        : null
                }
                {
                    this.state.toggleCheckVersions ? this.renderVersion() : null
                }
                {
                    this.state.errorQueue.length ? this.renderHandlingError() : null
                }
                {
                    this.state.withinAppealValidity ?
                        <WithinAppealValidity
                            onConfirm={this.deleteIllegalDoc.bind(this)}
                            onCancel={() => { this.setState({ withinAppealValidity: false }) }}
                        />
                        : null
                }
                {
                    this.state.showAppealApproval ? this.renderAppealApproval(this.fileInApproval, this.state.disableApprovalConfirm) : null
                }
            </div>
        )
    }

    renderDataGrid() {
        const { count, illegalFileList, page, searchKey, inFetching, viewAppealedOnly, selections, fileNeedReview } = this.state;
        return (
            <div>
                <ToolBar>
                    <ToolBar.Button
                        icon={'\uf017'}
                        onClick={this.revertIllegalDoc.bind(this)}
                        disabled={selections.length === 0}
                    >
                        {__('还原')}
                    </ToolBar.Button>
                    <ToolBar.Button
                        icon={'\uf014'}
                        onClick={this.toggleConfirmDelete.bind(this)}
                        disabled={selections.length === 0}
                    >
                        {__('删除')}
                    </ToolBar.Button>
                    <div className={styles['reserve-complaint']}>
                        <CheckBoxOption
                            onChange={checked => this.changeViewAppealed(checked)}
                            checked={viewAppealedOnly}
                        >
                            {__('只看申诉的文件')}
                        </CheckBoxOption>
                    </div>
                    <div className={styles['search-box']}>
                        <SearchBox
                            ref="searchbox"
                            className={styles['search-width']}
                            placeholder={__('输入文件名/所在文件夹名/隔离原因')}
                            value={searchKey}
                            onChange={this.changeSearchKey.bind(this)}
                            loader={this.searchIllegalDoc.bind(this)}
                            onFetch={this.setLoadingStatus.bind(this)}
                            onLoad={data => { this.loadSearchResult(data) }}
                        />
                    </div>
                </ToolBar>
                <div className={classnames({ [styles['on-fetch']]: inFetching })}>
                    <DataGrid
                        height={500}
                        data={illegalFileList}
                        select={{ multi: true }}
                        strap={true}
                        paginator={{ total: count, page, limit: this.DEFAULT_PAGESIZE }}
                        onPageChange={(page, limit) => this.handlePageChange(page, limit)}
                        onSelectionChange={this.handleSelectionChange.bind(this)}
                    >
                        <DataGrid.Field
                            field="name"
                            label={__('文件名称')}
                            width={150}
                            formatter={(name, record) => (
                                <div
                                    title={name}
                                    className={fileNeedReview.some(file => file.docid === record.docid) && styles['need-review']}
                                >
                                    {
                                        fileNeedReview.some(file => file.docid === record.docid) ?
                                            <UIIcon
                                                className={styles['appeal-approval']}
                                                title={__('审核申诉')}
                                                size="16"
                                                code={'\uf09a'}
                                                color={'#D70000'}
                                                onClick={(event) => this.toggleAppealApproval(event, record)}
                                            />
                                            : null
                                    }
                                    <span className={!fileNeedReview.some(file => file.docid === record.docid) && styles['no-appeal']}>
                                        {getIcon({ name, size: 1 }, { size: 20 })}
                                        <span className={styles['doc-name']}>
                                            {shrinkText(name, { limit: 24 })}
                                        </span>
                                    </span>
                                </div>
                            )}
                        />
                        <DataGrid.Field
                            field="parentPath"
                            label={__('文件路径')}
                            width={80}
                            formatter={(parentPath, record) => (
                                <Text className={fileNeedReview.some(file => file.docid === record.docid) && styles['need-review']}>
                                    {parentPath}
                                </Text>
                            )}
                        />
                        <DataGrid.Field
                            field="modifier"
                            label={__('修改者')}
                            width={50}
                            formatter={(modifier, record) => (
                                <Text className={classnames(styles['margin-left'], { [styles['need-review']]: fileNeedReview.some(file => file.docid === record.docid) })}>
                                    {modifier}
                                </Text>
                            )}
                        />
                        <DataGrid.Field
                            field="modifie_time"
                            label={__('修改时间')}
                            width={90}
                            formatter={(modifie_time, record) => (
                                <Text className={fileNeedReview.some(file => file.docid === record.docid) && styles['need-review']}>
                                    {formatTime(modifie_time / 1000)}
                                </Text>
                            )}
                        />
                        <DataGrid.Field
                            field="reason"
                            label={__('隔离原因')}
                            width={130}
                            formatter={(reason, record) => (
                                <Text className={fileNeedReview.some(file => file.docid === record.docid) && styles['need-review']}>
                                    {reason}
                                </Text>
                            )}
                        />
                        <DataGrid.Field
                            field="gns"
                            label={__('操作')}
                            width={50}
                            formatter={(docid, record) => (
                                <div>
                                    <UIIcon
                                        className={styles['download-illegalfile']}
                                        title={__('查看版本')}
                                        size="16"
                                        code={'\uf067'}
                                        color={'#999'}
                                        onClick={(event) => this.checkVersions(event, record)}
                                    />
                                    <UIIcon
                                        className={styles['download-illegalfile']}
                                        title={__('下载')}
                                        size="16"
                                        code={'\uf02a'}
                                        color={'#999'}
                                        onClick={(event) => this.downloadIllegalDoc(event, record)}
                                    />
                                </div>
                            )}
                        />
                    </DataGrid>
                </div>
            </div>

        )
    }

    renderConfirmDeleteDialog() {
        return (
            <ConfirmDialog onConfirm={this.comfirmDeleteFiles.bind(this)} onCancel={this.cancelDelete.bind(this)}>
                <p>
                    {__('此操作将彻底删除该文件（包含其所有历史版本），删除后无法还原，确定要执行此操作吗？')}
                </p>
            </ConfirmDialog>
        )
    }

    renderConfirmRevertDialog() {
        return (
            <ConfirmDialog onConfirm={this.confirmRevertFiles.bind(this)} onCancel={this.cancelRevert.bind(this)}>
                <p>
                    {__('此操作将还原该文件到原位置（包含其所有历史版本），可能存在安全风险，确定要执行此操作吗？')}
                </p>
            </ConfirmDialog>
        )
    }

    /**
     * 文件还原/删除错误处理
     */
    renderHandlingError() {
        const { errorQueue } = this.state;
        const solution = { setDefault: false };

        switch (errorQueue[0].errID) {
            case CASE.GNS_OBJECT_NOT_EXIST:
            case CASE.CID_OBJECT_NOT_EXIST:
                return (
                    <MessageDialog onConfirm={this.confirmLibraryNotExist.bind(this, solution, errorQueue[0])}>
                        <div>
                            {__('文件“${file}”还原失败，原文档库已不存在', { file: errorQueue[0].file.name })}
                        </div>
                        <div className={styles['warning-footer']}>
                            <CheckBoxOption
                                onChange={checked => solution.setDefault = checked}
                            >
                                {__('跳过之后所有相同的冲突提示')}
                            </CheckBoxOption>
                        </div>
                    </MessageDialog >
                )

            case CASE.QUOTAS_INSUFFICIENT:
                return (
                    <MessageDialog onConfirm={this.comfirmQuotasInsufficient.bind(this, solution, errorQueue[0])}>
                        <div>
                            {__('文件“${file}”还原失败，目标位置配额空间不足', { file: errorQueue[0].file.name })}
                        </div>
                        <div className={styles['warning-footer']}>
                            <CheckBoxOption
                                onChange={checked => solution.setDefault = checked}
                            >
                                {__('跳过之后所有相同的冲突提示')}
                            </CheckBoxOption>
                        </div>
                    </MessageDialog >
                )

            case CASE.ILLEGALDOC_NOT_EXIST:
                return (
                    <MessageDialog onConfirm={this.confirmIllegalDocNotExist.bind(this, solution, errorQueue[0])} >
                        <div>
                            {__('文件“${file}”不存在', { file: errorQueue[0].file.name })}
                        </div>
                        <div className={styles['warning-footer']}>
                            <CheckBoxOption
                                onChange={checked => solution.setDefault = checked}
                            >
                                {__('跳过之后所有相同的冲突提示')}
                            </CheckBoxOption>
                        </div>
                    </MessageDialog >
                )
        }

    }

    renderVersion() {
        const { historicalVersions } = this.state;
        return (
            <Dialog 
                width={900}
                title={__('查看版本')}
                onClose={this.CancelCheckVersions.bind(this)}
            >
                <Panel>
                    <Panel.Main>
                        <DataGrid
                            height={300}
                            data={historicalVersions}
                            strap={true}
                        >
                            <DataGrid.Field
                                field="name"
                                label={__('文件名称')}
                                width={130}
                                formatter={(name, record) => (
                                    <div title={name}>
                                        {getIcon({ name, size: 1 }, { size: 20 })}
                                        <span className={styles['doc-name']}>{shrinkText(name, { limit: 30 })}</span>
                                    </div>
                                )}
                            />
                            <DataGrid.Field
                                field="modifier"
                                label={__('修改者')}
                                width={50}
                                formatter={(modifier, record) => (
                                    <Text className={styles['margin-left']}>
                                        {modifier}
                                    </Text>
                                )}
                            />
                            <DataGrid.Field
                                field="modifie_time"
                                label={__('修改时间')}
                                width={70}
                                formatter={(modifie_time, record) => (
                                    <Text>
                                        {formatTime(modifie_time / 1000)}
                                    </Text>
                                )}
                            />
                            <DataGrid.Field
                                field="reason"
                                label={__('隔离原因')}
                                width={100}
                                formatter={(reason, record) => (
                                    <Text>
                                        {reason}
                                    </Text>
                                )}
                            />
                            <DataGrid.Field
                                field="gns"
                                label={__('操作')}
                                width={50}
                                formatter={(docid, record) => (
                                    <div>
                                        <UIIcon
                                            className={styles['download-illegalfile']}
                                            title={__('下载')}
                                            size="16"
                                            code={'\uf02a'}
                                            color={'#999'}
                                            onClick={() => this.downloadIllegalDoc(record)}
                                        />
                                    </div>
                                )}
                            />
                        </DataGrid>
                    </Panel.Main>
                </Panel>
            </Dialog>
        )
    }

    renderAppealApproval(fileInApproval, disableApprovalConfirm) {
        return (
            <Dialog 
                width={500}
                title={__('审核申诉')}
                onClose={this.cancelApproval.bind(this)}
            >
                <Panel>
                    <Panel.Main>
                        <Form>
                            <div className={styles['margin-bottom']}>
                                <div className={styles['margin-bottom']}>
                                    {getIcon({ name: fileInApproval[0].name, size: 1 }, { size: 16 })}
                                    <span className={styles['doc-name']}>{decorateText(fileInApproval[0].name, { limit: 50 })}</span>
                                </div>
                                <Form.Label>
                                    <div className={styles['form-label']}>{__('申诉人：')}</div>
                                </Form.Label>
                                <Form.Field>
                                    <div>{fileInApproval[0].appeal.appellant}</div>
                                </Form.Field>
                            </div>
                            <div className={styles['reason-block']}>
                                <Form.Label>
                                    <div className={classnames(styles['form-label'], styles['reason-label'])}>{__('申诉理由：')}</div>
                                </Form.Label>
                                <Form.Field>
                                    <TextArea
                                        className={styles['appeal-reason']}
                                        value={fileInApproval[0].appeal.appealReason}
                                        readOnly={true}
                                    />
                                </Form.Field>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Form.Label>
                                    <div className={styles['form-label']}>{__('审核意见：')}</div>
                                </Form.Label>
                                <Form.Field>
                                    <div className={styles['radio-box']}>
                                        <RadioBoxOption
                                            name="approval-appeal"
                                            onChange={this.changeApprovalStatus.bind(this, ApprovalStatus.Rejection)}
                                            checked={false}
                                        >
                                            {__('否决')}
                                        </RadioBoxOption>
                                    </div>
                                    <RadioBoxOption
                                        name="approval-appeal"
                                        onChange={this.changeApprovalStatus.bind(this, ApprovalStatus.Approval)}
                                        checked={false}
                                    >
                                        {__('同意并还原文件')}
                                    </RadioBoxOption>
                                </Form.Field>
                            </div>
                        </Form>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button
                            onClick={this.approvalAppeal.bind(this, fileInApproval)}
                            disabled={disableApprovalConfirm}
                        >
                            {__('确定')}
                        </Panel.Button>
                        <Panel.Button onClick={this.cancelApproval.bind(this)}>{__('取消')}</Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog>
        )
    }
}