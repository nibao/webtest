declare namespace Components {
    namespace Download2 {
        interface Props {
            /** 获取下载链接成功 */
            onGetURLSuccess?: (url: string) => any

            /** 获取下载链接出错 */
            onGetURLError?: (error: { errcode }) => any
        }
    }
}