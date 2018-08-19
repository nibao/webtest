
declare namespace Components {
    namespace Client {

        interface Props {

            // 客户端升级包未上传
            onClientMiss: Function;

            // 点击下载客户端回调
            onClientClick: Function;

            // AnyShare访问地址
            host: string;

            type: number;

        }

        interface State {
            // 确认注销状态
            url: string;

        }

    }
}