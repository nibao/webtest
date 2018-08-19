declare namespace Core {
    namespace Link {
        type Info = {
            link: string;
            password?: string;
            docid?: string;
        }

        /**
         * 文件下载
         */
        interface Download {
            link: string;
            password?: string;
            docid?: string;
            savename?: string;
        }
    }
}