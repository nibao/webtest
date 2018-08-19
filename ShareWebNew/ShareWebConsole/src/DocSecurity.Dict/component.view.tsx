import * as React from 'react';
import { formatTime, decorateText } from '../../util/formatters/formatters';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import ErrorDialog from '../../ui/ErrorDialog/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import ToolBar from '../../ui/ToolBar/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import Overlay from '../../ui/Overlay/ui.desktop';
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import DictManagementBase from './component.base';
import * as styles from './styles.desktop.css';
import * as upload from './assets/upload.png';
import __ from './locale';

export default class DictManagement extends DictManagementBase {

    render() {
        return (
            <div className={styles['container']}>
                {this.renderDateGrid()}
                {this.state.preview ? this.renderDictPreview() : null}
                {this.state.uploadError ? this.renderUploadFailed() : null}
                {this.state.invalidFiles.length > 0 ? this.renderFileInvalidate() : null}
            </div>
        )
    }

    renderDateGrid() {
        const { userDictInfo } = this.state;
        return (
            <div>
                <div className={styles['info-header']}>
                    <ToolBar>
                        <div className={styles['btn-uploader-picker']} >
                            <UIIcon className={styles['upload-icon']} size="16" code={'\uf045'} fallback={upload} color={'#999'} />
                            <div className={styles['upload-btn']} ref="select"></div>
                        </div>
                        <span className={styles['tip']}>{__('所上传的文档需按照范例中的格式（敏感词，分类，权重）提供敏感词（仅支持UTF-8编码）')}</span>
                        <div className={styles['dict-example']}>
                            <span onClick={this.previewDefaultDict.bind(this)}>{`${__('敏感词库范例')}.txt`}</span>
                            <UIIcon
                                className={styles['download-example']}
                                size="16"
                                color={'#999'}
                                code={'\uf02a'}
                                onClick={this.downloadDefaultDict.bind(this)}
                            />
                        </div>
                    </ToolBar>
                </div>
                <DataGrid
                    height={400}
                    data={userDictInfo}
                    strap={true}
                >
                    <DataGrid.Field
                        field="name"
                        label={__('敏感词库')}
                        width={100}
                        formatter={(name, record) => (
                            <div>
                                <UIIcon
                                    className={styles['doc-icon']}
                                    title={name}
                                    size="16"
                                    code={'\uf016'}
                                    color={'#999'}
                                    onClick={() => this.previewUserDict(name, record)}
                                />
                                <span className={styles['doc-item']} title={name} onClick={() => this.previewUserDict(name, record)}>
                                    {decorateText(name, { limit: 50 })}
                                </span>
                                <UIIcon
                                    size="16"
                                    className={styles['download-example']}
                                    title={name}
                                    code={'\uf02a'}
                                    color={'#999'}
                                    onClick={() => this.downloadUserDict(name, record)}
                                />
                            </div>
                        )}
                    />
                    <DataGrid.Field
                        field="upTime"
                        label={__('上传时间')}
                        width={50}
                        formatter={(upTime, record) => (
                            <Text>
                                {formatTime(upTime / 1000)}
                            </Text>
                        )}
                    />
                    <DataGrid.Field
                        field="id"
                        width={10}
                        formatter={(id, record) => (
                            <UIIcon
                                className={styles['download-example']}
                                size="16"
                                code={'\uf013'}
                                color={'#999'}
                                onClick={() => this.delUserDict(id, record)}
                            />
                        )}
                    />
                </DataGrid>
            </div>
        )

    }

    renderUploadFailed() {
        const { uploadErrMsg, isBatchOperation } = this.state;
        return (
            < ErrorDialog onConfirm={this.comfirmUploadFailed.bind(this)} >
                <div>
                    {uploadErrMsg}
                </div>
                {
                    isBatchOperation ?
                        <div className={styles['warning-footer']}>
                            <CheckBoxOption onChange={this.setDefault.bind(this)} checked={this.state.setDefault}>{__('跳过之后所有相同的冲突提示')}</CheckBoxOption>
                        </div>
                        :
                        null
                }
            </ErrorDialog >
        )
    }

    /**
     * 文件不合法提示
     */
    renderFileInvalidate() {
        const { uploadErrMsg, invalidFiles } = this.state;
        return (
            <Overlay position="top center">

                <div className={styles['overlay-box']}>
                    {
                        invalidFiles.map((file) => {
                            return <div>{uploadErrMsg}</div>
                        })
                    }
                </div>

            </Overlay>
        )

    }

    renderDictPreview() {
        const { dictContent, dictTitle } = this.state;
        return (
            <div className={styles['text-container']}>
                <div className={styles['text-header']}>
                    <FlexBox>
                        <FlexBox.Item align="middle left">
                            <span className={styles['text-title']} title={dictTitle}>{dictTitle}</span>
                        </FlexBox.Item>
                        <FlexBox.Item width="100" align="middle right">
                            <UIIcon
                                className={styles['text-control']}
                                size="16"
                                code={'\uf014'}
                                color={'#fff'}
                                onClick={this.closePreview.bind(this)}
                            />
                        </FlexBox.Item>
                    </FlexBox>
                </div>
                <div className={styles['text-body']}>{dictContent}</div>
            </div>
        )
    }
}