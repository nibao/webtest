declare namespace Console {
    namespace FileInfo {
        interface Props extends React.Props<any> {
            /**
             * 显示的数据信息
             */
            fileInfo: {
                /**
                 * 创建者
                 */
                creator: string;

                /**
                 * 编辑者
                 */
                editor: string;

                /**
                 * 修改时间
                 */
                modified: number;

                /**
                 * 共享者
                 */
                sharer: string;

                /**
                 * 共享文档
                 */
                sharedObj: string;
            }

            /**
             * 关闭FileInfo
             */
            onClose: () => void;
        }
    }
}