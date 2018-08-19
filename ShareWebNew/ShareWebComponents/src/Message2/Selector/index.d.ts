declare namespace Components {
    namespace Message2 {
        namespace Selector {
            interface Props {
                /**
                 * 选中的消息类型
                 * 1：全部消息 
                 * 2：未读消息 
                 * 3：已读消息
                 */
                selectedMode: number;
                /**
                 * 消息改变触发函数
                 */
                onChangeMode: (selectedMode:number) => void;
            }
        }
    }
}