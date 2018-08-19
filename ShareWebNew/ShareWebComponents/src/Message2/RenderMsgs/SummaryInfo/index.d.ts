declare namespace Components {
    namespace Message2 {
        namespace RenderMsgs {
            namespace SummaryInfo {
                interface Props {

                    msg: AllMessage // 当前渲染的消息对象数组

                    csfTextArray: Array<string>; // 系统密级枚举

                    csfSysId: string; 

                }
            }
        }
    }
}