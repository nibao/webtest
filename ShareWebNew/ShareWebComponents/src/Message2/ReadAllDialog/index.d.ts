declare namespace Components {
    namespace Message2 {
        namespace ReadAllDialog {
            interface Props {
                /**
                 * 当前显示消息类型
                 * 1:共享消息
                 * 2:审核消息
                 * 3:安全消息
                 */
                showMsgType: number;
                /*
                 * 处理点击确认阅读所有未读消息 
                */
                handleSubmitReadAll: () => void;
                /* 
                 * 处理隐藏阅读所有弹窗
                */
                handleHideReadAll: () => void;
            }
        }
    }
}