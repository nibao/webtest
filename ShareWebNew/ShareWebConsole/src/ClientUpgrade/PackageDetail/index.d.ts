declare namespace Console {
    namespace ClientUpgrade {
        namespace PackageDetail {
            interface Props extends React.Props<any> {
                /**
                 * 包信息
                 */
                packageinfo: any;

                /**
                 * 客户端类型
                 */
                osType: number;

                /**
                 * 删除包
                 */
                onDeletePackage: () => any;
            }
        }
    }
}