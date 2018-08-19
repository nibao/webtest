import * as React from 'react';
import * as classnames from 'classnames';
import { Dialog2 as Dialog, Panel, Text, ErrorDialog, ProgressCircle, Form } from '../../../../ui/ui.desktop';
import AddThirdOpitionConfigBase from './component.base'
import __ from './locale';
import * as styles from './styles.view.css';
import { disable } from '../../../../core/apis/eachttp/device/device';

const OPTION = {
    'summary.user': __('文档摘要提取选件：'),
    'keyExtract.user': __('文档关键词提取选件：'),
    'deepclassifier.user': __('文档智能分类选件：')
};

export default class AddThirdOpitionConfig extends AddThirdOpitionConfigBase {

    render() {
        const { summaryFile, keyExtractFile, deepclassifierFile } = this.state

        return (
            <div>
                <Dialog title={__('添加自动文本分析选件')} onClose={this.props.oAddThirdOpitionCancel}>
                    <Panel>
                        <Panel.Main>
                            <div>{__('请从本地上传自动文本分析相关的正式或试用授权文件：')}</div>
                            <div>
                                <Form className={styles['form']}>
                                    <Form.Row>
                                        <Form.Label>
                                            <div className={styles['text-height']}>
                                                {OPTION['summary.user']}
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <Text className={classnames(styles['text-input'], { [styles['disabled']]: !summaryFile })}>
                                                {summaryFile ? summaryFile.name : __('文件名如summary.user')}
                                            </Text>
                                        </Form.Field>
                                        <Form.Field>
                                            <div
                                                className={classnames(
                                                    styles['btn-uploader-picker'],
                                                    styles['btn']
                                                )}
                                                ref="summary"
                                            >
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Label>
                                            <div className={styles['text-height']}>
                                                {OPTION['keyExtract.user']}
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <Text className={classnames(styles['text-input'], { [styles['disabled']]: !keyExtractFile })}>
                                                {keyExtractFile ? keyExtractFile.name : __('文件名如keyExtract.user')}
                                            </Text>
                                        </Form.Field>
                                        <Form.Field>
                                            <div
                                                className={classnames(
                                                    styles['btn-uploader-picker'],
                                                    styles['btn']
                                                )}
                                                ref="keyExtract"
                                            >
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Label>
                                            <div className={styles['text-height']}>
                                                {OPTION['deepclassifier.user']}
                                            </div>
                                        </Form.Label>
                                        <Form.Field>
                                            <Text className={classnames(styles['text-input'], { [styles['disabled']]: !deepclassifierFile })}>
                                                {deepclassifierFile ? deepclassifierFile.name : __('文件名如deepclassifier.user')}
                                            </Text>
                                        </Form.Field>
                                        <Form.Field>
                                            <div
                                                className={classnames(
                                                    styles['btn-uploader-picker'],
                                                    styles['btn']
                                                )}
                                                ref="deepclassifier"
                                            >
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                </Form>
                            </div>
                        </Panel.Main>
                        <Panel.Footer>
                            <Panel.Button disabled={!summaryFile && !keyExtractFile && !deepclassifierFile} onClick={this.onConfirm.bind(this)}>
                                {
                                    __('上传')
                                }
                            </Panel.Button>
                            <Panel.Button onClick={this.props.oAddThirdOpitionCancel}>
                                {
                                    __('取消')
                                }
                            </Panel.Button>
                        </Panel.Footer>
                    </Panel >
                </Dialog >
                {
                    this.state.errormsg ?
                        <ErrorDialog
                            onConfirm={this.onErrorConfirm.bind(this)}
                        >
                            <ErrorDialog.Title>
                                {__('添加 自动文本分析选件 失败，错误原因：')}
                            </ErrorDialog.Title>
                            <ErrorDialog.Detail>
                                {this.state.errormsg}
                            </ErrorDialog.Detail>
                        </ErrorDialog>
                        :
                        null
                }
                {
                    this.state.loading ?
                        <ProgressCircle
                            detail={__('正在上传......')}
                        />
                        :
                        null
                }
            </div>
        )
    }
}