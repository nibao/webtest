import * as React from 'react';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import { includes } from 'lodash'
import Button from '../../ui/Button/ui.desktop';
import ErrorDialog from '../../ui/ErrorDialog/ui.desktop';
import SuccessDialog from '../../ui/SuccessDialog/ui.desktop';
import Select from '../../ui/Select/ui.desktop'
import FileConflictConfigBase from './component.base';
import { toSeconds } from './helper'
import __ from './locale';
import * as styles from './styles.view.css';
import * as baseinfoImg from './assets/images/base_info.png';

export default class FileConflictConfig extends FileConflictConfigBase {
    render() {
        let { config: { fileLockStatus, fileLockTimeout }, errMsg, successDialog, changed } = this.state;
        return (
            <div className={styles['container']}>
                <div className={styles['header']}>
                    <UIIcon
                        code={'\uf016'}
                        size={'18px'}
                        color={'#555'}
                        fallback={baseinfoImg}
                    />
                    <span className={styles['header-label']}>{__('文件冲突策略')}</span>
                </div>
                <div className={styles['main']}>
                    <div className={styles['filed']}>
                        <div className={styles['item']}>
                            <input
                                id="fileLockStatus"
                                type="checkbox"
                                checked={fileLockStatus}
                                onChange={this.handleFileLockStatusChange.bind(this)}
                            />
                            <label
                                htmlFor="fileLockStatus"
                                className={styles['label']}
                            >
                                {__('启用文件锁机制')}
                            </label>
                        </div>
                        <p className={styles['tip']}>{__('当多人同时编辑一个文件时，第一个打开的人将自动锁定文件，其他人以只读模式打开，直到锁定的人关闭此文件，才会自动解锁')}</p>
                        <div className={styles['item']}>
                            <span
                                className={styles['left-text']}
                            >
                                {__('客户端异常断开后，原登录用户锁定的文件')}
                            </span>
                            <Select
                                onChange={this.handleFileLockTimeoutChange.bind(this)}
                                value={fileLockTimeout}
                                disabled={!fileLockStatus}
                                className={styles['select']}
                                width={154}
                                menu={{width:154}}
                            >
                                <Select.Option
                                    value={toSeconds(3, 'min')}
                                    selected={fileLockTimeout === toSeconds(3, 'min')}
                                >
                                    {__('超过3分钟')}
                                </Select.Option>
                                <Select.Option
                                    value={toSeconds(10, 'min')}
                                    selected={fileLockTimeout === toSeconds(10, 'min')}>
                                    {__('超过10分钟')}
                                </Select.Option>
                                <Select.Option
                                    value={toSeconds(30, 'min')}
                                    selected={fileLockTimeout === toSeconds(30, 'min')}>
                                    {__('超过30分钟')}
                                </Select.Option>
                                <Select.Option
                                    value={toSeconds(1, 'hou')}
                                    selected={fileLockTimeout === toSeconds(1, 'hou')}>
                                    {__('超过1小时')}
                                </Select.Option>
                                <Select.Option
                                    value={toSeconds(5, 'hou')}
                                    selected={fileLockTimeout === toSeconds(5, 'hou')}>
                                    {__('超过5小时')}
                                </Select.Option>
                                <Select.Option
                                    value={toSeconds(12, 'hou')}
                                    selected={fileLockTimeout === toSeconds(12, 'hou')}>
                                    {__('超过12小时')}
                                </Select.Option>
                                <Select.Option
                                    value={toSeconds(24, 'hou')}
                                    selected={fileLockTimeout === toSeconds(24, 'hou')}>
                                    {__('超过24小时')}
                                </Select.Option>
                                <Select.Option
                                    value={toSeconds(-1)}
                                    selected={fileLockTimeout === toSeconds(-1)}>
                                    {__('永不')}
                                </Select.Option>
                            </Select>
                            <span className={styles['right-text']}>
                                {__('自动解锁')}
                            </span>
                        </div>
                    </div>
                </div>
                {
                    includes(changed, true) ? <div className={styles['footer']}>
                        <div className={styles['button-wrapper']}>
                            <Button
                                onClick={this.handleSaveFileConflictConfig.bind(this)}
                            >
                                {__('保存')}
                            </Button>
                        </div>
                        <div className={styles['button-wrapper']}>
                            <Button
                                onClick={this.handleCancelFileConflictConfig.bind(this)}
                            >
                                {__('取消')}
                            </Button>
                        </div>
                    </div> : null
                }
                {successDialog ?
                    <SuccessDialog
                        onConfirm={this.handleCloseDialog.bind(this)}
                    >
                        {__('保存成功')}
                    </SuccessDialog> :
                    null
                }
                {errMsg !== '' ?
                    <ErrorDialog
                        onConfirm={this.handleCloseDialog.bind(this)}
                    >
                        <ErrorDialog.Title>
                            {__('保存失败。错误原因:')}
                        </ErrorDialog.Title>
                        <ErrorDialog.Detail>
                            {errMsg}
                        </ErrorDialog.Detail>
                    </ErrorDialog> : null
                }
            </div>
        );
    }
}