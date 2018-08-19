declare namespace Components {
    namespace Attributes {
        interface Props extends React.Props<void> {
            /**
             * 选中的文件
             */
            docs?: Core.Docs.Docs;

            /**
             * 大小
             */
            size: number;

            /**
             * 密级
             */
            csflevel: number;

            /**
            * 跳转到审核页面
            */
            doApprovalCheck: () => any;

            /**
             * 查看大小
             * @param docs 文档数组
             */
            doViewSize: (docs: ReadonlyArray<Core.Docs.Doc>) => any;

            /**
             * 编辑密级
             */
            doEditCSF: (docs: ReadonlyArray<Core.Docs.Doc>) => any;
        }

        interface State {
            /**
             **  侧边栏显示状态
             */
            panelVisible: boolean;

            /*
            ** 密级按钮的状态
            */
            csfBtnShow: boolean;

            /*
            ** 侧边栏信息
            */
            attributes: Attributes;

            /**
             * 锁定者
             */
            lockername: any;

            /**
             * 文件大小
             */
            size: number | null;

            /**
             * 对接的标密系统ID
             */
            csfSysId: string;

            /**
             * 显示密级详情按钮
             */
            csfDetailsBtnShow: boolean;

            /**
             * 密级枚举数组
             */
            csfTextArray: ReadonlyArray<any>;

            /**
             * 文件密级是否为空
             */
            csfIsNull: boolean;

            /**
             * "文件密级"右侧的按钮点击状态，
             */
            csfBtnStatus: number;
        }

        interface Attributes {
            /**
             * 创建者
             */
            creator: string;

            /**
             * 创建时间
             */
            create_time: number;

            /**
             * 修改者
             */
            editor: string;

            /**
             * 修改时间
             */
            modified: number;

            /**
             * 客户端修改时间(只有文件存在这个属性，文件夹不存在)
             */
            client_mtime: number;

            /**
             * 密级
             */
            csflevel: number;

            /**
             * 归属站点
             */
            site: string;
        }

        interface InitStatus {
            /**
             * 侧边栏显示状态
             */
            panelVisible: boolean;

            /**
             * 侧边栏信息
             */
            attributes: Attributes;

            /**
             * 锁定者
             */
            lockername: any;
        }
    }
}