declare namespace Components {
    namespace Message2 {
        namespace NomsgTip {
            interface Props {
                /**
                 * 当前显示消息类型
                 * 1:共享消息
                 * 2:审核消息
                 * 3:安全消息
                 */
                showMsgType: number;
                /**
                 * 当前选择消息类型
                 * 1-全部 
                 * 2-未读 
                 * 3-已读
                 */
                selectedMode: number;
            }
        }
    }
}