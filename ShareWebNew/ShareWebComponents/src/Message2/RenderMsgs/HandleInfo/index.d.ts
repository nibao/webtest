declare namespace Components {
    namespace Message2 {
        namespace RenderMsgs {
            namespace HandleInfo {
                interface Props {
                    msg: AllMessage // 当前渲染的消息对象

                    msgsDoc: {
                        [id: string]: MessageDoc; // 根据消息对象构造出的文档对象
                    }

                    doCheck: (msgDoc: MessageDoc) => void; // 处理审核

                    doRedirect: (msgDoc: MessageDoc) => void; // 处理跳转

                    showResultDialog: (msg: AllMessage) => void; // 显示审核结果弹窗
                }
            }
        }
    }
}