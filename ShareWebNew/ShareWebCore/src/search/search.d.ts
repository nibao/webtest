declare namespace Core {
    namespace Search {
        /**
         * 搜索参数
         */
        type Params = {

            /**
             * 分页加载起始位置
             */
            start: number;

            /**
             * 请求返回的查询记录条数
             */
            rows: number;

            /**
             * 为0,查找range下的有权限文件;
             * 为1,查找range下的有权限文件和发现共享文件;
             * 为2，查找range下的发现共享文件
             */
            style?: number;

            /**
             * 搜索关键字
             */
            keys?: string;

            /**
             * 搜索关键字有效字段(仅当keys不为空时有效)
             */
            keysfileds?: ReadonlyArray<'basename' | 'content'>;

            /**
             * 指定的某个目录下，具体为gns路径
             */
            range?: ReadonlyArray<string>;

            /**
             * 排序规则:默认按相关度排序
             */
            sort?: 'size' | '-size' | 'modified' | '-modified';

        }
    }
}