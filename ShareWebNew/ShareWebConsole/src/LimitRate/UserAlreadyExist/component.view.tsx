import * as React from 'react';
import { noop, reduce } from 'lodash';
import MessageDialog from '../../../ui/MessageDialog/ui.desktop';
import { LimitRateType } from '../helper';
import __ from './locale';

const UserAlreadyExist: React.StatelessComponent<Components.LimitRate.UserAlreadyExist.Props> = function UserAlreadyExist({
    limitType,
    userExisted,
    onUserExistedConfirm = noop
}) {
    switch (limitType) {
        case LimitRateType.LimitUser:
            return (
                <MessageDialog onConfirm={onUserExistedConfirm}>
                    {
                        __('${user}已存在于列表中。', {
                            user:
                                reduce(userExisted, (pre, item, index) =>
                                    `${pre}${pre === '' || index === userExisted.length ? '' : ','}${item.objectName}`, '')
                        })
                    }
                </MessageDialog>
            )

        case LimitRateType.LimitUserGroup:
            return (
                <MessageDialog onConfirm={onUserExistedConfirm}>
                    {
                        userExisted.userInfos.length ?
                            __('该用户已存在于列表中。')
                            :
                            __('该部门已存在于列表中。')
                    }
                </MessageDialog>
            )
    }
}

export default UserAlreadyExist