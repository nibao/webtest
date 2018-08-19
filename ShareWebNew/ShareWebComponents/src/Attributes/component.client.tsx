import * as React from 'react';
import * as classnames from 'classnames';
import { isNumber } from 'lodash';
import { InlineButton, Text } from '../../ui/ui.desktop';
import { CSFSYSID } from '../../core/csf/csf';
import { formatSize, formatTime } from '../../util/formatters/formatters';
import AttributesBase from './component.base';
import __ from './locale';
import * as styles from './styles.client.css';

export default class AttributesBox extends AttributesBase {

    render() {
        return (
            <div className={classnames(styles['container'], this.props.className)}>
                <div className={styles['title']}>{__('基本属性')}</div>
                <div className={styles['pad']} />
                {
                    this.renderAttributes()
                }
            </div>
        )
    }

    renderAttributes() {
        const { attributes, panelVisible, lockername, size, csfIsNull, csfSysId, csfBtnShow, csfDetailsBtnShow } = this.state;
        const { creator, create_time, editor, modified, csflevel, site } = attributes;

        return (
            <table className={classnames(styles['table'])}>
                <tbody>
                    <tr className={styles['tr']}>
                        <td className={styles.td1}>
                            <div className={styles.item}>
                                <span className={styles.text}>{__('大小：')}</span>
                            </div>
                        </td>
                        <td className={styles.td2}>
                            <div className={styles.item}>
                                <span className={styles.text}>{size !== -1 && isNumber(size) ? formatSize(size) : '---'}</span>
                            </div>
                            <div className={styles['right']}>
                                <InlineButton
                                    code={'\uf053'}
                                    title={__('查看')}
                                    onClick={this.triggerViewSize.bind(this)}
                                />
                            </div>
                        </td>
                    </tr>

                    <tr className={styles['tr']}>
                        <td className={styles['td1-pad']}>
                            <span>{__('创建者：')}</span>
                        </td>
                        <td className={styles['td2-pad']}>
                            {
                                creator ?
                                    <Text>{creator}</Text>
                                    :
                                    <span>{'---'}</span>
                            }

                        </td>
                    </tr>

                    <tr className={styles['tr']}>
                        <td className={styles['td1']}>
                            <span>{__('创建时间：')}</span>
                        </td>
                        <td className={styles['td2']}>
                            {
                                create_time ?
                                    <Text>{formatTime(create_time / 1000)}</Text>
                                    :
                                    <span>{'---'}</span>
                            }
                        </td>
                    </tr>

                    <tr className={styles['tr']}>
                        <td className={styles['td1']}>
                            <span>{__('修改者：')}</span>
                        </td>
                        <td className={styles['td2']}>
                            {
                                editor ?
                                    <Text >{editor}</Text>
                                    :
                                    <span>{'---'}</span>
                            }
                        </td>
                    </tr>

                    <tr className={styles['tr']}>
                        <td className={styles['td1']}>
                            <span>{__('修改时间：')}</span>
                        </td>
                        <td className={styles['td2']}>
                            {
                                modified ?
                                    <Text>{formatTime(modified / 1000)}</Text>
                                    :
                                    <span>{'---'}</span>
                            }
                        </td>
                    </tr>

                    <tr className={styles['tr']}>
                        <td className={styles['td1']}>
                            <span>{__('锁定者：')}</span>
                        </td>
                        <td className={styles['td2']}>
                            {
                                lockername ?
                                    <Text className={styles['locker']} >{lockername}</Text>
                                    :
                                    <span>{'---'}</span>
                            }
                        </td>
                    </tr>

                    <tr className={styles['tr']}>
                        <td className={styles['td1-pad']}>
                            <div className={styles.item}>
                                <span className={styles.text}>{__('文件密级：')}</span>
                            </div>
                        </td>
                        <td className={styles['td2-pad']}>
                            <div className={styles.item}>
                                <span className={styles.text}>{this.convertWithCsfToCsfText(csflevel) || '---'}</span>
                            </div>
                            {
                                // 对接中编办或8511
                                csfSysId === CSFSYSID.SDYX || csfSysId === CSFSYSID['706'] ?
                                    null :
                                    <div className={styles['right']}>
                                        <InlineButton
                                            code={'\uf05c'}
                                            title={__('编辑')}
                                            onClick={csfBtnShow && this.triggerCsfEditor.bind(this, 'client')}
                                            disabled={!csfBtnShow}
                                        />
                                    </div>
                            }
                            {
                                csfDetailsBtnShow ? (
                                    <div className={styles['right']}>
                                        <InlineButton
                                            code={'\uf05c'}
                                            title={panelVisible ? __('详情') : ''}
                                            onClick={panelVisible && !csfIsNull && this.triggerCsfDetails.bind(this, 'client')}
                                            disabled={!panelVisible || csfIsNull}
                                        />
                                    </div>
                                ) : null
                            }
                        </td>
                    </tr>
                    <tr className={styles['tr']}>
                        <td className={classnames(styles[csfDetailsBtnShow || !(csfSysId === CSFSYSID.SDYX || csfSysId === CSFSYSID['706']) ? 'td1-pad' : 'td1'])}>
                            <span>{__('归属站点：')}</span>
                        </td>
                        <td className={classnames(styles[csfDetailsBtnShow || !(csfSysId === CSFSYSID.SDYX || csfSysId === CSFSYSID['706']) ? 'td2-pad' : 'td2'])}>
                            {
                                site ?
                                    <Text>{site}</Text>
                                    :
                                    <span>{'---'}</span>
                            }
                        </td>
                    </tr>
                </tbody>
            </table >
        )
    }

}