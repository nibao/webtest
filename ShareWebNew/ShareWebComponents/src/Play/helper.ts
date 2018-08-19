
/**
 * 播放状态
 */
export enum Status {
    // 正在转码
    CONVERTING,

    // 暂停
    PAUSE,

    // 播放中
    PLAYING,

    // 播放失败
    FAIL,

    // 空间不足
    LOW_DISK,

    /**
     * 没有权限
     */
    NO_PERMISSION
}

/**
 * 播放类型
 */
export enum PlayType {
    // 视频
    VIDEO = 'video',

    // 音频
    AUDIO = 'audio',
}

/**
 * 清晰度
 */
export const Definition = {
    // 原始画质
    OD: 'od',

    // 标清画质
    SD: 'sd'
}