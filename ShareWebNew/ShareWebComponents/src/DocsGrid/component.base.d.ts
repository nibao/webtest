/// <reference path="../../core/docs/docs.d.ts" />

declare namespace Components {
    namespace DocsGrid {
        type Props = {
            /**
             * 文档类型
             */
            doctype?: number;

            /**
             * 文档对象
             */
            doc?: Core.Docs.Doc;

            /**
             * 外链id
             */
            link?: string;

            /**
             * 监控函数
             * @param updater 更新函数
             */
            watcher: (updater: Function) => any;

            /**
             * 打开文档对象
             * @param doc 文档对象
             */
            onOpen: (doc: Core.Docs.Doc) => void;


            /**
             * 导航发生改变
             */
            onNavigate: (path: Array<any>) => void;


            /**
             * 列表加载完成触发
             */
            onLoad: (docs: Array<Core.Docs.Doc>) => void;

        }

        type State = {
            docs: Array<Core.Docs.Doc>
        }

        interface Base {
            props: Props;

            state: State;
        }
    }
}