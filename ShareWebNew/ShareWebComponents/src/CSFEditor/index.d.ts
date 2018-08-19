declare namespace Components {
    namespace CSFEditor {
        interface Props extends React.Props<any> {
            /**
             * 文档对象
             */
            docs: Core.Docs.Docs;

            /**
             * 更新密级
             */
            onUpdateCsflevel: (csflevel: number) => any;

            /**
             * 关闭窗口
             */
            onCloseDialog: () => any;

            /**
            * 打开窗口时触发
            */
            onOpenCSFEditorDialog?: (nwwindow) => any;

            /**
             * 跳转至权限申请界面
             */
            doApprovalCheck: () => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }

        interface State {
            /**
             * 状态
             */
            csfStatus: number;

            /**
             * 是否显示转圈等待
             */
            showLoading: boolean;
        }
    }
}