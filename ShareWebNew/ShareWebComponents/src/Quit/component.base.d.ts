import { DocType } from './helper';

declare namespace Components {
    namespace Quit {
        type Props = {
            /**
             * 要屏蔽的文档参数列表
             */
            docs: Array<Object>,
            /**
             * 文档类型参数
             */
            docType: DocType,

            onCloseDialog?: Function,
            onCancel?: Function,
            onSuccess: Function,
            onError: Function,
            onSingleSuccess: Function
        }
        type State = {
            /**
             * 开始屏蔽
             */
            start: boolean
        }
        interface Base {
            props: Props;
            state: State;
        }
    }
}