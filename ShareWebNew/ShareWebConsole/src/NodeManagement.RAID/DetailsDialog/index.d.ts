declare namespace Components {
    namespace NodeManagement {
        namespace DetailsDialog {
            interface Props extends React.Props<any> {
                /**
                 * 设备ID
                 */
                id: string;

                /**
                 * 设备详情
                 */
                details: object;

                /**
                 * 关闭对话框
                 */
                onDetailClose: () => any;
            }
        }
    }
}