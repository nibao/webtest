declare namespace Components {
    namespace VisitorAdder {
        interface Props extends React.Props<any> {
            /**
             * 将选中的访问者传出去
             */
            onAddVisitor: (candidates: ReadonlyArray<any>) => any;

            /**
             * 取消
             */
            onCancel: () => void;

            /**
             * 对话框尺寸发生变化时触发
             */
            onResize?: (size: { width: number | string, height: number | string }) => any;

            /**
             *  707 权限配置 -是否后台开启开关-涉密模式 用户名后加密级
             */
            showCSF: boolean;

            /**
             *  707 权限配置 -密级数组
             */
            csfTextArray: ReadonlyArray<string>;
        }

        interface State {
            /**
             * 已选的访问者
             */
            candidates: ReadonlyArray<any>;

            /**
             * layers(mobile)
             */
            layers: ReadonlyArray<string>;

            /**
             * layers对应的子部门或用户(mobile)
             */
            childrens: ReadonlyArray<{
                [id: string]: any;
            }>;

            /**
             * 勾选的部门，组织或用户(mobile)
             */
            checkedInfos: ReadonlyArray<any>;
        }
    }
}