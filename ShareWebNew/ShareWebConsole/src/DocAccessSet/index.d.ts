declare namespace Console {
    namespace DocAccess {
        interface Props extends React.Props<void>{
            /**
             * 点击跳转用户组织管理
             */
            handleSkip: () => void;
        }
        interface State {
            /**
             *  访问设置信息
             */
            accessInfo: any,

            /**
             *  设置是否改变
             */
            changed: boolean,

            /**
             * 输入框状态
             */
            validateState: validatestates,
        }
        
        interface validatestates {
            limitCPU: number,
            limitMemory: number,
            limitPriority: number,
        }
    }
}