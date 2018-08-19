import * as React from 'react';
import * as classnames from 'classnames'
import { pick } from 'lodash';
import { docname } from '../../core/docs/docs'
import { getErrorTemplate, getErrorMessage } from '../../core/errcode/errcode';
import TextBox from '../../ui/TextBox/ui.mobile';
import Button from '../../ui/Button/ui.mobile';
import PDF from '../../ui/PDF/ui.mobile';
import Dialog from '../../ui/Dialog/ui.mobile';
import Form from '../../ui/Form/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import Viewer from '../Viewer/component.mobile';
import PreviewBase from './component.base';
import { Status } from './helper';
import __ from './locale';
import * as styles from './styles.mobile.css';

export default class Preview extends PreviewBase {
    switchContent() {
        switch (this.state.status) {

            case Status.PENDING:
                return null

            case Status.BROWSER_INCOMPATIABLE:
                return (
                    <div className={styles.flex}>
                        <div className={styles.message}>{__('不支持IE8及其更早版本的浏览器')}</div>
                    </div>
                )

            case Status.FETCHING:
                return (
                    <div className={styles.flex}>
                        <div className={styles.message}>{__('正在加载...')}</div>
                    </div>
                )

            case Status.CADPreview:
            case Status.INVALID_FORMAT:
                return (
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <div className={styles.waring}>
                                <UIIcon size={'60px'} code={'\uf021'} color="#bdbdbd" />
                            </div>
                            <div className={styles.message}>{__('当前格式不支持预览或文件内容已加密')}</div>
                            {this.state.downloadEnabled ? <div>{__('您可以选择')}&nbsp;<a href="javascript:;" className={styles['download-link']} onClick={this.handleDownload.bind(this)}>{__('下载查看')}</a></div> : null}
                        </FlexBox.Item>
                    </FlexBox>
                )

            case Status.FAILED:
                return (
                    <div className={styles.flex}>
                        <div className={styles.message}>{__('加载失败')}</div>
                    </div>
                )
            case Status.NO_PERMISSION:
                return (
                    <div className={styles.flex}>
                        <div className={classnames(styles.message, styles['tip-message'])}>{__('您对文件“${filename}”没有预览权限', { filename: docname(this.props.doc) })}</div>
                    </div>
                )
            case Status.WATERMARKING_FAILED:
                return (
                    <div className={styles.flex}>
                        <div className={styles.message}>{__('无法预览文件“${filename}”，水印制作失败', { filename: docname(this.props.doc) })}</div>
                    </div>
                )

            case Status.MAKING_WATERMARK:
                return (
                    <div className={styles.flex}>
                        <div className={styles.message}>{getErrorMessage(Status.MAKING_WATERMARK)}</div>
                    </div>
                )
            case Status.LINK_PWD_ERROR:
                return (
                    <div className={styles.flex}>
                        <div className={styles.message}>{getErrorMessage(Status.LINK_PWD_ERROR)}</div>
                    </div>
                )

            case Status.PASSWORD_REQUIRED:
                return this.queryPassword();

            case Status.OK:
                return (
                    <PDF pdf={this.state.pdf} width={this.state.width} watermark={this.state.watermark} />
                )
        }
    }

    queryPassword() {
        return (
            <Dialog>
                <Dialog.Header>
                    {__('密码')}
                </Dialog.Header>
                <Dialog.Main>
                    <Form onSubmit={() => this.tryPassword(this.state.password)}>
                        <Form.Row>
                            <Form.Label>
                                <label htmlFor="password">{__('打开密码：')}</label>
                            </Form.Label>
                            <Form.Field>
                                <TextBox type="password" id="password" onChange={this.updatePassword.bind(this)} />
                            </Form.Field>
                        </Form.Row>
                    </Form>
                </Dialog.Main>
                <Dialog.Footer>
                    <Button onClick={() => this.tryPassword(this.state.password)}>{__('确定')}</Button>
                </Dialog.Footer>
            </Dialog>
        )
    }

    render() {
        return (
            <Viewer onRequestBack={this.props.onRequestBack} doc={this.props.doc} link={this.props.link}>
                {
                    this.switchContent()
                }
            </Viewer>
        )
    }
}