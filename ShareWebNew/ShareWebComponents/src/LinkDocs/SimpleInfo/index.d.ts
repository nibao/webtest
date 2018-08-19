declare namespace Components {
    namespace LinkDocs {
        namespace SimpleInfo {
            interface Props extends React.Props<any> {
                /**
                 * 外链文档对象
                 */
                linkDoc: any;

                /**
                 * 是否有下载权限
                 */
                downloadEnable: boolean;

                /**
                 * 打开文件夹
                 */
                onRequestOpenDir: (linkDoc: any) => any;

                /**
                 * 预览文件
                 */
                onRequestPreviewFile: (linkDoc: any) => any;

                /**
                 * 下载文件
                 */
                onRequestDownload: (docs: ReadonlyArray<any>) => any;

                /**
                 * 转存
                 */
                onRequrestSaveTo: (docs: ReadonlyArray<any>) => any;
            }

        }
    }
}