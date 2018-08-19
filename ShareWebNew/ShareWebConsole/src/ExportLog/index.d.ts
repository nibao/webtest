declare namespace Console {
    namespace ExportLog {
        interface Props extends React.Props<void> {
            /**
             * 活跃日志参数
             */
            activeParams?: Core.EACPLog.ncTGetLogCountParam,

            /**
             * 历史日志参数
             */
            historyParams?: HistoryLogParams,
            /**
             * 日志形式
             * 0 表示活跃日志
             * 1 表示历史日志
             */
            logStyle: number,

            /**
             * 导出日志完成事件
             */
            onExportComplete: (questUrl: string) => void;

            /**
             * 导出日志取消事件
             */
            onExportCancel: () => void;

        }
        interface State {
            /**
             * 密码框中输入的值
             */
            password: string;

            /**
             * 再次输入密码框中输入的值
             */
            passwordAgain: string;

            /**
             * 两次输入是否相同
             */
            isSamePassword: boolean;

            /**
             * 验证状态
             */
            validateState: any;

            /**
             * 组件显示状态
             */
            exportStatus: number;

            /**
             * 错误码ID
             */
            errorStatus: number
        }
        interface HistoryLogParams {
            /**
             * 历史日志文件id
             */
            id: string;

            /**
             * 下载请求的有效时长
             */
            validSeconds: number;

            /**
             * 历史日志文件名
             */
            name: string;

        }
    }
}