import { expect } from 'chai'
import { stub } from 'sinon'
import { generateGNS } from '../../libs/test-helper';
import * as search from '../apis/efshttp/search/search';
import { Range, buildQuickParam, formatRange, buildRanges, quickSearch, SearchStatus } from './search'


describe('ShareWebCore', () => {
    describe('search', () => {

        it('导出搜索范围枚举#Range', () => {
            expect(Range.Current).to.equal(0)
            expect(Range.CurrentOnly).to.equal(1)
            expect(Range.All).to.equal(2)
        });

        it('构建快速检索参数#buildQuickParam', () => {
            expect(buildQuickParam('test', 10)).to.deep.equal({
                'start': 0,
                'rows': 10,
                'style': 0,
                'keys': 'test',
                'keysfields': ['basename', 'content'],
                'sort': '-modified'
            })

            expect(buildQuickParam('test a', 10)).to.deep.equal({
                'start': 0,
                'rows': 10,
                'style': 0,
                'keys': 'test%20a',
                'keysfields': ['basename', 'content'],
                'sort': '-modified'
            })
        });

        it('将docid数组转换为range#buildRanges', () => {
            const fakeGNS1 = generateGNS()
            const fakeGNS2 = generateGNS()
            const fakeGNS3 = generateGNS()
            expect(buildRanges(
                [
                    `gns://${fakeGNS1}`,
                    `gns://${fakeGNS2}`,
                    `gns://${fakeGNS3}`
                ],
                true))
                .to.deep.equal(
                    [
                        `gns?//${fakeGNS1}`,
                        `gns?//${fakeGNS2}`,
                        `gns?//${fakeGNS3}`
                    ]
                )

            expect(buildRanges(
                [
                    `gns://${fakeGNS1}`,
                    `gns://${fakeGNS2}`,
                    `gns://${fakeGNS3}`
                ],
                false))
                .to.deep.equal(
                    [
                        `gns?//${fakeGNS1}*`,
                        `gns?//${fakeGNS2}*`,
                        `gns?//${fakeGNS3}*`
                    ]
                )
        });

        it('将docid转为全文检索的range#formatRange', () => {
            const fakeGNS = generateGNS()
            expect(formatRange(`gns://${fakeGNS}`, false)).to.equal(`gns?//${fakeGNS}*`)
            expect(formatRange(`gns://${fakeGNS}`, true)).to.equal(`gns?//${fakeGNS}`)
        });

        it('导出搜索状态枚举#SearchStatus', () => {
            expect(SearchStatus.Pending).to.equal(0)
            expect(SearchStatus.Fetching).to.equal(1)
            expect(SearchStatus.SearchInError).to.equal(2)
            expect(SearchStatus.Ok).to.equal(3)
        });

    })
})