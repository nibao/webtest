declare namespace Components {
    namespace Link {
        type Props = {
            link: APIs.EFSHTTP.Link.Get;

            onVerify?: Function;
        }

        type State = {
            // 尝试过密码
            passwordTried: boolean;
        }

        interface Base {
            props: Props;

            state: State;
        }
    }
}