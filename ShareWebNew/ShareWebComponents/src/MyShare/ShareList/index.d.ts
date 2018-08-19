declare namespace Components {
    namespace MyShare {
        namespace ShareList {
            interface Props extends React.Props<any> {
                /**
                 * 内链共享列表数据
                 */
                docs?: ReadonlyArray<Core.APIs.EACHTTP.SharedDocs> | null;

                /**
                 * 选中的列表数据
                 */
                selection?: ReadonlyArray<Core.APIs.EFSHTTP.GetLinkedResult>;

                /**
                 * 内链共享文件详情
                 */
                shareDocDetail?: ReadonlyArray<Core.APIs.EACHTTP.PermInfo>;

                /**
                 * 要显示详情的文件
                 */
                record: Core.APIs.EACHTTP.SharedDocs;

                /**
                 * 选中项发生改变时，通知父元素更新selection
                 */
                onSelectionChange?: (doc: Core.APIs.EACHTTP.SharedDocs) => any;

                /**
                 * 双击列表执行打开文件操作
                 */
                onRowDoubleClicked?: (event) => void;

                /**
                 * IconGroup点击事件
                 */
                onIconGroupClick: (e, doc) => any;

                /**
                * 取消内链共享
                */
                doShareCancel?: (doc: Array<Core.APIs.EACHTTP.SharedDocs>) => any;

                /**
                 * 查看内链共享详情
                 */
                doShareDetailShow?: (e, doc: Core.APIs.EACHTTP.SharedDocs) => any;

                /**
                * 预览文件
                */
                doFilePreview?: (e, doc: Core.APIs.EACHTTP.SharedDocs) => any;

                /**
                * 打开文件所在位置
                */
                doDirOpen?: (doc: Core.APIs.EACHTTP.SharedDocs) => any;

                /**
                 * 内链共享
                 */
                doShare?: (doc: Core.APIs.EACHTTP.SharedDocs) => any;
            }
        }
    }
}