/// <reference path="../../core/link/link.d.ts" />
/// <reference path="../../core/docs/docs.d.ts" />

declare namespace Components {
    namespace DocsGrid2 {
        interface Props extends React.Props<any> {
            height: number | string;

            path?: string; // 文件路径，外链不包含外链id本身。

            link?: Core.Link.Info; // 外链对象

            onLoad: (docs: Array<Core.Docs.Doc>) => void; // 列表加载完成触发

            getDefaultSelection: (docs: Array<Core.Docs.Doc>) => Array<Core.Docs.Doc>

        }

        interface State {
            docs: Array<Core.Docs.Doc>
        }

        interface Base {
            props: Props;

            state: State;
        }
    }
}