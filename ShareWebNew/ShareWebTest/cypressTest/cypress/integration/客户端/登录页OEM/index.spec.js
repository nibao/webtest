/// <reference types="Cypress" />

const Selector = {
    organization: '._-ShareWebComponents-src-Index-styles-desktop---oem-organization',
    aboutMessage: '._-ShareWebComponents-src-About-styles-desktop---message',
    deviceInfo: '._-ShareWebComponents-src-About-styles-desktop---item-space',
}
describe('登录页OEM相关', function () {
    before('stub getoemconfigbysection 请求，访问登录首页，', function () {

        cy.server()
        cy.route({
            method: 'POST',
            url: '**/v1/config?method=getoemconfigbysection',
            response: 'fx:Login/oem_anyshare.json'
        })
        cy.route({
            method: 'POST',
            url: '**/v1/config?method=getoemconfigbysection',
            response: 'fx:Login/oem_lang.json'
        })
        cy.route({
            method: 'POST',
            url: '**/v1/auth1?method=getconfig',
            response: 'fx:Login/getconfig.json'
        })

        cy.visit('/')
    })

    beforeEach('fixture', () => {
        cy.fixture('Login/oem_lang.json').as('oemconfig_lang')
        cy.fixture('Login/oem_anyshare.json').as('oemconfig_anyshare')
        cy.fixture('Login/getconfig.json').as('config')
    })

    it('产品标语', function () {
        cy.get(Selector.organization)
            .contains(this.oemconfig_lang.slogan)
    })

    it('产品信息', function () {

        const server_version = this.config.server_version.split('-')
        cy.get(Selector.aboutMessage)
            .first()
            .children()
            .first()
            .find('span')
            .as('productInfo')

        cy.get('@productInfo')
            .eq(0)
            .contains(this.oemconfig_lang.product)

        cy.get('@productInfo')
            .eq(2)
            .contains(server_version[0])

        cy.get('@productInfo')
            .eq(4)
            .contains(server_version[2])

        cy.get('@productInfo')
            .eq(6)
            .contains(server_version[1])
    })

    it('型号信息', function () {

        cy.get(Selector.aboutMessage)
            .first()
            .find(Selector.deviceInfo)
            .contains(this.config.device_info.hardware_type)

    })

    it('授权信息', function () {
        cy.get(Selector.aboutMessage)
            .eq(1)
            .children()
            .eq(0)
            .find('span')
            .as('authInfo')
        cy.get('@authInfo')
            .eq(2)
            .contains(this.config.device_info.auth_days)
    })

    it('版权信息', function () {
        cy.get(Selector.aboutMessage)
            .last()
            .contains(this.oemconfig_lang.copyright)
    })

})