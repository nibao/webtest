declare namespace Core {
    namespace APIs {
        namespace Client {
            namespace Tmp {

                /**
                 * 获取tokenid
                 */
                type GetTokenId = Core.APIs.ClientAPI<{}, { tokenId: string }>


                /**
                 * 运行一个外部程序
                 */
                type DefaultExecute = Core.APIs.ClientAPI<{

                    /**
                     * 任意链接地址
                     */
                    url: string
                }, void>

                /**
                 * 使用谷歌浏览器打开指定url
                 */
                type OpenUrlByChrome = Core.APIs.ClientAPI<{

                    /**
                     * 任意链接地址
                     */
                    url: string
                }, void>

                /**
                 * 设置剪贴板url
                 */
                type SetClipboard = Core.APIs.ClientAPI<{

                    /**
                     * 任意链接地址
                     */
                    url: string
                }, void>
            }
        }
    }
}