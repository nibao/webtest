declare namespace Console {
    namespace ClientUpgrade {
        namespace Upload {
            interface Props extends React.Props<any> {
                /**
                 * 客户端类型
                 */
                osType: number;

                /**
                 * 是否挪动到屏幕外面去
                 */
                hide: boolean;

                /**
                 * 上传失败
                 */
                onUploadError: (error: any) => any;

                /**
                 * 上传成功
                 */
                onUploadSuccess: () => any;

                /**
                 * 处理上传进度
                 */
                onUploadProgress: (progress: number) => any;
            }

            interface State {
                /**
                 * 上传的文件
                 */
                packageFile: any;

                /**
                 * 强制 or 非强制 模式
                 */
                mode: number;

                /**
                 * 错误码
                 */
                errorCode: number;
            }
        }
    }
}