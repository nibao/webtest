import * as React from 'react';
import SystemOverViewBase from './component.base';
import { Form, Button, HeadBar, Card, ConfirmDialog, ProgressCircle } from '../../../ui/ui.desktop';
import __ from './locale';
import * as styles from './styles.view';

export default class SystemOverView extends SystemOverViewBase {
    render() {
        return (
            <Card>
                <HeadBar>
                    {
                        __('系统概况')
                    }
                </HeadBar>
                <div className={styles['form']}>
                    <Form >
                        <Form.Row className={styles['item']}>
                            <Form.Label>
                                {
                                    __('系统版本：')
                                }
                            </Form.Label>
                            <Form.Field>
                                {
                                    this.state.version ? this.state.version : '---'
                                }
                            </Form.Field>
                        </Form.Row>
                        <Form.Row className={styles['item']}>

                            <Form.Label>
                                {
                                    __('系统时间：')
                                }
                            </Form.Label>
                            <Form.Field>
                                {
                                    this.state.time ? this.state.time : '---'
                                }
                            </Form.Field>
                        </Form.Row>
                        <Form.Row className={styles['item']}>
                            <Form.Label>
                                {
                                    __('服务器数量：')
                                }
                            </Form.Label>
                            <Form.Field>
                                {
                                    this.state.nodeLength ? this.state.nodeLength : '---'
                                }
                            </Form.Field>
                        </Form.Row>
                    </Form>
                    <div className={styles['item-button']}>
                        <Button onClick={this.shutDownSystem.bind(this)}>
                            {
                                __('关闭系统')
                            }
                        </Button>
                    </div>
                </div>

                {
                    this.state.status ?
                        (
                            <ConfirmDialog
                                onConfirm={this.confirmShutDown.bind(this)}
                                onCancel={this.CancelShutDown.bind(this)} >
                                {
                                    __('关闭系统将导致管理控制台不可用，您确定要执行此操作吗？')
                                }
                            </ConfirmDialog>
                        ) :
                        null
                }

                {
                    this.state.closing ?
                        (
                            <ProgressCircle detail={__('正在关闭系统……')} />
                        ) :
                        null
                }
            </Card>
        )
    }

}