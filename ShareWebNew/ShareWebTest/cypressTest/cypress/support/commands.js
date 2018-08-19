// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const Selector = {
    // 当前用户触发区
    currentAccount: '._-ShareWebComponents-src-AccountDropMenu-styles-desktop---current',
    // 用户弹出框选项（修改密码|打开客户端|退出）
    accountDropMenuItem: '._-ShareWebComponents-src-AccountDropMenu-styles-desktop---account-item',
    // 弹出的dialog
    dialog: '._-ShareWebUI-src-Dialog2-styles-desktop---container',
    // dialog button
    dialogButton: '._-ShareWebUI-src-Panel-Footer-styles-desktop---container button',
    // 修改密码密码输入框
    passwordInput: '[type="password"]',
}

/**
 * 通过input按钮上传
 * @name upload_file
 * @function
 * @param {String} selector - 上传按钮
 * @param {String} fileUrl - 上传的文件路径，相对fixtures路径
 * @param {String} type - 上传文件的MIME类型，参考http://www.w3school.com.cn/media/media_mimeref.asp
 */
Cypress.Commands.add('upload_file', (selector, fileUrl, type = '') => {
    return cy.get(selector).then(subject => {
        return cy.fixture(fileUrl, 'base64')
            .then(Cypress.Blob.base64StringToBlob)
            .then(blob => {
                cy.server()
                cy.route('POST', '/v1/file?method=osendupload**')
                    .as('osendupload')

                const el = subject[0]
                const nameSegments = fileUrl.split('/')
                const name = nameSegments[nameSegments.length - 1]
                const testFile = new File([blob], name, {
                    type
                })
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(testFile)
                el.files = dataTransfer.files
                return cy.wait('@osendupload')
            })
    })
})

/**
 * 拖拽上传
 * @name upload_file
 * @function
 * @param {String} fileUrl - 上传的文件路径，相对fixtures路径
 * @param {String} type - 上传文件的MIME类型，参考http://www.w3school.com.cn/media/media_mimeref.asp
 */
Cypress.Commands.add('drap_upload_file', (fileUrl, type = '') => {
    // fixture无法直接以blob读取，通过encoding为base64，使用blob的base64StringToBlob方法转换为blob
    return cy.fixture(fileUrl, 'base64')
        .then(Cypress.Blob.base64StringToBlob)
        .then(blob => {
            const nameSegments = fileUrl.split('/')
            const name = nameSegments[nameSegments.length - 1]
            const testFile = new File([blob], name, {
                type
            })
            const event = {
                dataTransfer: {
                    files: [testFile]
                }
            }
            cy.server()
            cy.route('POST', '/v1/file?method=osendupload**')
                .as('osendupload')

            cy.get('._-ShareWebComponents-src-Docs-styles-desktop---docs-container').trigger('dragenter')
            cy.get('._-ShareWebComponents-src-Docs-styles-desktop---dragarea').trigger('drop', event)
            return cy.wait('@osendupload')
        })
})

/* 登录 */
Cypress.Commands.add("login", (username, password) => {

    cy.visit('/')
    cy.get('._-ShareWebComponents-src-Login-styles-desktop---input-user:nth-child(1) >input')
        .type(username)

    cy.get('._-ShareWebComponents-src-Login-styles-desktop---input-user:nth-child(2) >input')
        .type(password)

    cy.get('[type="submit"]')
        .click()
})

/* 登出 */
Cypress.Commands.add("logout", () => {
    cy.get('._-ShareWebComponents-src-AccountDropMenu-styles-desktop---current')
        .trigger('mouseover')
    cy.contains('._-ShareWebComponents-src-AccountDropMenu-styles-desktop---account-item', /退出|登出|logout/)
        .click()
})

/* 修改密码 */
Cypress.Commands.add('changePassword', (oldPassword, newPassword) => {
    cy.get(Selector.currentAccount)
        .trigger('mouseover')

    cy.contains(Selector.accountDropMenuItem, /修改密码|修改密碼|Change Password/)
        .click()

    cy.get(Selector.dialog)
        .find(Selector.passwordInput)
        .as('passwordInput')

    // 输入原密码
    cy.get('@passwordInput')
        .eq(0)
        .as('oldPassword')
        .type(oldPassword)

    // 输入新密码
    cy.get('@passwordInput')
        .eq(1)
        .as('newPassword')
        .type(newPassword)

    // 重复新密码
    cy.get('@passwordInput')
        .eq(2)
        .as('repeatNewPassword')
        .type(newPassword)

    // 点击确定
    cy.contains(Selector.dialogButton, /确定|確定|OK/)
        .click()

    // toast通知正确
    return cy.contains(Selector.toast, /修改成功|修改成功|Modified successfully/)

})

/* 删除所有文件 */

Cypress.Commands.add('deleteAll', () => {
    cy.get('._-ShareWebComponents-src-Docs-ToolBar-styles-desktop---wrapper input[type="checkbox"]')
        .check()
    cy.get('._-ShareWebComponents-src-Docs-ToolBar-styles-desktop---wrapper button')
        .contains(/删除|刪除|Delete/)
        .click()
    cy.get('._-ShareWebUI-src-Panel-Footer-styles-desktop---container button')
        .contains(/确定|確定|OK/)
        .click()
    return cy.get('._-ShareWebComponents-src-Docs-styles-desktop---empty-message')
})