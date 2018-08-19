import { expect } from 'chai'
import { stub } from 'sinon'
import * as browser from '../../util/browser/browser';
import * as oem from '../oem/oem'
import { apply } from './skin'

describe('ShareWebCore', () => {
    describe('skin', () => {
        describe('根据OEM配置设定对应皮肤样式#apply', () => {
            beforeEach('stub', () => {
                stub(oem, 'getOEMConfByOptions')
                stub(browser, 'insertStyle')
            })

            afterEach('restore', () => {
                oem.getOEMConfByOptions.restore()
                browser.insertStyle.restore()
            })

            it('默认使用#d70000作为主题色', async () => {
                oem.getOEMConfByOptions.rejects()
                await apply()
                const styles = browser.insertStyle.args[0][0]
                for (const rule in styles) {
                    expect(styles[rule][Object.keys(styles[rule])[0]]).to.equal('#d70000!important')
                }
            })

            it('OEM返回值不带#', async () => {
                oem.getOEMConfByOptions.resolves({ theme: 'ffffff' })
                await apply()
                const styles = browser.insertStyle.args[0][0]
                for (const rule in styles) {
                    expect(styles[rule][Object.keys(styles[rule])[0]]).to.equal('#ffffff!important')
                }
            })

            it('OEM返回值带#', async () => {
                oem.getOEMConfByOptions.resolves({ theme: '#CCCCCC' })
                await apply()
                const styles = browser.insertStyle.args[0][0]
                for (const rule in styles) {
                    expect(styles[rule][Object.keys(styles[rule])[0]]).to.equal('#CCCCCC!important')
                }
            })

            it('OEM返回值为空，使用默认颜色', async() => {
                oem.getOEMConfByOptions.resolves({ theme: '' })
                await apply()
                const styles = browser.insertStyle.args[0][0]
                for (const rule in styles) {
                    expect(styles[rule][Object.keys(styles[rule])[0]]).to.equal('#d70000!important')
                }
            })
            
        })
    })
})