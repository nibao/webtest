declare namespace Components {
    namespace Message2 {
        namespace RenderMsgs {
            namespace SecurityMsgs {

                interface Props {
                    msgs: ReadonlyArray<AllMessage> // 当前渲染的消息对象数组   

                    csfTextArray: Array<string>; // 系统密级枚举

                    csfSysId: string;

                    onRead: (msg: AllMessage) => void; // 处理点击阅读

                    showResultDialog: (msg: AllMessage) => void; // 显示审核结果弹窗

                    doPreview: (msgDoc: MessageDoc) => void; // 处理预览

                    doCheck: (msgDoc: MessageDoc) => void; // 处理审核

                    doRedirect: (msgDoc: MessageDoc) => void; // 处理跳转

                }
            }
        }
    }
}