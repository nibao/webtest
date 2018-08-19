declare namespace Components {
    namespace TagEditor {
        interface Props extends React.Props<any> {
            /**
             * 传入的doc
             */
            doc?: Core.Docs.Doc;

            /**
             * 更新标签(当新增标签或者删除标签时)
             */
            onUpdateTags?: (tags: ReadonlyArray<string>, doc: Core.Docs.Doc) => void;

            /**
             * 关闭窗口
             */
            onCloseDialog(): void;

            /**
            * 打开窗口时触发
            */
            onOpenEditTagDialog?: (nwwindow) => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }

        interface State {
            /**
             * 搜索的结果
             */
            results: ReadonlyArray<string>;

            /**
             * 输入框的内容
             */
            value: string;

            /**
             * 标签
             */
            tags: ReadonlyArray<string>;

            /**
             * 错误码
             */
            errCode?: number;

            /**
             * 添加重复的标签
             */
            duplicateTag: boolean;

            /**
             * 状态
             */
            reqStatus: number;
        }
    }
}