import i18n from '../i18n';

export default i18n([
    [
        '移动到',
        '移動到',
        'Move to'
    ], [
        '确定',
        '確定',
        'OK'
    ], [
        '取消',
        '取消',
        'Cancel'
    ], [
        '您可以将当前文件“${docname}”做如下处理：',
        '您可以將當前檔案“${docname}”做如下處理：',
        'You can deal with this file "${docname}" as follows:'
    ], [
        '您可以将当前文件夹“${docname}”做如下处理：',
        '您可以將當前資料夾“${docname}”做如下處理：',
        'You can deal with this folder "${docname}" as follows:'
    ], [
        '移动并保留，当前文件重命名为“${newname}”',
        '移動併保留，當前檔案重命名為“${newname}”',
        'Keep both and rename this file as "${newname}"'
    ], [
        '移动并保留，当前文件夹重命名为“${newname}”',
        '移動併保留，當前資料夾重命名為“${newname}”',
        'Keep both and rename this folder as "${newname}"'
    ], [
        '不要移动，跳过当前操作',
        '不要移動，跳過當前操作',
        'Skip this file'
    ], [
        '为之后所有相同的冲突执行此操作',
        '為之後所有相同的衝突執行此操作',
        'Always do this for the conflicts'
    ], [
        '目标位置已存在同名文档',
        '目標位置已存在同名檔案',
        'The same name file already exists in target location'
    ], [
        '无法执行移动操作',
        '無法執行移動操作',
        'Move failed'
    ], [
        '跳过之后所有相同的冲突提示',
        '跳過之後所有相同的衝突提示',
        'Skip all the same conflict tips'
    ], [
        '您选择的目标文件夹不存在，可能其所在路径发生变更。',
        '您選擇的目的資料夾不存在，可能其所在路徑發生變更。',
        'Target folder does not exist or its location has been changed.'
    ], [
        '文件“${docname}”不存在，可能其所在路径发生变更。',
        '檔案“${docname}”不存在，可能其所在路徑發生變更。',
        'The file "${docname}" does not exist or its location has been changed.'
    ], [
        '文件夹“${docname}”不存在，可能其所在路径发生变更。',
        '資料夾“${docname}”不存在，可能其所在路徑發生變更。',
        'Folder "${docname}" does not exist or its location has been changed.'
    ], [
        '您对选择的目标文件夹“${folderName}”没有新建权限。',
        '您對選擇的目的資料夾“${folderName}”沒有新建權限。',
        'You do not have Create permission for target folder "${folderName}". '
    ], [
        '您选择的目标位置配额空间不足。',
        '您選擇的目標位置配額空間不足。',
        'There is not enough quota in target location.'
    ], [
        '移动并合并，将当前文件夹与同名文件夹合并',
        '移動併合併，將當前資料夾與同名資料夾合併',
        'Merge this folder with the same name folder'
    ], [
        '移动并替换，将当前文件覆盖同名文件',
        '移動並替換，將當前檔案覆蓋同名檔案',
        'Replace the same name file '
    ], [
        '目标位置已存在同名文档，但您对其没有修改权限',
        '目標位置已存在同名檔案，但您對其沒有修改權限',
        'The same name file already exists in target location and you do not have Modify permission'
    ], [
        '目标位置已存在与当前文件夹同名的文件',
        '目標位置已存在與當前資料夾同名的檔案',
        'The same name file already exists in target location'
    ], [
        '目标位置已存在与当前文件同名的文件夹',
        '目標位置已存在與當前檔案同名的資料夾',
        'The same name folder already exists in target location'
    ], [
        '您对同名文件“${docname}”的密级权限不足。',
        '您對同名檔案“${docname}”的密級權限不足。',
        'Your security level is lower than that of the same name file "${docname}".'
    ], [
        '无法执行覆盖操作',
        '無法執行覆蓋操作',
        'Replace failed'
    ], [
        '文件“${docname}”已被${locker}锁定。',
        '檔案“${docname}”已被${locker}鎖定。',
        'File "${docname}" has been locked by ${locker}.'
    ], [
        '您选择的目标文件夹“${target}”是当前文件夹“${docname}”自身或其子文件夹。',
        '您選擇的目的資料夾“${target}”是當前資料夾“${docname}”自身或其子資料夾。',
        'Target folder "${target}" is current folder "${docname}" or its subfolder.'
    ], [
        '正在移动，请稍候...',
        '正在移動，請稍候...',
        'Moving now,please wait…'
    ], [
        '您对文件夹“${docname}”下某些子文件的密级权限不足。',
        '您對資料夾“${docname}”下某些子檔案的密級權限不足。',
        'Your security level is lower than that of some files in folder "${docname}".'
    ], [
        '您无法在同一个位置下移动文档。',
        '您無法在同一個位置下移動檔案。',
        'You cannot move file in the same location.	'
    ], [
        '您对文件夹“${docname}”没有复制与删除权限。',
        '您對資料夾“${docname}”沒有複製和刪除權限。',
        'You do not have Copy and Delete permissions for folder “${docname}”.'
    ], [
        '您对文件“${docname}”没有复制与删除权限。',
        '您對檔案“${docname}”沒有複製和刪除權限。',
        'You do not have Copy and Delete permissions for file “${docname}”.'
    ], [
        '您没有对发送文件箱目录的操作权限。',
        '您沒有對傳送檔案箱目錄的操作權限。',
        'You do not have such permission for File Outbox.'
    ], [
        '您对水印目录下的文件“${docname}”没有修改权限，无法将文件移动到水印目录范围外。',
        '您對水印目錄下的檔案“${docname}”沒有修改權限，無法將檔案移動到水印目錄範圍外。',
        'You do not have modify permission for file "${docname}" and cannot copy it to location outside watermark directories. '
    ]
]);