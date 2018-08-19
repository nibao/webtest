declare namespace Components {
    namespace Groups {
        interface GropViewProps extends React.Props<any> {
            /**
            * 文档列表
            */
            data: Array<any>;

            /**
             * 是否正在创建群组
             */
            creating?: boolean;

            /**
             * 是否有警告状态的输入框
             */
            warning: boolean;

            /**
            * 当前选中的文档id
            */
            activeId: string | null;

            /**
            * 计算最大可分配空间
            */
            computeMaxSize: (id) => number

            /**
             * 创建群组文档按钮回调
             */
            onCreate: () => any;

            /**
             * 确认创建群组文档
             */
            onConfirmCreate: ({ name, quota }) => any;

            /**
             * 群组文档 编辑按钮回调
             */
            onEdit: (id, index) => any;

            /**
             * 编辑群组文档 保存回调
             */
            onSave: ({ docid, name, quota }) => any;

            /**
             * 群组文档 删除按钮回调
             */
            onDel: (id) => any;

            /**
             * 编辑群组文档 取消按钮回调
             */
            onCancle: () => any;

            /**
             * 错误处理
             */
            onError: (errcode, extraMsg) => any;
        }
    }
}