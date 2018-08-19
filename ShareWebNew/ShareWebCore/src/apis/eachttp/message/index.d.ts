declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Message {
                /**
                 * 发送邮件参数
                 */
                type SendMail = Core.APIs.OpenAPI<{
                    /**
                     * 邮件列表
                     */
                    mailto: string[];

                    /**
                     * 邮件主题
                     */
                    subject?: string;

                    /**
                     * 邮件内容，支持HTML内容
                     */
                    content?: string;
                }, void>

                /**
                 * 确认消息已读
                 */
                type Read2 = Core.APIs.OpenAPI<{
                    /**
                     * 消息id
                     */
                    msgids: Array<string>;
                }, void>

                /**
                 * 获取消息通知，返回最近的300条
                 */
                type GetMessage = Core.APIs.OpenAPI<{
                    /**
                     * 通知的时间。第一次get，值为0表示所有
                     */
                    stamp: number;
                }, Core.APIs.EACHTTP.Messages>
            }
        }
    }
}