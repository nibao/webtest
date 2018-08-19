declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Auth2 {

                /**
                 * 认证用户
                 */
                type Login = Core.APIs.ClientAPI<{
                    /**
                     * 账户名
                     */
                    grant_type?: string;

                    /**
                     * Token类型
                     */
                    token_type?: string;

                    /**
                     * 认证参数
                     */
                    params: {
                        [key: string]: any;
                    };
                }, Core.APIs.EACHTTP.Auth2Info>

                /**
                 * 新的token
                 */
                type Refresh = Core.APIs.ClientAPI<{
                    /**
                     * 登录时返回的refresh_token
                     */
                    refresh_token: string;
                }, Core.APIs.EACHTTP.Auth2Info>
            }
        }
    }
}