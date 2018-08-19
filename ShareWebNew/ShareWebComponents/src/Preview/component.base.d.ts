declare namespace Components {
    namespace Preview {
        /**
         * 预览参数
         */
        interface Props {
            // 外链预览
            link?: APIs.EFSHTTP.Link.Get;

            // 文档对象预览，如果通过外链目录预览，则需要同时传递link与doc
            doc?: Core.Docs.Doc;

            // 是否非法内容隔离区文件
            illegalContentQuarantine?: boolean;

            onIncompatiable?: () => {};

            /**
             * 是否跳过下载权限检查(权限审核和流程审核需要跳过下载权限检查，直接显示下载按钮)
             */
            skipPermissionCheck: boolean;

            /**
             * 预览出错
             */
            onError: (errcode: number) => void;

        }

        interface State {
            // 加密文档的密码
            password?: string;
        }

        interface Base {
            state: {
                // PDFDocument
                pdf: any;

                // 缩放比例
                zoom: number;

                // 文档状态
                status?: number;

            };

            props: Props
        }
    }
}