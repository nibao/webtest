declare namespace Util {
    namespace Browser {
        type UserAgent = {
            // 系统架构 32/64 位
            platform?: number;

            // 浏览器详细版本
            version?: number;

            // 浏览器型号
            app?: number;

            // 是否是移动设备
            mobile?: boolean;

            //操作系统
            os?: any;
        }
    }
}