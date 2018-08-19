declare namespace Console {
    namespace DocRetain {
        interface State {
            /**
             * 搜索结果
             */
            results: ReadonlyArray<Result>;

            /**
             * 当前正在查看历史版本的那一个文件
             */
            current?: Current;

            /**
             * 搜索框的内容
             */
            value: string;

            /**
             * 翻页
             */
            paginator: {
                /**
                 * 第几页
                 */
                page: number;

                /**
                 * 总共的页数
                 */
                total: number;

                /**
                 * 每页限制的个数
                 */
                limit: number;
            }

            /**
             * '正在搜索，请稍候'是否显示
             */
            searchingNow: boolean;
        }

        /**
         * 搜索结果中的attribute
         */
        interface Attribute {
            /**
             * 文件创建者
             */
            creator: string;

            /**
             * 文件创建时间
             */
            createTime: number;

            /**
             * 文件密级
             */
            csfLevel: number;

            /**
             * 文件名
             */
            name: string;
        }

        /**
         * 搜索结果中的metadata
         */
        interface Metadata {
            /**
             * 文件版本ID
             */
            rev: string;

            /**
             * 文件版本上传时文件名
             */
            name: string;

            /**
             * 文件版本上传编辑者名称
             */
            editor: string;

            /**
             * 文件版本上传时间
             */
            modified: number;
        }

        /**
         * 搜索结果
         */
        interface Result {
            /**
             * 文件gns路径
             */
            docId: string;

            /**
             * 文件父路径
             */
            path: string;

            /**
             * 是否为留底的文件
             */
            retained: boolean;

            /**
             * 文件属性
             */
            attribute: Attribute;

            /**
             * 最新元数据
             */
            metadata: Metadata;
        }

        /**
         * 当前正在查看历史版本的文件
         */
        interface Current {
            /**
             * 文件gns路径
             */
            docId: string;

            /**
             * 文件父路径
             */
            path: string;

            /**
             * 是否为留底的文件
             */
            retained: boolean;

            /**
             * 文件属性
             */
            attribute: Attribute;

            /**
             * 最新元数据
             */
            metadata: Metadata;

            /**
             * 历史版本
             */
            versions: Array<Metadata>;
        }
    }
}