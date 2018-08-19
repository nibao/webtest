/// <reference types="Cypress" />

const Selector = {
    // 个人文档项
    userDocName: '._-ShareWebComponents-src-Docs-List-styles-desktop---name',
    // 文件上传按钮
    fileUploadInput: '._-ShareWebComponents-src-Docs-ToolBar-styles-desktop---upload-menu input:nth-of-type(1)',
    // 单行文档
    docItem: '._-ShareWebComponents-src-Docs-List-styles-desktop---item',
    // 悬浮时显示的收藏图标
    starIcon: '._-ShareWebUI-src-IconGroup-styles-desktop---container ._-ShareWebUI-src-Title-styles-desktop---container:nth-child(1) span',
    // 右键菜单列表项
    contextMenuItem: '._-ShareWebUI-src-PopMenu-Item-styles-desktop---item',
    // toast 通知
    toast: '._-ShareWebUI-src-Toast-styles-desktop---toast',
    // 侧边栏项
    sidebarItem: '._-ShareWebComponents-src-SideNav-styles-desktop---nav-item',
    favoriteItemName: '._-ShareWebComponents-src-MyFavorites-FavoritesList-styles-desktop---name',

}
describe('我的收藏', function () {
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

    it('文档列表悬浮图标-收藏与取消收藏', () => {

        // 选中文档列表第一项，本次测试只有一项，无需.eq()
        cy.get(Selector.docItem)
            .click('topRight')

        // 点击出现的收藏图标进行收藏
        cy.get(Selector.docItem)
            .find(Selector.starIcon)
            .as('starIcon')
            .trigger('click')

        // 图标rgb(246, 207, 87)高亮
        cy.get('@starIcon')
            .should('have.css','color','rgb(246, 207, 87)')

        // toast提示内容正确
        cy.contains(Selector.toast, /收藏成功|收藏成功|Favorites successfully/)


        // 点击进入我的收藏
        cy.contains(Selector.sidebarItem, /我的收藏|我的收藏|My Favorites/)
            .click()

        cy.contains(Selector.favoriteItemName, '874kb.jpg')

        // 返回全部文档
        cy.contains(Selector.sidebarItem, /全部文档|全部文件|Documents/)
            .click()

        // 点击出现的收藏图标取消收藏
        cy.get(Selector.docItem).find(Selector.starIcon)
            .trigger('click')

        // toast提示内容正确
        cy.contains(Selector.toast, /取消收藏|取消收藏|Unfavorite/)

        // 点击进入我的收藏
        cy.contains(Selector.sidebarItem, /我的收藏|我的收藏|My Favorites/)
            .click()

        // 收藏列表中不存在被取消收藏的文件
        cy.contains(Selector.favoriteItemName, '874kb.jpg').should('not.exist')

        // 返回全部文档
        cy.contains(Selector.sidebarItem, /全部文档|全部文件|Documents/)
            .click()

    })

    it('文档列表中右键-收藏与取消收藏', () => {

        // 选中文档列表第一项，本次测试只有一项，无需.eq()
        cy.get(Selector.docItem).click('topRight')

        // 在文档列表第一项上右键
        cy.get(Selector.docItem).trigger('contextmenu')

        // 点击右键菜单第一项-收藏
        cy.get(Selector.contextMenuItem).eq(0).click()

        // toast提示内容正确
        cy.contains(Selector.toast, /收藏成功|收藏成功|Favorites successfully/)

        // 点击进入我的收藏
        cy.contains(Selector.sidebarItem, /我的收藏|我的收藏|My Favorites/)
            .click()

        cy.contains(Selector.favoriteItemName, '874kb.jpg')

        // 返回全部文档
        cy.contains(Selector.sidebarItem, /全部文档|全部文件|Documents/)
            .click()

        // 选中文档列表第一项，本次测试只有一项，无需.eq()
        cy.get(Selector.docItem).click('topRight')

        // 在文档列表上右键
        cy.get(Selector.docItem).trigger('contextmenu')

        // 点击右键菜单第一项-取消收藏
        cy.get(Selector.contextMenuItem).eq(0).click()

        // toast提示内容正确
        cy.contains(Selector.toast, /取消收藏|取消收藏|Unfavorite/)

        // 点击进入我的收藏
        cy.contains(Selector.sidebarItem, /我的收藏|我的收藏|My Favorites/)
            .click()

        // 收藏列表中不存在被取消收藏的文件
        cy.contains(Selector.favoriteItemName, '874kb.jpg').should('not.exist')

        // 返回全部文档
        cy.contains(Selector.sidebarItem, /全部文档|全部文件|Documents/)
            .click()

    })


})