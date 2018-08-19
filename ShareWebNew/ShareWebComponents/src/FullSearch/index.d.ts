declare namespace Components {
    namespace FullSearch {
        interface Props extends React.Props<any> {
            /**
             * 搜索关键词
             */
            searchKeys: string;

            /**
             * 匹配内容
             */
            searchRange: { docid: string, root: boolean };

            /**
             * 搜索标签
             */
            searchTags: string;

            /**
             * 打开新标签页
             */
            doOpen(doc: Core.Docs.Doc): void;

            /**
            * 打开窗口时触发
            */
            onOpenFullSearchDialog?: (nwwindow) => any;

            /**
             * 弹窗关闭时执行
             */
            onCloseDialog?: () => any;

            /**
             * 跳转至权限申请
             */
            doApprovalCheck?: () => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }

        interface State {

        }
    }
}