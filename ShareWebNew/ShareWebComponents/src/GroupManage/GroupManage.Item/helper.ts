/**
 * 输入框气泡状态
 */
export enum ValidateState {
    /**
     * 正常状态，无气泡
     */
    Normal,

    /**
     * 配额最大可分配空间
     */
    MaxSize,

    /**
     * 将所有个人配额都分配给群组
     */
    SizeError,

    /**
     * 群组名称格式错误
     */
    FormError,

    /**
     * 输入项为空
     */
    Empty,

    /**
     * 输入配额大于1000000GB
     */
    LimitError,

    /**
     * 输入配额小于已用空间
     */
    SmallQuota,

    /**
     * 配额空间不足
     */
    QuotaNotEnough
}

