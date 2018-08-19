declare namespace Components {
    namespace ShareReview {
        namespace ReviewException {
            interface Props extends React.Props<any> {
                /**
                 * 异常信息
                 */
                exceptionInfo: any;

                /**
                 * 确认审核异常事件
                 */
                onReviewExceptionConfirm: () => void;
            }
        }
    }
}