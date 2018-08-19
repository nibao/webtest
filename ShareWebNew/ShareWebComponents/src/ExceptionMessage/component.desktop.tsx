import * as React from 'react'
import MessageDialog from '../../ui/MessageDialog/ui.desktop'
import * as styles from './styles.desktop.css'

interface ExceptionMessageProps {
    /**
     * 标题信息
     */
    title: string;

    /**
     * 详细描述
     */
    detail: string;

    /**
     * 点击确认时触发
     */
    onMessageConfirm: () => void;
}

const ExceptionMessage: React.SFC<ExceptionMessageProps> = function ExceptionMessage({ title, detail, onMessageConfirm }) {
    return (
        <MessageDialog
            onConfirm={onMessageConfirm}
        >
            <h1
                className={styles['title']}
            >
                {
                    title
                }
            </h1>
            <div
                className={styles['detail']}
            >
                {
                    detail
                }
            </div>
        </MessageDialog>
    )
}

export default ExceptionMessage


