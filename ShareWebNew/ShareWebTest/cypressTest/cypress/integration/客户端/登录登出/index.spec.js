/// <reference types="Cypress" />
const Selector = {
    usernameInput: '._-ShareWebComponents-src-Login-styles-desktop---input-user:nth-child(1) >input',
    passwordInput: '._-ShareWebComponents-src-Login-styles-desktop---input-user:nth-child(2) >input',
    loginButton: '[type="submit"]',
    inputError: '._-ShareWebComponents-src-Login-styles-desktop---input-error',
    usernameText: '._-ShareWebComponents-src-AccountDropMenu-styles-desktop---username',
    currentAccount: '._-ShareWebComponents-src-AccountDropMenu-styles-desktop---current',
}
describe('登录登出', function () {
    before('进入登录页', function () {
        cy.visit('/')
    })

    beforeEach('获取用到的元素', function () {
        cy.get(Selector.usernameInput).as('username')
        cy.get(Selector.passwordInput).as('password')
        cy.get(Selector.loginButton).as('submit')
    })

    it('未输入账号密码点击登录', function () {
        cy.get('@submit')
            .click()
        cy.get(Selector.inputError)
            .contains('你还没有输入账号')
    })

    it('未输入密码点击登录', function () {
        cy.get('@username')
            .type('test')
        cy.get('@submit')
            .click()
        cy.get(Selector.inputError)
            .contains('你还没有输入密码')
        /* 清除输入 */
        cy.get('@username')
            .clear()
    })

    it('未输入账号点击登录', function () {
        cy.get('@password')
            .type('test')
        cy.get('@submit')
            .click()
        cy.get(Selector.inputError)
            .contains('你还没有输入账号')
        /* 清除输入 */
        cy.get('@password')
            .clear()

    })

    it('正常登录登出', function () {
        cy.get('@username')
            .type('test')
            .should('have.value', 'test')

        cy.get('@password')
            .type('eisoo.com')
            .should('have.value', 'eisoo.com')

        cy.get('@submit')
            .click()
        cy.get(Selector.usernameText)
            .contains('test')

        /* 退出登录 */
        cy.get(Selector.currentAccount)
            .trigger('mouseover')
        cy.contains(/退出|登出|logout/).click()
    })

})