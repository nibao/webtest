import * as React from 'react';
import * as classnames from 'classnames';
import { Dialog2 as Dialog, Panel, TextArea, Form, RadioBoxOption } from '../../../ui/ui.desktop';
import ReviewDialogBase from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';


export default class ReviewDialog extends ReviewDialogBase {

    render() {
        const { comments, overWords, disableSubmit, result } = this.state;

        return (
            <Dialog
                title={__('审核')}
                onClose={this.props.onCloseReviewDialog}
            >
                <Panel>
                    <Panel.Main >
                        <Form>
                            <div>
                                <Form.Label>
                                    <div className={styles['form-label']}>{__('审核意见：')}</div>
                                </Form.Label>
                                <Form.Field>
                                    <RadioBoxOption
                                        onChange={() => this.changeApprovalStatus(true)}
                                        checked={disableSubmit ? false : result === true ? true : false}
                                        value={true}
                                    >
                                        {__('通过')}
                                    </RadioBoxOption>
                                    <div className={styles['right-radio-button']}>
                                        <RadioBoxOption
                                            onChange={() => this.changeApprovalStatus(false)}
                                            checked={disableSubmit ? false : result === false ? true : false}
                                            value={false}
                                        >
                                            {__('否决')}
                                        </RadioBoxOption>
                                    </div>
                                </Form.Field>
                            </div>
                            <div>
                                <Form.Label align={'top'}>
                                    <div className={styles['form-label']}>{__('补充说明：')}</div>
                                </Form.Label>
                                <Form.Field>
                                    <TextArea
                                        className={styles['text-area']}
                                        value={comments}
                                        onChange={this.handleTextAreaChange}
                                    />
                                </Form.Field>
                            </div>
                        </Form>
                        {
                            overWords ?
                                <div className={classnames(styles['appeal-range-tips'])} >{__('补充说明不能超过800个字')}</div>
                                : null
                        }
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button
                            onClick={this.handleReview}
                            disabled={disableSubmit}
                        >
                            {__('提交')}
                        </Panel.Button>
                        <Panel.Button
                            onClick={this.props.onCloseReviewDialog}
                        >
                            {__('取消')}
                        </Panel.Button>
                    </Panel.Footer>
                </Panel >
            </Dialog >
        )
    }
}