declare namespace Console {
    namespace ArchiveDocTree {
        interface Props extends React.Props<void>{
            /**
             * 管理员id
             */
            userid: string;
            /**
             * 可选范围
             */
            selectType: Array<NodeType>;
            /**
             * 选中节点时触发
             */
            onSelectionChange?: (node) => any;

            /**
             * 是否有搜索框
             */
            isSearch: boolean;
        }
        
        interface State {
            /**
             *  节点
             */
            nodes: Array<any>;
            /**
             * 搜索框输入值
             */
            values: string;
        }

        /**
         * 归档库库节点
         */
        interface DocLibNode {
            name: string;
            subDocCount: number;
            createrId: string;
            [key: string]: any;
        }

        /**
         * 文件夹节点
         */
        interface FolderNode {
            name: string;
            subFolderCount: number;
            [key: string]: any;
        }
    }
}