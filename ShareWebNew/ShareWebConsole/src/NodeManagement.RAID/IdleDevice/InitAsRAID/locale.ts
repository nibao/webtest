import i18n from '../../../i18n';

export default i18n([
    [
        '初始化RAID',
        '初始化RAID',
        'Initialize RAID',
    ],
    [
        'RAID级别：',
        'RAID級別：',
        'RAID Level：',
    ],
    [
        '磁盘组合策略：',
        '磁碟組合策略：',
        'Disk Group Strategy：',
    ],
    [
        '每组${item}块磁盘',
        '每組${item}塊磁碟',
        '${item} disk(s) each group',
    ],
    [
        '注意：对磁盘进行初始化后，还需将其加入存储池内方可正常使用。',
        '注意：對磁碟進行初始化后，還需將其加入儲存池內方可正常使用。',
        'Note: You must add disk into storage pool after initialization and then use it.',
    ],
    [
        '确定',
        '確定',
        'OK',
    ],
    [
        '取消',
        '取消',
        'Cancel',
    ],
    [
        '此操作将生成${groups}组逻辑设备，每组包含${num}个磁盘，并删除盘内所有数据，您确定要执行此操作吗？',
        '次操作將生成${groups}組邏輯設備，每組包含${num}個磁碟，并刪除磁碟內的所有數據，您確定要執行此操作嗎？',
        'This operation will generate ${groups} group of logical devices, each group contains ${num} disk(s), and all data in these disks will be deleted, are you sure to continue?',
    ],
    [
        '正在执行RAID初始化，请稍候......',
        '正在執行RAID初始化，請稍後......',
        'Initializing RAID, please wait...',
    ],
    [
        '磁盘RAID初始化成功',
        '磁碟RAID初始化成功',
        'Disk RAID initialization succeeded',
    ],
    [
        '磁盘RAID初始化失败，错误信息如下：',
        '磁碟RAID初始化失敗，錯誤資訊如下：',
        'Disk RAID initialization failed, error:',
    ],
    [
        '执行 RAID初始化磁盘设备“${nodeIp}”：${pdDevid} 成功',
        '執行 RAID初始化磁碟盤設備“${nodeIp}”：${pdDevid} 成功',
        'RAID initialization disk device“${nodeIp}”：${pdDevid} Succeeded',
    ],
    [
        'RAID策略： “${Raid}”',
        'RAID策略： “${Raid}”',
        'RAID strategy: “${Raid}”',
    ],
]);