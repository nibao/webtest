/**
 *  任务状态定义
 */
export enum ncTaskStatus {

    /**
     *  未定义
     */
    NC_TS_UNKNOWN = 0x00000000,

    /**
     *  等待执行
     */
    NC_TS_WAITING = 0x00000001,

    /**
     *  暂停执行
     */
    NC_TS_PAUSED = 0x00000002,

    /**
     *  正在执行
     */
    NC_TS_EXECUTING = 0x00000004,

    /**
     *  取消
     */
    NC_TS_CANCELD = 0x00000008,

    /**
     *  完成
     */
    NC_TS_DONE = 0x00000010,
};


/**
 *  任务类型定义
 */
export enum ncTaskType {

    /**
     *  未定义
     */
    NC_TT_UNKNOWN = 0,

    /**
     *  向本地创建目录
     */
    NC_TT_DOWN_CREATE_DIR = 1,

    /**
     *  向本地下载文件
     */
    NC_TT_DOWN_EDIT_FILE = 2,

    /**
     *  向本地删除目录
     */
    NC_TT_DOWN_DELETE_DIR = 3,

    /**
     *  向本地删除文件
     */
    NC_TT_DOWN_DELETE_FILE = 4,

    /**
     *  向本地重命名目录
     */
    NC_TT_DOWN_RENAME_DIR = 5,

    /**
     *  向本地重命名文件
     */
    NC_TT_DOWN_RENAME_FILE = 6,

    /**
     *  向本地修改变化标识
     */
    NC_TT_DOWN_UPDATE_OTAG = 7,

    /**
     *  向本地修改属性
     */
    NC_TT_DOWN_UPDATE_ATTR = 8,

    /**
     *  向本地修改类型名称
     */
    NC_TT_DOWN_UPDATE_TYPENAME = 9,

    /**
     *  向本地修改延迟下载标记
     */
    NC_TT_DOWN_UPDATE_DELAY = 10,

    /**
     *  向云端创建目录
     */
    NC_TT_UP_CREATE_DIR = 11,

    /**
     *  向云端上传文件
     */
    NC_TT_UP_EDIT_FILE = 12,

    /**
     *  向云端秒传文件
     */
    NC_TT_UP_EDIT_DUP_FILE = 13,

    /**
     *  向云端删除目录
     */
    NC_TT_UP_DELETE_DIR = 14,

    /**
     *  向云端删除文件
     */
    NC_TT_UP_DELETE_FILE = 15,

    /**
     *  向云端重命名目录
     */
    NC_TT_UP_RENAME_DIR = 16,

    /**
     *  向云端重命名文件
     */
    NC_TT_UP_RENAME_FILE = 17,

    /**
     *  向本地清除目录
     */
    NC_TT_LOCAL_CLEAN_DIR = 18,

    /**
     *  向本地清除文件
     */
    NC_TT_LOCAL_CLEAN_FILE = 19,

    /**
     *  向云端复制目录
     */
    NC_TT_CLOUD_COPY_DIR = 20,

    /**
     *  向云端复制文件
     */
    NC_TT_CLOUD_COPY_FILE = 21,

    /**
     *  向云端移动目录
     */
    NC_TT_CLOUD_MOVE_DIR = 22,

    /**
     *  向云端移动文件
     */
    NC_TT_CLOUD_MOVE_FILE = 23,

    /**
     *  向盘外直接下载目录
     */
    NC_TT_DIRECT_DOWNLOAD_DIR = 24,

    /**
     *  向盘外直接下载文件
     */
    NC_TT_DIRECT_DOWNLOAD_FILE = 25,

    /**
     *  向云端直接上传目录
     */
    NC_TT_DIRECT_UPLOAD_DIR = 26,

    /**
     *  向云端直接上传文件
     */
    NC_TT_DIRECT_UPLOAD_FILE = 27,

    /**
     *  向云端还原历史版本
     */
    NC_TT_RESTORED_VERSION = 28,

    /**
     *  向云端上传目录
     */
    NC_TT_COMPLETE_UPLOAD_DIR = 29,

    /**
     *  向本地预览文件
     */
    NC_TT_PREVIEW_FILE = 30,

    /**
     *  向本地更新文件修改时间
     */
    NC_TT_DOWN_UPDATE_MODIFYTIME_DIR = 31,

    /**
     *  向本地下载延迟文件对象
     */
    NC_TT_DOWN_DELAY_FILE = 32,

    /**
     *  向本地下载文件（自动下载，探测）
     */
    NC_TT_AUTO_DOWN_FILE = 33,
};
