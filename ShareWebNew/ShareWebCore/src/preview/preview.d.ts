declare namespace Core {
    namespace Preview {
        /**
         * 预览参数
         */
        type PreviewOSS = {
            // 外链id
            link?: string;

            // 文档docid
            docid?: string;

            // 文档版本
            rev?: string;

            // 外链密码
            password?: string;

            // 是否使用https
            usehttps?: boolean;

            // OSS URL访问地址
            reqhost?: string;

            // 文档名
            name: string;

            // 权限
            perm: number;

            // userid
            userid?: string;

            // tokenid
            tokenid?: string;

            // 是否非法内容隔离区文件
            illegalContentQuarantine?: boolean;
        }

        /**
         * 预览信息
         */
        type PreviewOSSInfo = {

        }
    }
}

declare const PDFJS: any