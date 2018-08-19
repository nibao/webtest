declare namespace Console {
    namespace CaptchaBox {

        interface Props extends React.Props<void> {
            /**
             * 上次输入的验证码id
             */
            uuid?: string;

            /**
             * 获取验证码
             */
            onChange: (value: captchaInfo) => void;
        }

        interface State {
            /**
             * 验证码
             */
            captcha: string;

            codeCreateInfo: Core.ShareMgnt.ncTVcodeCreateInfo
        }

        interface captchaInfo {
            /**
             * 验证码id
             */
            uuid: string;

            /**
             * 验证码内容
             */
            vcode: string;
        }
    }
}