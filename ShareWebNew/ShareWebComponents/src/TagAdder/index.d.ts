declare namespace Components {
    namespace TagAdder {
        interface Props extends React.Props<any> {
            /**
             * 文档对象
             */
            docs: Core.Docs.Docs;

            /**
             * 关闭
             */
            onCloseDialog(): void;

            /**
             * 打开窗口时触发
             */
            onOpenAddTagDialog?: (nwwindow) => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }

        interface State {
            /**
             * 标签
             */
            tags: ReadonlyArray<string>;

            /**
             * 搜索结果
             */
            results: ReadonlyArray<string>;

            /**
             * 输入框的值
             */
            value: string;

            /**
             * 当标签出现滚动条的时候，显示边框(client)
             */
            showBorder: boolean;

            /**
             * 警告码
             */
            warningCode: number;

            /**
             * 状态
             */
            reqStatus: number;

            /**
             * 批量添加标签：产生的异常
             */
            exception: number;

            /**
             * 批量添加标签策略
             */
            strategies: any;

            /**
             * 是否显示“添加标签成功”(desktop)
             */
            showSuccessMessage: boolean;

            /**
             * 是否显示“添加标签成功”(client)
             */
            showSuccessMessageClient: boolean;

            /**
             * 批量添加标签，正在操作的文件
             */
            processingDoc: Core.Docs.Doc;
        }
    }
}