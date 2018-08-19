declare namespace Components {
    namespace LinkShare {
        namespace Mails {
            interface Props extends React.Props<void> {
                /**
                 * 分享的文档
                 */
                doc: Core.APIs.EACHTTP.EntryDoc | Core.APIs.EFSHTTP.Doc;

                /**
                 * 外链地址
                 */
                link: string;

                /**
                 * 提取码
                 */
                accesscode: string;

                /**
                 * 外链密码
                 */
                password?: string;

                /**
                 * 外链有效期
                 */
                endtime?: number;

                /**
                 * 是否使用提取码
                 */
                enableLinkAccessCode: boolean;

                /**
                 * 邮箱数组
                 */
                mailto: Array<string>;

                /**
                 * 邮箱发生变化
                 */
                onMailsChange?: (mailto: Array<string>) => any;

                /**
                 * 发送邮箱成功
                 */
                onMailSendSuccess?: () => any;

                /**
                 * 发送邮箱失败
                 */
                onMailSendError?: () => any;
            }
        }
    }
}