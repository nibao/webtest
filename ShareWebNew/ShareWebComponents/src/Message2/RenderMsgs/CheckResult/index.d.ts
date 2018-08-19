declare namespace Components {
    namespace Message2 {
        namespace RenderMsgs {
            namespace CheckResult {
                interface Props {
                    resultMsg: AllMessage; // 消息结果对象

                    closeResultDialog: () => void; // 关闭审核结果弹窗
                }
            }
        }
    }
}