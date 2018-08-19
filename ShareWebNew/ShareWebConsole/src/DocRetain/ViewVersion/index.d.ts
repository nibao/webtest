declare namespace Console {
    namespace DocRetain {
        namespace ViewVersion {
            interface Props extends React.Props<void> {
                /**
                 * 路径前缀
                 */
                prefix: string;

                /**
                 * 当前正在查看历史版本的文件
                 */
                current: Console.DocRetain.Current;

                /**
                 * 是否使用https下载
                 */
                useHttps: boolean;

                /**
                 * 从存储服务器下载数据时的请求地址
                 */
                reqHost: string;

                /**
                 * 关闭窗口
                 */
                onClose: () => void;
            }
        }
    }
}