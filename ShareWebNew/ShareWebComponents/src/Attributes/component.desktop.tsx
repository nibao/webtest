import * as React from 'react';
import * as classnames from 'classnames';
import { CSFSYSID, CSFBtnStatus } from '../../core/csf/csf';
import { formatTime } from '../../util/formatters/formatters';
import InlineButton from '../../ui/InlineButton/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import Fold from '../../ui/Fold/ui.desktop';
import CSFEditor from '../CSFEditor/component.desktop'
import CSFDetails from '../CSFDetails/component.desktop'
import AttributesBase from './component.base';
import * as styles from './styles.desktop';
import __ from './locale';

export default class AttributesBox extends AttributesBase {

    render() {
        const { csfBtnStatus } = this.state

        return (
            <div className={styles['fold-container']}>
                <Fold
                    label={__('基本属性')}
                    labelProps={{ className: styles['fold'] }}
                >
                    <div className={classnames(styles['container'], this.props.className)}>
                        {
                            this.renderAttributes()
                        }
                        {
                            csfBtnStatus === CSFBtnStatus.CsfEditor ?
                                <CSFEditor
                                    docs={this.props.docs}
                                    onUpdateCsflevel={this.updateCsflevel.bind(this)}
                                    onCloseDialog={() => this.setState({ csfBtnStatus: CSFBtnStatus.None })}
                                    doApprovalCheck={this.props.doApprovalCheck}
                                />
                                : null
                        }
                        {
                            csfBtnStatus === CSFBtnStatus.CsfDetails ?
                                <CSFDetails
                                    doc={this.props.docs[0]}
                                    onConfirm={() => this.setState({ csfBtnStatus: CSFBtnStatus.None })}
                                />
                                : null
                        }
                    </div>
                </Fold>
            </div>
        )
    }

    renderAttributes() {
        const { attributes, panelVisible } = this.state;
        const { creator, create_time, editor, modified, csflevel, site } = attributes;

        return (
            <table className={classnames(styles['table'])}>
                <tbody>
                    <tr className={styles['tr']}>
                        <td className={classnames(styles['td1'], panelVisible ? styles['visible'] : styles['non-visible'])}>
                            <span>{__('创建者：')}</span>
                        </td>
                        <td className={classnames(styles['td2'], panelVisible ? styles['visible'] : styles['non-visible'])}>
                            {
                                creator ?
                                    <Text>{creator}</Text>
                                    :
                                    <span>{'---'}</span>
                            }

                        </td>
                    </tr>

                    <tr className={styles['tr']}>
                        <td className={classnames(styles['td1'], panelVisible ? styles['visible'] : styles['non-visible'])}>
                            <span>{__('创建时间：')}</span>
                        </td>
                        <td className={classnames(styles['td2'], panelVisible ? styles['visible'] : styles['non-visible'])}>
                            <span>{create_time ? formatTime(create_time / 1000) : '---'}</span>
                        </td>
                    </tr>

                    <tr className={styles['tr']}>
                        <td className={classnames(styles['td1'], panelVisible ? styles['visible'] : styles['non-visible'])}>
                            <span>{__('修改者：')}</span>
                        </td>
                        <td className={classnames(styles['td2'], panelVisible ? styles['visible'] : styles['non-visible'])}>
                            {
                                editor ?
                                    <Text>{editor}</Text>
                                    :
                                    <span>{'---'}</span>
                            }
                        </td>
                    </tr>

                    <tr className={styles['tr']}>
                        <td className={classnames(styles['td1'], panelVisible ? styles['visible'] : styles['non-visible'])}>
                            <span>{__('修改时间：')}</span>
                        </td>
                        <td className={classnames(styles['td2'], panelVisible ? styles['visible'] : styles['non-visible'])}>
                            <span>{modified ? formatTime(modified / 1000) : '---'}</span>
                        </td>
                    </tr>

                    <tr className={styles['tr']}>
                        <td className={classnames(styles['td1'], panelVisible ? styles['visible'] : styles['non-visible'])}>
                            <span>{__('文件密级：')}</span>
                        </td>
                        <td className={classnames(styles['td2'])}>
                            <span className={classnames(panelVisible ? styles['visible'] : styles['non-visible'])}>
                                {this.convertWithCsfToCsfText(csflevel) || '---'}
                            </span>
                            {
                                // 对接中编办或8511
                                this.state.csfSysId === CSFSYSID.SDYX || this.state.csfSysId === CSFSYSID['706']
                                    ?
                                    null :
                                    <span className={styles['csf-btn']}>
                                        <InlineButton
                                            code={'\uf05c'}
                                            title={__('密级设置')}
                                            disabled={!this.state.csfBtnShow}
                                            onClick={this.triggerCsfEditor.bind(this, 'desktop')}
                                        >
                                            {__('密级设置')}
                                        </InlineButton>
                                    </span>
                            }
                            {
                                this.state.csfDetailsBtnShow
                                    ?
                                    <span className={styles['csf-btn']}>
                                        <InlineButton
                                            code={'\uf053'}
                                            title={__('密级详情')}
                                            onClick={this.triggerCsfDetails.bind(this, 'desktop')}
                                            disabled={this.state.csfIsNull}
                                        >
                                            {__('密级详情')}
                                        </InlineButton>
                                    </span>
                                    : null
                            }

                        </td>
                    </tr>
                    <tr className={styles['tr']}>
                        <td className={classnames(styles['td1'], panelVisible ? styles['visible'] : styles['non-visible'])}>
                            <span>{__('归属站点：')}</span>
                        </td>
                        <td className={classnames(styles['td2'], panelVisible ? styles['visible'] : styles['non-visible'])}>
                            <span>{site ? site : '---'}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}