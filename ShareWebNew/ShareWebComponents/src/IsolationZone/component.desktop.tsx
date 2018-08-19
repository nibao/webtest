import * as React from 'react';
import * as classnames from 'classnames';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import SuccessDialog from '../../ui/SuccessDialog/ui.desktop'
import { decorateText } from '../../util/formatters/formatters';
import AppealDialog from '../IsolationZone.Appeal/component.desktop';
import ViewVersionDialog from '../IsolationZone.ViewVersion/component.desktop';
import IsolationZoneBase from './component.base';
import * as styles from './styles.desktop.css';
import * as loading from './assets/loading.gif'
import __ from './locale';
import { AppealedCode } from './helper';


export default class IsolationZone extends IsolationZoneBase {

    render() {

        const { quarantineDocs, currentDoc, appealDoc, versionDocs, isLoadingOver, appealStatus } = this.state;

        return (
            <div className={classnames(styles['tabs-container'])}>
                <div className={classnames(styles['tabs-shelter'])}></div>
                <div className={classnames(styles['tabs-title'])} >{__('非法内容隔离区')}</div>
                <div className={classnames(styles['tabs-content'])}>
                    {
                        isLoadingOver ? null :
                            <div className={styles['loading']}>
                                <FlexBox>
                                    <FlexBox.Item align={'center middle'}>
                                        <div className={styles['loading-box']} >
                                            <Icon url={loading} />
                                            <div className={styles['loading-message']}>{__('正在加载，请稍候......')}</div>
                                        </div>
                                    </FlexBox.Item>
                                </FlexBox>
                            </div>


                    }
                    <div className={classnames(styles['body-wrap-up'])}>
                        <DataGrid
                            data={quarantineDocs}
                            height={600}
                            className={styles['data-grid']}
                            select={true}
                            onSelectionChange={this.handleSelectionChange.bind(this)}
                            strap={true}
                            >

                            <DataGrid.Field
                                label={__('文档名称')}
                                field="name"
                                formatter={(name, doc) => {
                                    return (
                                        <div
                                            className={classnames(styles['data-grid-field'])}
                                            title={name}
                                            >
                                            {
                                                decorateText(name, { limit: 70 })
                                            }
                                        </div>
                                    )
                                } }
                                />
                            <DataGrid.Field
                                label={__('所在位置')}
                                field="parentpath"
                                width="80"
                                formatter={(parentpath) => {
                                    return (
                                        <div
                                            className={classnames(styles['data-grid-location'], this.compareDocsLens() ? styles['leftShift'] : null)}
                                            title={parentpath}
                                            >
                                            {
                                                decorateText(parentpath, { limit: 50 })
                                            }
                                        </div>
                                    )
                                } }
                                />
                            <DataGrid.Field
                                label={__('隔离原因')}
                                field="docid"
                                width="40"
                                formatter={(docid, doc) => {
                                    return (
                                        <div >
                                            <span
                                                onClick={(e) => { this.onClickFileViewVersion(e, doc) } }
                                                className={classnames(styles['data-grid-reason'], this.compareDocsLens() ? styles['leftShift'] : null)}
                                                >
                                                {__('查看')}
                                            </span>
                                        </div>
                                    )
                                } }
                                />
                            <DataGrid.Field
                                label={__('操作')}
                                field="status"
                                width="40"
                                formatter={(status, fileDoc) => {
                                    return (
                                        <div className={classnames(styles['data-grid-appeal'], this.compareDocsLens() ? styles['leftShift'] : null)}>
                                            {
                                                this.renderAppealStatus(status, fileDoc)
                                            }
                                        </div>
                                    )
                                } }
                                />
                        </DataGrid>
                    </div>
                </div>

                {
                    currentDoc ?
                        <ViewVersionDialog
                            currentDoc={currentDoc}
                            versionDocs={versionDocs}
                            onCloseDialog={this.onCloseInfoDialog.bind(this)}
                            onClickHistoryFileName={this.handlePreviewFile.bind(this)}
                            /> : null
                }

                {
                    appealDoc ?
                        <AppealDialog
                            currentDoc={appealDoc}
                            onCloseDialog={this.onCloseAppealDialog.bind(this)}
                            /> : null
                }

                {
                    this.renderAppealDialog(appealStatus)
                }
            </div >
        )
    }
    renderAppealStatus(status, doc) {

        switch (status) {
            case 1: return (
                this.handleDeadLine(doc) ?
                    <div>
                        <span
                            onClick={(e) => { this.onClickFileAppeal(e, doc) } }
                            className={classnames(styles['data-grid-field-appeal'])}
                            >
                            {__('申诉')}
                        </span>
                        <span className={classnames(styles['appeal-status-ok'])}>({__('截至')}{this.convertToDate(doc)})</span>
                    </div>
                    :
                    <span className={classnames(styles['appeal-status-error'])} >{__('已过期')}</span>
            )
            case 2: return (
                <span className={classnames(styles['appeal-status-ok'])}>{__('已申诉')}</span>
            )
            case 3: return (
                <span className={classnames(styles['appeal-status-error'])} >{__('已否决')}</span>
            )

            default:
                break;
        }

    }

    renderAppealDialog(appealStatus) {
        switch (appealStatus) {
            case AppealedCode.OK: return (
                <SuccessDialog onConfirm={() => { this.onConfirmAppeal() } }>{__('申诉已提交成功。')}</SuccessDialog>)

            case ErrorCode.ObjectTypeError: return (
                <MessageDialog onConfirm={() => { this.onConfirmAppeal() } }>{__('信息已失效。')}</MessageDialog>)

            case ErrorCode.GNSInaccessible: return (
                <MessageDialog onConfirm={() => { this.onConfirmAppeal() } }>{__('信息已失效。')}</MessageDialog>)

            case ErrorCode.ParametersIllegal: return (
                <MessageDialog onConfirm={() => { this.onConfirmAppeal() } }>{__('该文件已发起申诉，无需再次提交。')}</MessageDialog>)

            default:
                break;
        }
    }



}
