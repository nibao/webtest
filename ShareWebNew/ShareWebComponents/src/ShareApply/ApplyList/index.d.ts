
declare namespace Components {
    namespace ShareApply {
        namespace ApplyList {
            interface Props extends React.Props<any> {
                /**
                 * 选择的权限申请类型（全部申请|待审核|已审核）
                 */
                type: number;

                /**
                 * 权限申请列表数据
                 */
                docs?: ReadonlyArray<Core.APIs.EACHTTP.MyApplys | Core.APIs.EACHTTP.ShareApplyHistorys>;

                /**
                 * 选中的列表数据
                 */
                selection?: Core.APIs.EACHTTP.MyApplys | Core.APIs.EACHTTP.ShareApplyHistorys;

                /**
                * 预览文件
                */
                doFilePreview?: (e, doc: Core.APIs.EACHTTP.MyApplys | Core.APIs.EACHTTP.ShareApplyHistorys) => any;

                /**
                * 打开文件所在位置
                */
                doDirOpen?: (doc: Core.APIs.EACHTTP.MyApplys | Core.APIs.EACHTTP.ShareApplyHistorys) => any;

                /**
                * 下载
                */
                doDownload: (e, doc: Core.APIs.EACHTTP.MyApplys | Core.APIs.EACHTTP.ShareApplyHistorys) => any;

                /**
                 * 选中项发生改变时，通知父元素更新selection
                 */
                onSelectionChange?: (doc: Core.APIs.EACHTTP.MyApplys | Core.APIs.EACHTTP.ShareApplyHistorys) => any;

                /**
                 * 双击列表执行打开文件操作
                 */
                onRowDoubleClicked?: (event) => void;

                /**
                 * 搜索关键字
                 */
                searchValue?: ReadonlyArray<object>;
            }
        }
    }
}