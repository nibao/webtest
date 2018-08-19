import * as React from 'react';
import * as classnames from 'classnames';
import Button from '../../ui/Button/ui.mobile';
import TextBox from '../../ui/TextBox/ui.mobile'
import { decorateText } from '../../util/formatters/formatters';
import RenameDialogBase from './component.base';
import * as styles from './styles.mobile.css';
import __ from './locale';

export default class RenameDialog extends RenameDialogBase {
    render() {
        let { doc, renameValue, renameTip, selectFoucs } = this.state;
        return (
            <div className={styles['rename-box']}>
                <div className={styles['rename-mask']}></div>
                <div className={styles['rename-container']}>
                    <div className={styles['rename-head']}>
                        {__('重命名')}
                    </div>
                    <div className={styles['rename-body']}>
                        <TextBox
                            type="text"
                            value={renameValue}
                            width={200}
                            onChange={this.handleChangeInput.bind(this)}
                            selectOnFocus={selectFoucs}
                            autoFocus={true}
                        >
                        </TextBox>
                    </div>
                    <div className={styles['rename-footer']}>
                        <Button
                            className={classnames(styles['rename-btn'], [styles['rename-cancel-btn']])}
                            onClick={() => { this.handleCancelRename(); }}
                        >
                            {__('取消')}
                        </Button>
                        <Button
                            className={classnames(styles['rename-btn'], [styles['rename-confirm-btn']])}
                            onClick={() => { this.handleConfiromRename(); }}
                        >
                            {__('确认')}
                        </Button>
                    </div>
                </div>
                {
                    renameTip === 'right' ?
                        null
                        :
                        <div
                            className={classnames(styles['rename-error'])}
                        >
                            {this.renderRenameTip(renameTip, doc)}
                        </div>
                }
            </div>
        )
    }
    renderRenameTip(renameTip, doc) {
        switch (renameTip) {
            case 'empty':
                return <span className={styles['rename-empty-tip']}>{__('文件名不能为空')}</span>
            case 'illegal':
                return <span className={styles['rename-illegal-tip']}>{__('文件名只包含 中文、英文、数字 及 ~!%#$@-_. 字符，请重新输入。')}</span>
            case 'permit':
                return <span className={styles['rename-permit-tip']}>{__('重命名失败，您对文件“${fileName}”没有修改权限', { fileName: decorateText(doc['name'], { limit: 18 }) })}</span>
            case 'duplicate':
                return <span className={styles['rename-duplicate-tip']}>{__('重命名失败，文件名已存在')}</span>
            case 'invalid':
                return <span className={styles['rename-invalid-tip']}>{__('重命名失败，该文件已不存在')}</span>
            default:
                break;
        }
    }
}
