import i18n from '../i18n'

export default i18n([
    [
        '流程名称：',
        '流程名稱：',
        'Workflow name:'
    ],
    [
        '不能包含 / : * ? " < > | 特殊字符，请重新输入',
        '不能包含 / : * ? " < > | 特殊字元，請重新輸入',
        'Workflow name cannot contain / : * ? " < > | special character, please enter again'
    ],
    [
        '文档最终保存位置：',
        '文件最終儲存位置：',
        'File target save location:'
    ],
    [
        '浏览',
        '瀏覽',
        'Browse'
    ],
    [
        '第一步：定义流程',
        '第一步：定義流程',
        'Step 1: Define workflow'
    ],
    [
        '第二步：选择审核模式',
        '第二步：選擇核准模式',
        'Step 2: Selecte approval type'
    ],
    [
        '第三步：选择适用范围',
        '第三步：選擇適用範圍',
        'Step 3: Select range'
    ],
    [
        '同级审核',
        '同級核准',
        'Parallel approval'
    ],
    [
        '汇签审核',
        '會簽核准',
        'Unanimous approval'
    ],
    [
        '逐级审核',
        '逐級核准',
        'Serial approval'
    ],
    [
        '同级审核：任意一位审核员审核通过或否决，流程结束；汇签审核：多位审核员全部审核通过，流程结束，其中任意一方否决，流程结束；逐级审核：一级审批员审核通过后，二级审核员继续审核，直至所有审核员审核通过，其中任一层级否决，流程结束',
        '同級核准：任意一位核准者核准通過或否決，流程結束；會簽核准：多位核准者全部核准通過，流程結束，其中任意一方否決，流程結束；逐級核准：一級核准者核准通過後 二級核准者繼續核准，直至所有核准者核准通過，其中任一層級否決，流程結束',
        'Parallel approval: approve or reject based on the First Response.Unanimous approval: require unanimous approval from all selected approvers.Serial approval: Level 1 approver must complete the approval before the next level approver starts. Any reject response will end the approval workflow'
    ],
    [
        '查找审核员',
        '搜尋核准者',
        'Search approver'
    ],
    [
        '清空',
        '清空',
        'Empty'
    ],
    [
        '该流程名称已存在，请重新输入',
        '該流程名稱已存在，請重新輸入',
        'This workflow name already exists, please enter again'
    ],
    [
        '创建 文档流程“${flowName}” 成功',
        '建立 文件流程“${flowName}” 成功',
        'Creat workflow “${flowName}” succeed',
    ],
    [
        '编辑 文档流程“${flowName}” 成功',
        '編輯 文件流程“${flowName}” 成功',
        'Edit workflow “${flowName}” succeeded'
    ],
    [
        '最终保存位置：',
        '最終儲存位置：',
        'Target save location:'
    ],
    [
        '审核模式：',
        '核准模式：',
        'Approval type: '
    ],
    [
        '审核员：',
        '核准者：',
        'Approver:'
    ],
    [
        '，',
        '，',
        ','
    ],
    [
        '级',
        '級',
        'Level'
    ],
    [
        '此输入项不允许为空',
        '此輸入項不允許為空',
        'This entry cannot be empty'
    ],
    [
        '审核员不允许为空',
        '核准者不允許為空',
        'The approver cannot be empty'
    ],
    [
        '适用范围不允许为空',
        '適用範圍不允許為空',
        'The range cannot be empty'
    ],
    [
        '创建流程',
        '建立流程',
        'Create Workflow'
    ],
    [
        '编辑流程',
        '編輯流程',
        'Edit Workflow'
    ],
    [
        '未找到匹配的结果',
        '未找到匹配的結果',
        'No result matches your search'
    ],
    [
        '模式下至少需要两位审核员',
        '模式下至少需要兩位核准者',
        'requires at least two approvers'
    ],
    [
        '创建流程失败,错误原因如下：',
        '建立流程失敗。錯誤資訊如下：',
        'Creat workflow failed. The error message is as follows: '
    ],
    [
        '编辑流程失败,错误原因如下：',
        '編輯流程失敗。錯誤資訊如下：',
        'Edit workflow failed. The error message is as follows:'
    ],
    [
        ' 的适用范围：',
        ' 的適用範圍：',
        ' \'s range:'
    ],
    [
        '最终保存位置：${destDocName}，审核模式：${auditModel}，审核员：${auditorNames}，适用范围：${accessorName}',
        '最終儲存位置：${destDocName}，核准模式：${auditModel}，核准者：${auditorNames}，適用範圍：${accessorName}',
        'Target save location: ${destDocName}，Approval type: ${auditModel}, Approver: ${auditorNames},Available range:${accessorName}'
    ],
    [
        ' 的审核员：',
        ' 的核准者：',
        ' \'s approver:'
    ],
    [
        '${number}级',
        '${number}級',
        'Level ${number}'
    ]
])