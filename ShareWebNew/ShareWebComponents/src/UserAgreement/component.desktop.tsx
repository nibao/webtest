import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import UserAgreementBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

export default class UserAgreement extends UserAgreementBase {
    render() {
        const { agreementText, openEnter, showAgreement } = this.state;
        return (
            <div className={styles['container']} >
                {
                    showAgreement ?
                        <Dialog
                            title={__('用户协议')}
                            buttons={[]}
                            width={580}
                        >
                            <Panel>
                                <Panel.Main>
                                    <p className={styles['agreement-text']}>
                                        {agreementText}
                                    </p>
                                </Panel.Main>
                                <Panel.Footer>
                                    <div className={styles['useragreement-checkbox']}>
                                        <input
                                            checked={openEnter}
                                            type="checkbox"
                                            id="readed"
                                            onChange={this.handleReadAgreement.bind(this)
                                            } />
                                        <label htmlFor="readed">{__('已阅读并同意用户协议')}</label>
                                    </div>
                                    <Panel.Button
                                        disabled={!openEnter}
                                        onClick={this.handleOpen.bind(this)}
                                    >
                                        {__('打开云盘')}
                                    </Panel.Button>
                                </Panel.Footer>
                            </Panel>
                        </Dialog> : null
                }
            </div >
        )
    }
}