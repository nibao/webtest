/// <reference path="../apis/eachttp/entrydoc/entrydoc.d.ts" />
/// <reference path="../apis/efshttp/dir/dir.d.ts" />

declare namespace Core {
    namespace Docs {
        /**
         * 文档对象
         * 包含入口文档或列举文档
         */
        type Doc = APIs.EFSHTTP.Doc | APIs.EACHTTP.EntryDoc.EntryDoc;

        /**
         * 文档对象列表
         */
        type Docs = Array<Doc>;

        /**
         * 虚拟目录
         */
        type VirtualDoc = {
            docid: string;
            docname: string;
            doctype: string;
            typename: string;
        }

        /**
         * 文件下载
         */
        type Download = {
            docid: string;
            rev?: string;
            userid?: string;
            tokenid?: string;
            savename?: string;
        }
    }
}