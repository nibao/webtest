
declare namespace Components {
    namespace Personal {

        type Props = {

        }

        type State = {
            //用户显示名
            userName: string;

            //用户帐户名
            account: string;
        }

        interface Base {
            props: Props;
            state: State;
        }

    }
}