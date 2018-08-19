/// <reference types="Cypress" />
const Selector = {
    // 文件上传按钮
    fileUploadInput: '._-ShareWebComponents-src-Docs-ToolBar-styles-desktop---upload-menu input:nth-of-type(1)',
    // 文档列表文件名
    docname: '._-ShareWebComponents-src-Docs-List-styles-desktop---name'
}
describe('上传', function () {
    before('登录', function () {
        cy.login('test', 'eisoo.com')

        /* 进入个人文档 */
        cy.get(Selector.docname) // 个人文档文档名在列表上和普通文档一样
            .contains('test')
            .click()
    })

    after('登出', function () {
        cy.deleteAll()
        cy.logout()
    })

    it('文件上传-点击上传', function () {
        cy.upload_file(Selector.fileUploadInput, 'source/30M.doc').then(() => {
            // 不要下面这样使用，将在get的基础上再查询contains，无法获取到最新的列表
            // cy.get('._-ShareWebComponents-src-Docs-List-styles-desktop---name').contains('30M.doc') 
            cy.contains(Selector.docname, '30M.doc')
        })
    })

    it('文件上传-拖拽上传', function () {
        cy.drap_upload_file('source/5.6M.docx').then(() => {
            cy.contains(Selector.docname, '5.6M.docx')
        })

    })

    it('文件夹上传-技术原因，暂时没找到办法测试')
})