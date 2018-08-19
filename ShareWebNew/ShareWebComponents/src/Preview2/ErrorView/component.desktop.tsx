import * as React from 'react';
import { getErrorMessage } from '../../../core/errcode/errcode';
import Centered from '../../../ui/Centered/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import { ErrorCode } from './helper';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default function ErrorView({ code, downloadEnable, doDownload, doReload, docname }) {
    switch (code) {
        case ErrorCode.BrowserIncompatiable:
            return (
                <Centered>
                    <span className={styles.message}>{__('不支持IE8及其更早版本的浏览器')}</span>
                </Centered>
            )

        case ErrorCode.InvalidFormat:
            return (
                <Centered>
                    <div className={styles['warning-icon']}>
                        <UIIcon
                            size={'64px'}
                            code={'\uf030'}
                            color="#757575"
                        />
                    </div>
                    <div className={styles.message}>{__('当前格式不支持预览或文件已加密')}</div>
                    {
                        downloadEnable ?
                            <div className={styles.downloadMessage}>{__('您可以选择')}&nbsp;
                                    <a href="javascript:;" className={styles['download-link']} onClick={doDownload}>{__('下载查看')}</a>
                            </div>
                            : null
                    }
                </Centered>
            )

        case ErrorCode.Failed:
            return (
                <Centered>
                    <UIIcon
                        className={styles['reload-icon']}
                        size={'64px'}
                        code={'\uf05b'}
                        color="#757575"
                        onClick={doReload}
                    />
                    <span className={styles.message}>{__('加载失败，请 ')}</span>
                    <span className={styles.reload} onClick={doReload}>{__('刷新重试')}</span>
                    <span className={styles.message}>{__(' 。')}</span>
                </Centered>
            )

        case ErrorCode.WatermarkingFailed:
            return (
                <Centered>
                    <span className={styles.message}>{__('无法预览文件“${filename}”，水印制作失败', { filename: docname })}</span>
                </Centered>
            )

        case ErrorCode.GnsNotExist:
            return (
                <Centered>
                    <span className={styles.message}>{__('文件“${filename}”不存在, 可能其所在路径发生变更。', { filename: docname })}</span>
                </Centered>
            )

        case ErrorCode.PermissionRestricted:
            return (
                <Centered>
                    <span className={styles.message}>{__('您对文件“${filename}”没有预览权限', { filename: docname })}</span>
                </Centered>
            )

        default:
            return (
                <Centered>
                    {
                        getErrorMessage(code) ? (
                            <span className={styles.message}>{getErrorMessage(code)}</span>
                        ) : (
                                <Centered>
                                    <UIIcon
                                        className={styles['reload-icon']}
                                        size={'64px'}
                                        code={'\uf05b'}
                                        color="#757575"
                                        onClick={doReload}
                                    />
                                    <span className={styles.message}>{__('加载失败，请 ')}</span>
                                    <span className={styles.reload} onClick={doReload}>{__('刷新重试')}</span>
                                    <span className={styles.message}>{__(' 。')}</span>
                                </Centered>
                            )
                    }
                </Centered>
            )
    }
}