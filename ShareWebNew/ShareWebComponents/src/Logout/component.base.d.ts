declare namespace Components {
    namespace Logout {

        type Props = {
            // 注销成功后跳转页面
            onSuccess: (url: string) => void;
        }

        type State = {
            // 确认注销状态
            confirming: boolean;

        }

        interface Base {
            props: Props,

            state: State
        }

    }
}