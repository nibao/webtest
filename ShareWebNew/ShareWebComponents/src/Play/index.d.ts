/// <reference path="../../core/apis/efshttp/api.d.ts" />

declare namespace Components {
    namespace Play {

        interface Props extends React.Props<any> {
            /**
             * Flash SWF文件路径
             */
            swf?: string;

            /**
             * 播放类型，支持‘video’和'audio'
             */
            type: 'video' | 'audio';

            /**
             * 视频播放的文档对象
             */
            doc?: Core.Docs.Doc;

            /**
             * 视频播放的外链对象
             */
            link?: Core.Link.Info;

            /**
             * 预览过程中出现错误
             */
            onError: (errcode: number) => void;
        }

        interface State {
            /**
             * 是否显示侧栏
             */
            active: boolean;

            /**
             * 播放状态
             */
            status: number;

            /**
             * 播放信息
             */
            playInfo?: Core.APIs.EFSHTTP.PlayInfo;

            /**
             * 视频播放地址
             */
            src?: string;

            /**
             * 清晰度
             */
            definition?: 'od' | 'sd';

            /**
             * IE8 下载地址
             */
            downloadUrl?: string;
        }
    }
}