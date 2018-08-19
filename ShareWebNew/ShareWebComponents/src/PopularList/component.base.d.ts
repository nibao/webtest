/// <reference path="../../core/docs/docs.d.ts" />

declare namespace Components {
    namespace PopularList {
        interface Props extends React.Props<any> {
            /**
             * 预览文件
             */
            preview?: (doc: Core.Docs.Doc) => any;
        }

        interface State {
            data: Array<Core.Docs.Doc>;
        }

        interface Base {
            props: Props;

            state: State;
        }
    }
}