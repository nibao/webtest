import { expect } from 'chai'
import * as sinon from 'sinon'
import * as cadpreview from './cadpreview'
import { Browser } from '../../util/browser/browser'

describe('ShareWebCore', () => {
    describe('cadpreview', () => {
        it('导出预览类型#PreviewType', () => {
            expect(cadpreview.PreviewType.Loading).to.equal(0)
            expect(cadpreview.PreviewType.SmallFilePreview).to.equal(1)
            expect(cadpreview.PreviewType.LargeFilePreview).to.equal(2)
            expect(cadpreview.PreviewType.TooLarge).to.equal(3)
        })

        describe('根据浏览器类型构建对应的html#getFlashHtml', () => {
            /* 代码中Firefox浏览器不使用mountFlashFirefox的原因是高版本Firfox不支持embed */
            it('浏览器为Safari MSIE Firefox Chrome时使用object方式嵌入flash', () => {
                [Browser.Safari, Browser.MSIE, Browser.Firefox, Browser.Chrome].forEach(browserType => {
                    expect(cadpreview.getFlashHtml(browserType, 'swfurl', 'falshVars').__html).to.includes('object')
                })
            })

            it('其他浏览器默认使用embed的方式嵌入flash', () => {
                [Browser.Edge, Browser.WeChat].forEach(browserType => {
                    expect(cadpreview.getFlashHtml(browserType, 'swfurl', 'falshVars').__html).to.includes('embed')
                })
            })

        })

        it('构造cad预览水印url#buildCADHref')
    })
})