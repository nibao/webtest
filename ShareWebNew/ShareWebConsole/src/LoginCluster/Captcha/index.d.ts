declare namespace Components {
    namespace LoginCluster {
        namespace Captcha {
            interface Props extends React.Props<void> {
                /**
                 * 验证码图片
                 */
                captchaPicture: string;

                /**
                 * 输入验证码的值
                 */
                vcode: string;

                /**
                 * 验证码更改事件
                 */
                handleChange: (value) => void,

                /**
                 * 换下一张验证码
                 */
                changeNext: () => void
            }
        }
    }
}