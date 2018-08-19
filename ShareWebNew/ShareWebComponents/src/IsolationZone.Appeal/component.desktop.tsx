import * as React from 'react';
import * as classnames from 'classnames';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import TextArea from '../../ui/TextArea/ui.desktop';
import { AppealedCode } from '../IsolationZone/helper';
import AppealDialogBase from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';


export default class AppealDialog extends AppealDialogBase {

    render() {

        const { appealReason, overAppealWords } = this.state;
        return (
            <Dialog
                title={__('申诉')}
                onClose={() => { this.props.onCloseDialog(AppealedCode.NORMAL); }}
            >
                <Panel>
                    <Panel.Main >
                        <div
                            className={classnames(styles['appeal-tips'])}
                        >
                            {__('申诉理由')}:
                            </div>
                        <div className={classnames(styles['appeal-box'])}>
                            <TextArea
                                className={classnames(styles['appeal-area'])}
                                placeholder={__('字数不能超过800字')}
                                value={appealReason}
                                maxLength={800}
                                onChange={this.handleTextAreaChange.bind(this)}

                            />
                            {
                                overAppealWords ? <div className={classnames(styles['appeal-range-tips'])} >{__('字数不能超过800字')}</div> : null
                            }
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button
                            type="submit"
                            disabled={overAppealWords}
                            onClick={() => { this.handleAppealFile(this.props.currentDoc, appealReason); }}
                        >
                            {__('确定')}
                        </Panel.Button>
                        <Panel.Button
                            type="submit"
                            onClick={() => { this.props.onCloseDialog(AppealedCode.NORMAL); }}
                        >
                            {__('取消')}
                        </Panel.Button>
                    </Panel.Footer>
                </Panel >
            </Dialog >
        )
    }


}