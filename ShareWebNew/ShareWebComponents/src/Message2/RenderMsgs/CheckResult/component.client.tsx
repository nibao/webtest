import * as React from 'react';
import NWWindow from '../../../../ui/NWWindow/ui.client';
import Dialog from '../../../../ui/Dialog2/ui.client';
import Panel from '../../../../ui/Panel/ui.desktop';
import Form from '../../../../ui/Form/ui.desktop';

import * as styles from './styles.desktop.css';
import __ from './locale';

/**
 * 渲染审核消息列表中每一项的审核结果弹窗
 * @export
 * @param {Components.Message2.RenderMsgs.CheckResult.Props} { resultMsg, closeResultDialog } 
 * @returns 
 */
export default function CheckResult({ resultMsg, closeResultDialog }: Components.Message2.RenderMsgs.CheckResult.Props) {
    return (
        <NWWindow
            modal={true}
            onClose={closeResultDialog}
            title={__('审核详情')}
        >
            <Dialog>
                <Panel>
                    <Panel.Main>
                        <div>
                            <Form>

                                <Form.Row>
                                    <Form.Label>
                                        <label>{__('审核员：')}</label>
                                    </Form.Label>
                                    <Form.Field>
                                        <span>{resultMsg.auditorname}</span>
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label>
                                        <label>{__('审核意见：')}</label>
                                    </Form.Label>
                                    <Form.Field>
                                        {
                                            resultMsg.auditresult ?
                                                (
                                                    <span className={styles['agree']}>
                                                        {__('通过')}
                                                    </span>
                                                )
                                                :
                                                (
                                                    <span className={styles['deny']}>
                                                        {__('否决')}
                                                    </span>
                                                )
                                        }
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label align="top">
                                        <label>{__('补充说明：')}</label>
                                    </Form.Label>
                                    <Form.Field>
                                        <div className={styles['audit-comment']}>
                                            {resultMsg.auditmsg}
                                        </div>
                                    </Form.Field>
                                </Form.Row>
                            </Form>
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button
                            type="submit"
                            onClick={closeResultDialog}
                        >
                            {__('确定')}
                        </Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog >
        </NWWindow>
    )
} 