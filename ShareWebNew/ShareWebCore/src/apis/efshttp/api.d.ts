declare namespace APIs {
    namespace EFSHTTP {
        /**
         * 文档
         */
        type Doc = {
            docid: string;
            name: string;
            rev: string;
            size: number;
            modified: number;
            client_mtime: number;
            attr?: number;
        }
        
        /**
         * 文档属性
         */
        type DocAttributes = {
            uniqueid: string;
            creator: string;
            create_time: number;
            csflevel: number;
            tags: Array<string>;
            name:string;
        }

        /**
         * 列举出的文档列表
         */
        type Docs = {
            dirs: Array<Doc>;
            files: Array<Doc>;
        }

        /**
         * 视频播放信息
         */
        type PlayInfo = {
            // 转码状态：
            // 0.未开始转码
            // 1.正在转码
            // 2.转码完成
            status: number;

            // 原始画质（音质）：
            // 0.无此分辨率；
            // 1.已转码
            odstat: number;

            // 标清
            // 0.无此分辨率；
            // 1.已转码
            sdstat: number;

            // 转码文件的唯一标识id
            docid: string;

            // 转码剩余时间（秒），status为1时返回
            remainingTime: number;
        }
        /**
         * 目录属性
         */
        type DirAttributes = {
            creator: string;
            create_time: number;
            modified: number;
            name: string;
        }


        
    }
}