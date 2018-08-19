import i18n from '../i18n';

export default i18n([
    [
        '启用文档库IP网段限制：请将IP网段与文档库（包括归档库）绑定，被绑定的文档库只能在指定的网段内访问，未被绑定的文档库不受限制。',
        '啟用文件庫IP網段限制：請將IP網段與文件庫（包括歸檔庫）繫結，被繫結的文件庫只能在指定的網段內被存取，未被繫結的文件庫不受限制。',
        'Enable Library Segment Limit: Bind library (including archive library) to IP segment and the library can only be accessed within bound segment. The library unbound is not restricted.'
    ],
    [
        '添加网段',
        '新增網段',
        'Add segment'
    ],
    [
        '请输入IP',
        '請輸入IP',
        'Please enter IP'
    ],
    [
        'IP地址',
        'IP位址',
        'IP Address'
    ],
    [
        '子网掩码',
        '子網路遮罩',
        'Subnet Mask'
    ],
    [
        '操作',
        '操作',
        'Operation'
    ],
    [
        '添加文档库',
        '添加文件庫',
        'Add library'
    ],
    [
        '请输入库名称',
        '請輸入庫名稱',
        'Please enter library name'
    ],
    [
        '绑定的文档库',
        '繫結的文件庫',
        'Bound Library'
    ],
    [
        'IP地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数',
        'IP位址格式形如XXX.XXX.XXX.XXX，每段必須是0~255 之間的整數',
        'IP address should be XXX.XXX.XXX.XXX format and each segment should be integer within 0~255'
    ],
    [
        '子网掩码格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数',
        '子網路遮罩格式形如XXX.XXX.XXX.XXX，每段必須是0~255 之間的整數',
        'Subnet mask should be  XXX.XXX.XXX.XXX format and  each segment should  be integer within 0~255'
    ],
    [
        '启用 文档库IP网段限制 成功',
        '啟用 文件庫IP網段限制 成功',
        'Enable library segment limit successfully'
    ],
    [
        '关闭 文档库IP网段限制 成功',
        '關閉 文件庫IP網段限制 成功',
        'Disable library segment limit successfully'
    ],
    [
        '解除IP网段与文档库/归档库“${lib}”的绑定 成功',
        '解除IP網段與文件庫/歸檔庫“${lib}”的繫結 成功',
        'Unbind library/archive library “${lib}” from IP network segment successfully'
    ],
    [
        '解除绑定的IP为${ip}，${subNetMask}',
        '解除繫結的IP為${ip}，${subNetMask}',
        'Unbound IP: ${ip}, ${subNetMask}'
    ],
    [
        'IP网段绑定文档库/归档库“${libs}” 成功',
        'IP網段繫結文件庫/歸檔庫“${libs}” 成功',
        'Bind library/archive library “${libs}” to IP network segment successfully'
    ],
    [
        '绑定的IP为${ip}，${subNetMask}',
        '繫結的IP為${ip}，${subNetMask}',
        'Bound IP: ${ip}, ${subNetMask}'
    ],
    [
        '该网段设置已存在，无法重复添加',
        '該網段設定已存在，無法重複新增',
        'This segment has  been set, you cannot add it repeatedly'
    ]
])