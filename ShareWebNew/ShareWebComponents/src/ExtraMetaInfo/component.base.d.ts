

declare namespace Components {
    namespace ExtraMetaInfo {
        type Props = {
            /**
             * 文档id
             */
            doc: Core.Docs.Doc;
            /**
             * 用户id
            */
            userid: string;
        }
        type State = {
            /**
            * 文件属性列表
            */
            attrs: Array<any>;

            //编辑对话框状态
            showEditDialog: boolean;

        }
        interface Base {
            props: Props
            state: State
        }
    }

}   