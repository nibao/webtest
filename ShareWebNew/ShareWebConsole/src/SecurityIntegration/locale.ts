import i18n from '../i18n';

export default i18n([
    [
        '初始化配置',
        '初始化設定',
        'Initialization'
    ],
    [
        '确定',
        '確定',
        'OK'
    ],
    [
        '取消',
        '取消',
        'Cancel'
    ],
    [
        '系统密级策略',
        '系統密級策略',
        'Security Level Policy'
    ],
    [
        '系统密级：',
        '系統密級：',
        'Current Security Level'
    ],
    [
        '非密',
        '非密',
        'Unclassified'
    ],
    [
        '内部',
        '內部',
        'Internal'
    ],
    [
        '秘密',
        '秘密',
        'Secret'
    ],
    [
        '机密',
        '機密',
        'Confidential'
    ],
    [
        '绝密',
        '絕密',
        'Top Secret'
    ],
    [
        '自定义密级',
        '自訂密級',
        'Custom Level'
    ],
    [
        '系统密级是指服务器的最高密级等级，系统中任何用户和文件的密级都不能高于此密级上限',
        '系統密級是指伺服器的最高密級等級，系統中任何使用者和檔案的密級都不能高於此密級上限',
        'It refers to server security level, which is higher than user and file security level'
    ],
    [
        '密码策略',
        '密碼策略',
        'Password Policy'
    ],
    [
        '密码有效期：',
        '密碼有效期間：',
        'Password Validity'
    ],
    [
        '1天',
        '1天',
        '1 day'
    ],
    [
        '3天',
        '3天',
        '3 days'
    ],
    [
        '7天',
        '7天',
        '7 days'
    ],
    [
        '1个月',
        '1個月',
        '1 month'
    ],
    [
        '3个月',
        '3個月',
        '3 months'
    ],
    [
        '6个月',
        '6個月',
        '6 months'
    ],
    [
        '12个月',
        '12個月',
        '12 months'
    ],
    [
        '永久有效',
        '永久有效',
        'Permanent'
    ],
    [
        '密码仅在指定时间段内有效，若超过该有效期，则需要修改密码，否则无法登录',
        '密碼僅在指定時間段內有效，若超過該有效期，則需要修改密碼，否則無法登入',
        'Password will expire after validity period. And then change it to log in again'
    ],
    [
        '密码强度：',
        '密碼強度：',
        'Password Strength'
    ],
    [
        '强密码',
        '強密碼',
        'Strong Password'
    ],
    [
        '弱密码',
        '弱密碼',
        'Weak Password'
    ],
    [
        '强密码格式：密码长度至少为8个字符，需同时包含大小写字母及数字',
        '強密碼格式:密碼至少為8個字元,需同時包含大小寫字母及數位',
        'Strong Password: Password should be numbers, letters in both uppercase and lowercase with more than 8 characters'
    ],
    [
        '弱密码格式：密码长度至少为6个字符',
        '弱密碼格式：密碼長度至少為6個字元',
        'Password should be at least 6 characters'
    ],
    [
        '启用密码错误锁定：',
        '啟用密碼錯誤鎖定：',
        'Enable Password Lock'
    ],
    [
        '用户登录时，若连续输错密码',
        '使用者登入時，若連續輸錯密碼',
        'Account will be auto locked and cannot log in within 1 hour after'
    ],
    [
        '次，则账号将被锁定，1小时后自动解锁或由管理员手动解锁（涉密模式下不自动解锁）',
        '次，則帳號將被鎖定，1小時後自動解鎖或由管理員手動解鎖（涉密模式下不自動解鎖）',
        'wrong password attempts. Admin can manually unlock this account. (Account will not be auto unlocked in Security mode)'
    ],
    [
        '请从低到高依次定义新的密级：',
        '請從低到高依次定義新的密級：',
        'Please add security level from lower to higher:'
    ],
    [
        '新增密级',
        '新增密級',
        'Add Security Level'
    ],
    [
        '密级',
        '密級',
        'Security Level'
    ],
    [
        '操作',
        '操作',
        'Operation'
    ],
    [
        '当前为涉密模式，初始化配置完成后将无法更改，请确认您的操作。',
        '當前為涉密模式，初始化設定完成後將無法更改，請確認您的操作。',
        'It is security mode now and once initialization is complete, it will be irrevocable. Please confirm your operation.'
    ],
    [
        '自定义密级完成后将无法更改系统中各个密级等级，请确认您的操作。',
        '自訂密級完成後，將無法更改系統中各個密級等級，請確認您的操作。',
        'Once the security levels are set, they will be irrevocable and cannot be changed, please confirm!'
    ],
    [
        '密码错误次数范围为1~${num}，请重新输入。',
        '密碼錯誤次數範圍為1~${num}，請重新輸入。',
        'Password attempts should be within 1~${num}, please enter again.'
    ],
    [
    '不能包含 / : * ? " < > | 特殊字符，请重新输入。',
    '不能包含 / : * ? " < > | 特殊字元，請重新輸入。',
    'Security level cannot contain / : * ? " < > | special character, please enter again.'
    ],
    [
        '该密级名称已存在。',
        '該密級名稱已存在。',
        'The same name level already exists.'
    ],
    [
        '您最多只能设置11个密级。',
        '您最多隻能設定11個密級。',
        'At most 11 security levels can be added.'
    ],
    [
        '将密级从低到高自定义为“${secu}”成功',
        '將密級從低到高自訂為“${secu}”',
        'The security levels from lower to higher are successfully set as“${secu}”'
    ],
    [
        '将系统密级设置为 “${level}” 成功',
        '將系統密級設定為 “${level}” 成功',
        'Set system security level as “${level}” successfully'

    ],
    [
        '原密级为“${originalLevel}”',
        '原密級為“${originalLevel}”',
        'Original security level is “${originalLevel}”'
    ],
    [
        '设置 密码策略 成功',
        '設定 密碼策略 成功',
        'Set password policy succeeded'
    ],
    [
        '启用 密码错误锁定，最大连续输错密码次数为${passwdErrCnt}次',
        '啟用 密碼錯誤鎖定，最大連續輸錯密碼次數為${passwdErrCnt}次',
        'Enable password lock, the maximum password attempts should be ${passwdErrCnt}'
    ],
    [
        '关闭 启用 密码错误锁定，最大连续输错密码次数为${passwdErrCnt}次',
        '關閉 密碼錯誤鎖定，最大連續輸錯密碼次數為${passwdErrCnt}次',
        'Disable password lock, the maximum password attempts should be ${passwdErrCnt}'
    ],
    [
        '密级名不能为空。',
        '密級名不能為空。',
        'Secret name cannot be empty.'
    ]

])