declare namespace Console {
    namespace SetManagerByDep {
        interface Props extends React.Props<void> {
            /**
             * 部门Id
             */
            departmentId: string;

            /**
             * 部门名
             */
            departmentName: string;

            /**
             * 用户id
             */
            userid: string;

            /**
             * 设置成功
             */
            onSetSuccess: () => void;

            /**
             * 取消设置
             */
            onCancel: () => void;
        }

        interface State {
            /**
             * 设置组织管理员面板状态
             */
            isConfigManager: boolean;

            /**
             * 选择用户界面
             */
            isAddingManager: boolean;

            /**
             * 组织管理员数据
             */
            managers: ReadonlyArray<any>;

            /**
             * 当前选择的用户
             */
            currentUser: any | null;

            /**
             * 用户限额开关状态
             */
            isLimitUserSpace: boolean;

            /**
             * 当前用户管理最大可分配限额
             */
            limitUserSpace: number | string;


            /**
             * 用户限额文本框为空
             */
            limitUserSpaceEmpty: boolean;

            /**
             * 文档限额状态
             */
            isLimitDocSpace: boolean;

            /**
             * 当前文档管理最大可分配限额
             */
            limitDocSpace: number | string;

            /**
             * 文档限额文本框为空
             */
            limitDocSpaceEmpty: boolean;

            /**
             * 错误
             */
            errorStatus: any;

            /**
             * 正在设置
             */
            isSetting: boolean;
        }
    }
}