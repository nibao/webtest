declare namespace Components {
    namespace MyShare {
        namespace DetailsList {
            interface Props extends React.Props<any> {
                /**
                 * 内链访问详情
                 */
                details?: ReadonlyArray<object> | null;
            }
        }
    }
}