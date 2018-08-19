declare namespace Console {
    namespace CaptchaConfig {
        interface State {
            /**
             * 登录验证码配置参数
             */
            vcodeConfig: Core.ShareMgnt.ncTVcodeConfig;

            /**
             * 验证表单时候发生改动
             */
            changed: boolean;

            /**
             * 提示保存成功 状态
             */
            succeed: boolean;

            /**
             * 错误码
             */
            errcode?: number;

            /**
             * 文本框的值
             */
            value: string | number;
        }
    }
}