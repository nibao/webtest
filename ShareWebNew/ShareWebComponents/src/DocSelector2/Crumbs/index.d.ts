declare namespace Components {
    namespace DocSelector2 {
        namespace Crumbs {
            interface Props extends React.Props<any> {
                /**
                 * 路径数组
                 */
                Crumbs: Core.Docs.Docs;

                /**
                 * 路径发生变化，跳转到doc对应的路径
                 */
                onCrumbChange: (doc: Core.Docs.Doc) => void;

                /**
                 * 取消
                 */
                onCancel: () => void;
            }
        }
    }
}