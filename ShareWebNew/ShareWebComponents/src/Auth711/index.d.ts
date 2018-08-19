declare namespace Components {
    namespace Auth711 {
        interface Props {
            /**
             * 认证成功
             */
            onAuthSuccess: () => void
        }


        interface State {
            /**
             * PIN
             */
            pin: string;

            /**
             * 检查是否出错
             */
            hr?: string | number;

            /**
             * 是否聚焦
             */
            focusing: boolean;
        }
    }
}