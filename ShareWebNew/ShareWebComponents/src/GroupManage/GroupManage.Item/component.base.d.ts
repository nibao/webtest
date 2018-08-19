import { ValidateState } from './helper';

declare namespace Components {
    namespace GroupManageItem {

        type Props = {
            /**
             * 传入文档信息
             */
            data: object;
        }

        type State = {
            /**
            * 文档名称
            */
            docname: string;

            /**
            * 文档已使用空间大小
            */
            used: number | string;

            /**
            * 文档配额空间大小
            */
            quota: number | string;

            /**
            * 文档docid
            */
            docid: string;

            /**
            * 文档配额输入框气泡
            */
            quotaTip: ValidateState;

            /**
            * 文档名称输入框气泡
            */
            nameTip: ValidateState;

            /**
            * 创建群组文档时确定按钮是否可用
            */
            editDisabled: boolean;

        }

        interface Base {
            state: State,
            props: Props
        }
    }

}   