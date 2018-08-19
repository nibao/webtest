declare namespace Console {
    namespace FileConflictConfig {
        interface Props extends React.Props<any> {

        }
        type Config = {
            fileLockStatus: boolean, // 文件锁状态 ture-开 false-关
            fileLockTimeout: number, // 文件锁自动解锁超时时间，秒级 默认3分钟-180
        }
        type Changed = {
            fileLockStatus: boolean, // 文件锁状态更改标识 false-未更改 true-已更改
            fileLockTimeout: boolean // 文件锁自动超时事件更改标识 false-未更改 true-已更改
        }
        interface State {
            config: Config;
            changed: Changed;
            errMsg: string; // 保存失败提示信息
            successDialog: boolean; // 显示隐藏提示框标识
        }
    }
}