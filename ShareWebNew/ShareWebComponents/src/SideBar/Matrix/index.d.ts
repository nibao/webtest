declare namespace Components {
    namespace Matrix {
        interface Props extends React.Props<any> {
            /**
             * 文档数组
             */
            docs: ReadonlyArray<Core.Docs.Doc>;

            /**
             * 当前所在目录
             */
            directory: Core.Docs.Doc;

            /**
             * 触发组件
             */
            onTriggerComponent: (module: number, ...rest) => any;
        }

        interface State {
            /**
             * 禁用状态的功能
             */
            disabledOptions: ReadonlyArray<number>,
            unReadMsgNum: 0,
            isShare: true,
            auditMsgCount: 0,
            isPending: true,
        }
    }
}