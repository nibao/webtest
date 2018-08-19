declare namespace Components {
    namespace SideNav {

        interface Props extends React.Props<any> {
            /**
             * 侧边导航栏条目
             */
            nav: ReadonlyArray<ChildNav>;
        }

        interface State {
            /**
             * 具体消息的未读条数
             */
            specificMsgNum: {
                /**
                 * 共享消息
                 */
                shareMsgNum: number;

                /**
                 * 审核消息
                 */
                checkMsgNum: number;

                /**
                 * 安全消息
                 */
                securityMsgNum: number;
            }

            /**
             * 待审核数目
             */
            auditNum: {
                /**
                 * 共享审核
                 */
                shareApv: number;

                /**
                 * 流程审核
                 */
                flowApv: number;
            }
        }

        /**
         * 侧边导航栏
         */
        type ChildNav = {
            /**
             * 显示文字
             */
            label: string;

            /**
             * 显示图标
             */
            icon: string;

            /**
             * 路径
             */
            path: string;
        }
    }
}