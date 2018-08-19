declare namespace TagEditor {
    namespace Config {
        interface ViewProps extends React.Props<void> {
            /**
             * 文档对象
             */
            doc?: Core.Docs.Doc;

            /**
             * input的值
             */
            value: string;

            /**
             * 搜索结果
             */
            results: ReadonlyArray<string>;

            /**
             * 警告码
             */
            errCode: number;

            /**
             * 标签数组
             */
            tags: ReadonlyArray<string>;

            /**
             * 允许设置的最大标签数
             */
            maxTags: number;

            /**
             * 搜索的loader函数
             */
            loader: (key: string) => any;

            /**
             * 搜索完成
             */
            onLoad: (results: ReadonlyArray<any>) => any;

            /**
             * 更新input的值
             */
            onUpdateValue: (value: string) => any;

            /**
             * 选择搜索结果中的一项
             */
            onSelect: (data: any) => any;

            /**
             * 按下enter键
             */
            onEnter: (e: KeyboardEvent, selectedInde: number) => any;

            /**
             * 添加标签
             */
            onAddTag: (tag: string) => any;

            /**
             * 删除标签
             */
            onRemoveTag: (tag: string) => any;

            /**
             * 'client' or 'desktop'
             */
            platform?: 'client' | 'desktop';
        }

        interface ViewStatus {
            /**
             * 在标签区域是否显示边框
             */
            showBorder: boolean;

            /**
             * 标签数组
             */
            tags: ReadonlyArray<string>;

            /**
             * 警告码
             */
            errCode: number;
        }

        interface ClientProps extends ViewProps {
        }

        interface DesktopProps extends ViewProps {
            /**
             * 关闭窗口
             */
            onCloseDialog?: () => any;
        }
    }
}