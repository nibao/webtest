declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Auth1 {

                /**
                 * 验证码数据
                 */
                type VcodeInfo = {
                    /**
                     * 验证码唯一标识 
                     */
                    uuid: string;

                    /**
                     * 验证码内容
                     */
                    vcode: string;

                    /**
                     * 时候是修改密码
                     */
                    ismodif: boolean;
                }

                /**
                 * 获取getconfig配置
                 */
                type GetConfig = Core.APIs.OpenAPI<void | null, Core.APIs.EACHTTP.Config>


                /**
                * 获取OAuth信息
                */
                type GetOAuthInfo = Core.APIs.OpenAPI<void | null, Core.APIs.EACHTTP.OAuthInfo>

                /**
                 * 设备信息
                 */
                interface DeviceInfo {
                    /**
                    * 设备名称
                    */
                    name?: string;

                    /**
                    * 操作系统类型
                    * 0：Unknown|1：IOS|2：Android|3：Windows phone|4：Windows|5：MacOSX|6：Web|7：MobileWeb
                    */
                    ostype?: number;

                    /**
                     * 设备硬件类型，自定义
                     */
                    devicetype?: string;

                    /**
                     * 设备唯一标识号，
                     * windows下取mac地址/ios取udid/web为空
                     */
                    udid?: string;
                }

                interface DeviceInfoWithVersion extends DeviceInfo {
                    /**
                    * 表示客户端程序的版本
                    */
                    version?: string;
                }

                /**
                 * 认证用户
                 */
                type GetNew = Core.APIs.OpenAPI<{
                    /**
                     * 账户名
                     */
                    account: string;

                    /**
                     * 设备信息
                     */
                    deviceinfo: DeviceInfoWithVersion;

                    /**
                     * 密码
                     */
                    password: string;

                    /**
                     * 验证码
                     */
                    vcodeinfo?: VcodeInfo

                }, Core.APIs.EACHTTP.AuthInfo>

                /**
                 * 登录（使用第三方凭证）
                 */
                type GetByThirdParty = Core.APIs.OpenAPI<{
                    /**
                     * 标识第三方认证类型
                     */
                    thirdpartyid: string;

                    /**
                     * 保存第三方认证系统相关的参数
                     */
                    params: {
                        [key: string]: any;
                    };

                    /**
                     * 设备信息
                     */
                    deviceinfo: DeviceInfo;
                }, Core.APIs.EACHTTP.ThirdAuthInfo>

                /**
                * 登录（西电ticket）
                */
                type GetByTicket = Core.APIs.OpenAPI<{
                    /**
                     * auth服务器返回的ticket票据，用来向token服务器请求token
                     */
                    ticket: string;

                    /**
                     * 请求ticket时的service名称
                     */
                    service: string;
                }, Core.APIs.EACHTTP.ThirdAuthInfo>


                /**
                * 登录（使用Windows登录凭据）
                */
                type GetByADSession = Core.APIs.OpenAPI<{
                    /**
                     * windows ad用户登录凭据
                     */
                    adsession: string;
                }, Core.APIs.EACHTTP.ThirdAuthInfo>

                /**
                 * 登录（使用第三方凭证）
                 */
                type ExtLoginClient = Core.APIs.OpenAPI<{
                    /**
                     * 用户登录账号（不能使用admin登录）
                     */
                    account: string,

                    /**
                     * 爱数分配给第三方系统的应用id
                     */
                    appid: string,

                    /**
                     * 组合appid，appkey，account后进行md5算法后得到（不区分大小写）
                     */
                    key: string
                }, Core.APIs.EACHTTP.ThirdAuthInfo>

                /**
                 * 登录web（使用第三方凭证）
                 */
                type ExtLoginWeb = Core.APIs.OpenAPI<{
                    /**
                     * 用户登录账号（不能使用admin登录）
                     */
                    account: string,

                    /**
                     * 爱数分配给第三方系统的应用id
                     */
                    appid: string,

                    /**
                     * 组合appid，appkey，account后进行md5算法后得到（不区分大小写）
                     */
                    key: string
                }, Core.APIs.EACHTTP.ExtLoginWebInfo>

                /**
                * 登录外部应用（集成到anyshare）
                */
                type GetExtAppInfo = Core.APIs.OpenAPI<{
                    /**
                     * 外部应用标识
                     */
                    apptype: number,

                    /**
                     * 应用系统相关配置
                     */
                    params?: {
                        grant_type: string,
                        scope: string,
                        userid?: string
                    },
                }, Core.APIs.EACHTTP.ExtAppInfo>

                /**
                * 刷新身份凭证有效期
                */
                type RefreshToken = Core.APIs.OpenAPI<{
                    /**
                     * 用户id
                     */
                    userid: string,

                    /**
                     * 用户的身份凭证
                     */
                    tokenid: string,

                    /**
                     * 刷新有效期类型：                      
                     * expirestype等于1时，刷新后token有效期为3天；
                     * expirestype等于2时，刷新后token有效期为1年；
                     * expirestype为其他值时，抛错参数值非法。
                     */
                    expirestype: number,
                }, Core.APIs.EACHTTP.RefreshTokenInfo>

                /**
                * 回收身份凭证
                */
                type RevokeToken = Core.APIs.OpenAPI<{
                    /**
                     * 用户的身份凭证
                     */
                    tokenid: string;
                }, void>

                /**
                * 修改用户密码
                */
                type ModifyPassword = Core.APIs.OpenAPI<{
                    /**
                     * 用户登录名
                     */
                    account: string;

                    /**
                     * 用户旧密码
                     */
                    oldpwd: string;

                    /**
                     * 用户新密码
                     */
                    newpwd: string;
                }, void>

                /**
                 * 登录（使用第三方凭证）
                 */
                type Logout = Core.APIs.OpenAPI<{
                    /**
                   * 操作系统类型
                   * 0：Unknown|1：IOS|2：Android|3：Windows phone|4：Windows|5：MacOSX|6：Web
                   */
                    ostype?: number;
                }, void>

                /**
                 * 二次认证
                 */
                type ValidateSecurityDevice = Core.APIs.OpenAPI<{
                    /**
                     * 标识第三方认证类型
                     */
                    thirdpartyid: string;

                    /**
                     * 第三方认证信息
                     */
                    params: {
                        account: string;
                        key: string;
                    }
                }, Core.APIs.EACHTTP.SecurityValidateResult>

                /**
                * 客户端卸载输入口令
                */
                type CheckUninstallPwd = Core.APIs.OpenAPI<{
                    /**
                     * 卸载口令
                     */
                    uninstallpwd: string,
                }, Core.APIs.EACHTTP.SecurityValidateResult>

                /**
                 * 获取验证码
                 */
                type GetVcode = Core.APIs.OpenAPI<{
                    /**
                     * 验证码标识
                     */
                    uuid: string;
                },
                    Core.APIs.EACHTTP.VcodeInfo>
                    
                /**
                * 发送短信验证码
                */
                type SendsMS = Core.APIs.OpenAPI<{
                    /**
                     * 登录名
                     */
                    account: string;

                    /**
                     * 密码
                     */
                    password: string;

                    /**
                     * 手机号码
                     */
                    tel_number: string;
                },
                    void>

                /**
                 * 发送短信验证码
                 */
                type SMSActivate = Core.APIs.OpenAPI<{
                    /**
                     * 登录名
                     */
                    account: string;

                    /**
                     * 密码
                     */
                    password: string;

                    /**
                     * 手机号码
                     */
                    tel_number: string;

                    /**
                     * 邮箱
                     */
                    mail_address: string;

                    /**
                     * 验证码
                     */
                    verify_code: string;
                },
                    Core.APIs.EACHTTP.AuthInfo>
            }
        }
    }
}