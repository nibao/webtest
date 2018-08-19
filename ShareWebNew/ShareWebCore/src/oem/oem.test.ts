import { expect } from 'chai'
import * as sinon from 'sinon'
import * as browser from '../../util/browser/browser';
import * as config from '../apis/eachttp/config/config';
import { getOEMConfByOptions, setOEMtitle } from './oem'
import { sandboxStub } from '../../libs/test-helper';

describe('ShareWebCore', () => {
    describe('oem', () => {
        const sandbox = sinon.createSandbox()
        beforeEach('stub', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: browser,
                    moduleProp: ['getSupportedLanguage', 'envLanguage', 'setTitle']
                },
                {
                    moduleObj: config,
                    moduleProp: ['getOemConfigBySection']
                }
            ])
        });

        afterEach('restore', () => {
            sandbox.restore()
        });

        it('获取指定OEM配置#getOEMConfByOptions', () => {
            browser.envLanguage.returns('zh-cn')
            browser.getSupportedLanguage.returns('zh-cn')
            config.getOemConfigBySection.withArgs({ section: 'anyshare' }).resolves({ AnyShareOEM1: 'true', AnyShareOEM2: 'false', AnyShareOEM3: 1 })
            config.getOemConfigBySection.withArgs({ section: 'shareweb_zh-cn' }).resolves({ LanguageSpecifiedOEM1: 'true', LanguageSpecifiedOEM2: 'false', LanguageSpecifiedOEM3: 1 })
            return getOEMConfByOptions(['AnyShareOEM1', 'AnyShareOEM2', 'AnyShareOEM3', 'LanguageSpecifiedOEM1']).then(config => {
                expect(config).to.deep.equal({ AnyShareOEM1: true, AnyShareOEM2: false, AnyShareOEM3: 1, LanguageSpecifiedOEM1: true })
            })
        });

        it('设置网页标签title#setOEMtitle', () => {
            browser.envLanguage.returns('zh-cn')
            browser.getSupportedLanguage.returns('zh-cn')
            config.getOemConfigBySection.withArgs({ section: 'anyshare' }, { useCache: true }).resolves({ product: 'product' })
            return setOEMtitle().then(() => {
                expect(browser.setTitle.calledWith('product'))
            })
        });

    })
})