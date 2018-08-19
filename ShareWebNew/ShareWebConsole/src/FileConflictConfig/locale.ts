import i18n from '../i18n'
export default i18n([
    [
        '文件冲突策略',
        '檔案衝突策略',
        'File Conflict Policy',
    ],
    [
        '启用文件锁机制',
        '啟用檔案鎖機制',
        'Enable File Lock'
    ],
    [
        '当多人同时编辑一个文件时，第一个打开的人将自动锁定文件，其他人以只读模式打开，直到锁定的人关闭此文件，才会自动解锁',
        '當多人同時編輯一個檔案時，第一個打開的人將自動鎖定檔案，其他人以唯讀模式打開，直到鎖定的人關閉此檔案，才會自動解鎖',
        'File will be auto locked by the one who open it first and others can read only. It will also be auto unlocked once closed.'
    ],
    [
        '保存',
        '儲存',
        'Save'
    ],
    [
        '取消',
        '取消',
        'Cancel'
    ],
    [
        '保存成功',
        '儲存成功',
        'Save successfully'
    ],
    [
        '启用 文件锁机制 成功',
        '啟用 檔案鎖機制 成功',
        'Enable File Lock successfully'
    ],
    [
        '禁用 文件锁机制 成功',
        '禁用 檔案鎖機制 成功',
        'Disable File Lock successfully'
    ],
    [
        '客户端异常断开后，原登录用户锁定的文件',
        '用戶端異常斷開后，原登入使用者鎖定的檔案',
        'If client disconnected abnormally, file(s) that locked by the previous user'
    ],
    [
        '自动解锁',
        '自動解鎖',
        'would be unlocked automatically'
    ],
    [
        '保存失败。错误原因:',
        '保存失敗。錯誤原因:',
        'Save failed. Error:'
    ],
    [
        '永不解锁',
        '永不解鎖',
        'Never unlock'
    ],
    [
        '超时解锁的时间间隔：${fileLockTimeout}',
        '超時解鎖的時間間隔：${fileLockTimeout}',
        'Timeout unlock interval:${fileLockTimeout}'
    ],
    [
        '超过3分钟',
        '超過3分鐘',
        'for over 3 minutes '
    ],
    [
        '超过10分钟',
        '超過10分鐘',
        'for over 10 minutes'
    ],
    [
        '超过30分钟',
        '超過30分鐘',
        'for over 30 minutes'
    ],
    [
        '超过1小时',
        '超過1小時',
        'for over 1 hour'
    ],
    [
        '超过5小时',
        '超過5小時',
        'for over 5 hours'
    ],
    [
        '超过12小时',
        '超過12小時',
        'for over 12 hours'
    ],
    [
        '超过24小时',
        '超過24小時',
        'for over 24 hours'
    ],
    [
        '永不',
        '永不',
        'never'
    ],
    [
        '文件锁超时时间不合法',
        '檔案鎖超時時間不合法',
        'Invalid file lock timeout value'
    ]
])