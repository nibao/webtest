/// <reference types="Cypress" />
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
    // toast 通知
    toast: '._-ShareWebUI-src-Toast-styles-desktop---toast',

}

describe('修改密码', function () {
    before('登录', function () {
        cy.login('test', 'eisoo.com')
    })

    after('登出', function () {
        // 恢复原密码,这里建议使用其他方式,例如请求或者重置数据库等方式而不是使用界面的方式来恢复环境,更快且更可靠
        cy.changePassword('eisoo.com123', 'eisoo.com')
        cy.logout()
    })

    it('成功修改密码', function () {
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
            .type('eisoo.com')

        // 输入新密码
        cy.get('@passwordInput')
            .eq(1)
            .as('newPassword')
            .type('eisoo.com123')

        // 重复新密码
        cy.get('@passwordInput')
            .eq(2)
            .as('repeatNewPassword')
            .type('eisoo.com123')

        // 点击确定
        cy.contains(Selector.dialogButton, /确定|確定|OK/)
            .click()

        // toast通知正确
        cy.contains(Selector.toast, /修改成功|修改成功|Modified successfully/)

        // 退出登录
        cy.logout()

        // 使用新密码重新登录
        cy.login('test', 'eisoo.com123')

    })

})