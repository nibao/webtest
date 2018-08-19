import __ from './locale';

export const enum LimitRateType {
    /**
     * 用户级别限速
     */
    LimitUser,
    
    /**
     * 用户组总体限速
     */
    LimitUserGroup
}

export enum ValidateState {
    Normal,
    Empty,
    LessThanMinimum,
    NoLimit,
    InvalidSpeed
}

export const ValidateMessages = {
    [ValidateState.Empty]: __('此输入项不允许为空'),
    [ValidateState.LessThanMinimum]: __('上传速度值不允许小于200'),
    [ValidateState.InvalidSpeed]: __('速度值必须为正整数')
}