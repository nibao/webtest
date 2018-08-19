declare namespace Components {
    namespace Recycle {

        interface Props extends React.Props<any> {
            /**
             * 路径发生变化
             */
            onPathChange: (doc: Core.Docs.Docs, sort: string, by: string) => void;

            /**
             * 排序方式
             */
            sort: number;

            /**
             * 历史文档doc
             */
            doc: Core.Docs.Doc;

            /**
            * 打开窗口时触发
            */
            onOpenRecycleDialog?: (nwwindow) => any;

            /**
             * 弹窗关闭时执行
             */
            onCloseDialog?: () => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }

        interface State {

            /**
             * 是否处于入口文档处
             */
            isEntry: boolean;

            /**
             * 是否处于加载中
             */
            isLoading: boolean;

            /**
             * 入口文档对象数组
             */
            entryDocs: Core.Docs.Docs;

            /**
             * 回收站文档对象数组
             */
            listDocs: Core.Docs.Docs;

            /**
             * 选中的入口文档对象数组
             */
            entrySelections: Core.Docs.Docs;

            /**
             * 选中的回收站文档对象数组
             */
            listSelections: Core.Docs.Docs;

            /**
             * 待进行操作的文档对象
             */
            operationObj: { docs: Core.Docs.Docs, type: number };
        }
    }
}