declare namespace Console {
    namespace ServerUpgrade {
        namespace Upload {
            interface Props extends React.Props<any> {
                /**
                 * 是否挪动到屏幕外面去
                 */
                hide: boolean;

                /**
                 * 处理上传失败
                 */
                onUploadError: (error: any) => any;

                /**
                 * 处理上传成功
                 */
                onUploadSuccess: () => any;

                /**
                 * 处理上传进度
                 */
                onUploadProgress: (progress: number) => any;
            }

            interface State {
                /**
                 * 错误
                 */
                errorCode: number;
            }
        }
    }
}