declare namespace Components {
    namespace LinkDocs {
        namespace Crumbs {
            interface Props extends React.Props<any> {
                /**
                 * 路径数组
                 */
                crumbs: ReadonlyArray<any>;

                /**
                 * 是否有上传权限
                 */
                uploadEnable?: boolean;

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