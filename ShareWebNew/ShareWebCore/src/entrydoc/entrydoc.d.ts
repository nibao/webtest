/// <reference path="../apis/eachttp/entrydoc/entrydoc.d.ts" />

declare namespace Core {
    namespace EntryDoc {
        /**
         * 获取所有入口文档
         * @param [options]
         * @param [options.update] 是否缓存
         */
        type QueryAll = (options?: { update?: boolean }) => Promise<Array<APIs.EACHTTP.EntryDoc.EntryDoc>>;
    }
}