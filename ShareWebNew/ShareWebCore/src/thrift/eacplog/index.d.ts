declare namespace Core {
    namespace EACPLog {

        /******************************数据类型定义********************************/

        /**
         * 获取日志数量参数
         */
        interface ncTGetLogCountParam {
            /**
             * 用户id
             */
            userId: string;

            /**
             * 日志类别
             */
            logType: number;

            /**
             * 起始日期
             */
            startDate: number;

            /**
             * 截止日期
             */
            endDate: number;

            /**
             * 日志级别，支持选择多个，精确匹配
             */
            levels: number;

            /**
             * 操作类型，支持选择多个，精确匹配
             */
            opTypes: Array<number>;

            /**
             * 显示名称，支持选择多个，精确匹配
             */
            displayNames: Array<string>;

            /**
             * 来源ip，支持选择多个，精确匹配
             */
            ips: Array<string>;

            /**
             * mac，支持选择多个，精确匹配
             */
            macs: Array<string>;

            /**
             * 内容，支持选择多个，模糊匹配
             */
            msgs: Array<string>;

            /**
             * 附加信息，支持选择多个，模糊匹配
             */
            exMsgs: Array<string>;

        }

        /**
         * 日志数量信息
         */
        type ncTLogCountInfo = {
            /**
             * 日志数量
             */
            logCount: number;

            /**
             *  最大的logId
             */
            maxLogId: number;
        }


        /********************************** 函数声明*****************************/

        type GetLogCount = Core.APIs.ThriftAPI<
            [ncTGetLogCountParam],
            ncTLogCountInfo
            >


    }
}