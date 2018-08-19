declare namespace Components {
    namespace ShareReview {
        namespace ReviewDialog {
            interface Props extends React.Props<any> {
                /**
                 * 待审核文件
                 */
                fileInReview: Core.APIs.EACHTTP.ApplyApproval;

                /**
                 * 审核事件
                 */
                onShareReview: (applyid: string, result: boolean, msg: string) => void;

                /**
                 * 取消审核事件
                 */
                onCloseReviewDialog: () => void;

            }

            interface State {
                /**
                 * 补充说明
                 */
                comments: string;

                /**
                 * 是否超出限制字数
                 */
                overWords: boolean;

                /**
                 * 审核结果
                 */
                result: boolean;

                /**
                 * 是否禁用提交按钮
                 */
                disableSubmit: boolean;
            }
        }
    }
}