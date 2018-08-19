declare namespace Console {
    namespace MessageSwitch {
        interface State {
            /**
             * 开关勾选状态
             */
            messageSwitch: boolean;

            /**
             * 开关状态是否改动
             */
            changed: boolean;
        }
    }
}