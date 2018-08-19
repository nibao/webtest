import * as React from 'react';
import * as classnames from 'classnames';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import { getErrorMessage } from '../../core/errcode/errcode';
import Thumbnail from '../Thumbnail/component.desktop';
import LinkDownloadBase from './component.base';
import { ReqStatus } from './helper';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class LinkDownloads extends LinkDownloadBase {
    renderError(status) {
        switch (status) {
            case ReqStatus.NO_FILE_VISITED:
                return (
                    <MessageDialog onConfirm={() => { this.props.onConfirmError(); }}>
                        <p>{__('还没有用户查看当前外链共享的文件')}</p>
                    </MessageDialog>
                )
            default:
                return (
                    <MessageDialog onConfirm={() => { this.props.onConfirmError(); }}>
                        <p>{getErrorMessage(this.state.reqStatus)}</p>
                    </MessageDialog>
                )
        }
    }

    renderVisitDetail() {
        return (
            <Dialog
                ref="dialog"
                width={800}
                title={__('访问详情')}
                onClose={() => { this.props.onCloseDialog(); }}
            >
                <Panel>
                    <Panel.Main>
                        <FlexBox>
                            <FlexBox.Item align="left middle">
                                <DataGrid
                                    select={{ multi: false, required: true }}
                                    height={450}
                                    data={this.state.files}
                                    getKey={record => record.docid}
                                    onSelectionChange={this.handleSelectFile.bind(this)}
                                    getDefaultSelection={this.handleDefaultSelection.bind(this)}
                                    lazyLoad={true}
                                    onPageChange={this.handleFilesPageChange}
                                >
                                    <DataGrid.Field
                                        label={__('文件名称')}
                                        field="name"
                                        width="100"
                                        formatter={(name, record) => (
                                            <div className={styles['name-wrapper']}>
                                                <Thumbnail
                                                    className={styles['picture']}
                                                    doc={record}
                                                    size={32}
                                                />
                                                <Text
                                                    className={styles['name']}
                                                    numberOfChars={15}
                                                    ellipsizeMode={'middle'}
                                                >
                                                    {name}
                                                </Text>
                                            </div>

                                        )}
                                    />
                                    <DataGrid.Field
                                        label={__('所在位置')}
                                        field="path"
                                        width="100"
                                        formatter={path => (
                                            path ? (
                                                <Text className={styles['item']}>{path}</Text>
                                            ) :
                                                '--'
                                        )}
                                    />
                                </DataGrid>
                            </FlexBox.Item>
                            <FlexBox.Item align="middle middle">
                                <div className={styles.middle}></div>
                            </FlexBox.Item>
                            <FlexBox.Item align="right middle">
                                <div>
                                    <DataGrid
                                        getKey={record => record.ip}
                                        height={450}
                                        data={this.state.statistics}
                                        lazyLoad={true}
                                        onPageChange={this.handleStatisticsPageChange}
                                    >
                                        <DataGrid.Field
                                            label={__('访问IP')}
                                            field="ip"
                                            width="100"
                                            formatter={ip => (
                                                <Text className={styles['item']}>{ip}</Text>
                                            )}
                                        />
                                        <DataGrid.Field
                                            label={__('预览次数')}
                                            field="preview"
                                            width="50"
                                            formatter={preview => (
                                                <Text className={classnames(styles['item'], styles['text-color'])}>{preview}</Text>
                                            )}
                                        />
                                        <DataGrid.Field
                                            label={__('下载次数')}
                                            field="download"
                                            width="50"
                                            formatter={download => (
                                                <Text className={classnames(styles['item'], styles['text-color'])}>{download}</Text>
                                            )}
                                        />
                                    </DataGrid>
                                </div>
                            </FlexBox.Item>
                        </FlexBox>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button
                            className={styles['close-button']}
                            onClick={() => { this.props.onCloseDialog() }}
                        >
                            {__('关闭')}
                        </Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog >
        );
    }
    render() {
        return (
            <div className={styles.container}>
                {
                    this.state.reqStatus === ReqStatus.OK ? this.renderVisitDetail() : this.renderError(this.state.reqStatus)
                }
            </div>
        );
    }
}
