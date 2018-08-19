/// <reference types="Cypress" />
const Selector = {
    // 个人文档项
    userDocName: '._-ShareWebComponents-src-Docs-List-styles-desktop---name',
    // 文件上传按钮
    fileUploadInput: '._-ShareWebComponents-src-Docs-ToolBar-styles-desktop---upload-menu input:nth-of-type(1)',
    // 单行文档
    docItem: '._-ShareWebComponents-src-Docs-List-styles-desktop---item',
    // 悬浮时显示的外链图标
    linkShareIcon: '._-ShareWebUI-src-IconGroup-styles-desktop---container ._-ShareWebUI-src-Title-styles-desktop---container:nth-child(4) span',
    // 点击图标后显示的弹窗中的开启关闭外链按钮
    openOrCloseLinkShareButton: '._-ShareWebComponents-src-LinkShare-Configuration-styles-desktop---linkInfo button',
    // Dialog
    dialog: '._-ShareWebUI-src-Dialog2-styles-desktop---container',
    // Dialog 关闭按钮
    dialogCloseButton: '._-ShareWebUI-src-Dialog2-styles-desktop---header ._-ShareWebUI-src-Dialog2-styles-desktop---button',
    // 右键菜单列表项
    contextMenuItem: '._-ShareWebUI-src-PopMenu-Item-styles-desktop---item',
    // 外链配置容器
    linkShareConfiguration: '._-ShareWebComponents-src-LinkShare-Configuration-styles-desktop---block',
}
describe('外链', function () {
    before('登录并上传文件', function () {
        cy.login('test', 'eisoo.com')

        /* 进入个人文档 */
        cy.get(Selector.userDocName)
            .contains('test')
            .click()

        /* 上传文件 */

        cy.upload_file(Selector.fileUploadInput, 'source/874kb.jpg')
    })

    after('登出', function () {
        cy.deleteAll()
        cy.logout()
    })

    it('点击图标-开启外链-关闭外链', () => {

        // 选中文档列表第一项，本次测试只有一项，无需.eq()
        cy.get(Selector.docItem).click('topRight')

        // 点击出现的外链共享图标
        cy.get(Selector.docItem).find(Selector.linkShareIcon)
            .trigger('click')

        // 等待出现外链dialog，本步骤可忽略
        cy.get(Selector.dialog)

        // 点击开启外链按钮
        cy.get(Selector.openOrCloseLinkShareButton)
            .click()

        cy.get(Selector.linkShareConfiguration)

        // 点击关闭外链按钮
        cy.get(Selector.openOrCloseLinkShareButton)
            .click()

        // 点击关闭dialog
        cy.get(Selector.dialogCloseButton)
            .click()

    })

    it('右键-开启外链-关闭外链', () => {
        // 在文档列表第一项上右键
        cy.get(Selector.docItem).trigger('contextmenu')

        // 点击右键菜单第二项
        cy.get(Selector.contextMenuItem).eq(2).click()

        // 等待出现外链dialog，本步骤可忽略
        cy.get(Selector.dialog)

        // 点击开启外链按钮
        cy.get(Selector.openOrCloseLinkShareButton)
            .click()

        cy.get(Selector.linkShareConfiguration)

        // 点击关闭外链按钮
        cy.get(Selector.openOrCloseLinkShareButton)
            .click()

        // 点击关闭dialog
        cy.get(Selector.dialogCloseButton)
            .click()
    })
})