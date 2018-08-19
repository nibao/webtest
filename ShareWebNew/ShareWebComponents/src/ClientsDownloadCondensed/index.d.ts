declare namespace Components {
    namespace ClientsDownloadCondensed {
        interface Props extends React.Props<any> {
            /**
             * 客户端升级包未上传回调函数(type:ClientType)
             */
            onClientMiss: (type: number) => any;

            /**
             * 点击下载客户端回调函数
             * @param url:下载链接
             */
            doClientDownload: (url: string) => any;
        }

        interface State {
            /**
             * 客户端下载oem配置
             */
            list: object;
        }
    }
}