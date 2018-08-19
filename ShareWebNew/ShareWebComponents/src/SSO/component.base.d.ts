declare namespace Components {
    namespace SSO {

        type Props = {
            //第三方认证数据
            params: any;
        }

        interface Base {
            props: Props;
        }
    }
}