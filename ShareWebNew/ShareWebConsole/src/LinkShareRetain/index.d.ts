declare namespace Console {
    namespace LinkShareRetain {
        interface Props extends React.Props<any> {
            /**
             * 路径前缀
             */
            prefix: string; 
        }

        interface State {
            /**
             * 验证码是否已校验，当重新登录的时候会被置为false
             */
            vCodeVerified: boolean;
        }
    }
}