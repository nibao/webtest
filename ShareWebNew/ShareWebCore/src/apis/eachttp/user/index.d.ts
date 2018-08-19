declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace User {
                /**
                 * 获取用户信息
                 */
                type GetUser = Core.APIs.OpenAPI<{}, Core.APIs.EACHTTP.UserInfo>

                /**
                 * 同意用户使用协议
                 */
                type AgreedToTermsOfUse = Core.APIs.OpenAPI<{}, Core.APIs.EACHTTP.AgreedResult>

                /**
                 * 修改邮箱地址
                 */
                type EditeMailAddress = Core.APIs.OpenAPI<{
                    /**
                     * 用户邮箱地址
                     */
                    editemailaddress: string;
                }, void>

            }
        }
    }
}