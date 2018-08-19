declare namespace Components {
    namespace ShareReview {
        namespace Crumbs {
            interface Props extends React.Props<any> {
                /**
                 * 路径数组
                 */
                crumbs: ReadonlyArray<any>;

                /**
                 * className
                 */
                className?: string;

                /**
                 * 路径发生变化
                 */
                onCrumbChange: (doc: any) => any;
            }
        }
    }
}