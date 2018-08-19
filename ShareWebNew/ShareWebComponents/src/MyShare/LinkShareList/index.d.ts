declare namespace Components {
    namespace MyShare {
        namespace LinkShareList {
            interface Props extends React.Props<any> {
                /**
                 * 外链共享列表数据
                 */
                docs?: ReadonlyArray<Core.APIs.EFSHTTP.GetLinkedResult>;

                /**
                 * 选中的列表数据
                 */
                selection?: ReadonlyArray<Core.APIs.EFSHTTP.GetLinkedResult>;

                /**
                 * 选中项发生改变时，通知父元素更新selection
                 */
                onSelectionChange?: (doc: Core.APIs.EFSHTTP.GetLinkedResult) => any;

                /**
                 * 双击列表执行打开文件操作
                 */
                onRowDoubleClicked?: (event) => void;

                /**
                * IconGroup点击事件
                */
                onIconGroupClick: (e, doc) => any;
                /**
                * 预览文件
                */
                doFilePreview?: (e, doc: Core.APIs.EFSHTTP.GetLinkedResult) => any;

                /**
                * 打开文件所在位置
                */
                doDirOpen?: (doc: Core.APIs.EFSHTTP.GetLinkedResult) => any;

                /**
                 * 取消外链共享
                 */
                doLinkShareCancel?: (doc: Core.APIs.EFSHTTP.GetLinkedResult) => any;

                /**
                 * 外链共享
                 */
                doLinkShare?: (doc: Core.APIs.EFSHTTP.GetLinkedResult) => any;

                /**
                 * 查看外链共享详情
                 */
                doLinkShareDetailShow?: (e, doc: Array<Core.APIs.EFSHTTP.GetLinkedResult>) => any;
            }
        }
    }
}