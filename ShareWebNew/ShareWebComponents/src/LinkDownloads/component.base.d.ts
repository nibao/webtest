/// <reference path="../../core/apis/eachttp/entrydoc/entrydoc.d.ts" />
/// <reference path="../../core/apis/efshttp/file/file.d.ts" />

import { ReqStatus } from './helper';

declare namespace Components {
    namespace LinkDownloads {


        interface Props {
            /**
             * 外链参数
             */
            doc: APIs.EACHTTP.EntryDoc.EntryDoc | APIs.EFSHTTP.Doc;
        }

        interface State {
            /**
             * 文件列表
             */
            files: Array<Object>;

            /**
             * 访问详情列表
             */
            statistics: Array<Object>;

            /**
             * 状态码
             */
            reqStatus: ReqStatus
        }

        interface Base {
            props: Props;

            state: State;
        }
    }
}