
import { Status } from './helper';

declare namespace Components {
    namespace GroupManage {
        type Props = {
            /**
            * 打开窗口时触发
            */
            onOpenGroupManagedDialog?: (nwwindow) => any;

            /**
             * 弹窗关闭时执行
             */
            onClose?: () => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }

        type State = {
            /**
            * 文档列表
            */
            data: Array<any>;

            /**
            * 当前选中的文档id
            */
            activeId: string | null;

            /**
            * 正在编辑项的index
            */
            activeIndex: number | null;

            /**
            * 删除弹窗显示状态
            */
            delModel: boolean;

            /**
            * 正在编辑条目未完成警告状态
            */
            warning: boolean;

            /**
            * 服务器返回错误码
            */
            errcode: number | null;

            /**
            * 组件状态
            */
            status: Status;

        }
        interface Base {
            state: State
        }
    }

}   