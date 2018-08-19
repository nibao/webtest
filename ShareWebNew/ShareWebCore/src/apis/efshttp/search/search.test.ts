import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as search from './search';

declare const { describe, it, before, after }

describe('ShareWebCore', () => {

    describe('apis', () => {
        describe('efshttp', () => {

            before('初始化userid和tokenid', () => {
                setupOpenAPI({
                    userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                    tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298',
                });
            });

            after('清除userid和tokenid', () => {
                setupOpenAPI({
                    userid: undefined,
                    tokenid: undefined,
                });
            });

            describe('全文检索协议#search', () => {


                describe('搜索协议#search', () => {

                    it('正确传入全部必传参数，正确传入部分可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            search.search({
                                start: 0,
                                rows: 20,
                                hlpre: '<em>',
                                hlpost: '<\/em>',
                                style: 0,
                                range: ["gns?\/\/21A9B9FD1B524CB49D54BF7399F82EB4\/*"],
                                begin: 1377849379097713,
                                end: 1464157910729192,
                                keys: 'key1%20key2',
                                keysfields: ['key1', 'key2'],
                                ext: ['.wps', '.doc'],
                                sort: 'size',
                                tags: ['小明', '小花'],
                                customattr: [{ "attr": 1, "condition": "<", "level": 2, "value": 123 }],
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/search')
                            expect(url.query).deep.equal({
                                method: 'search',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                start: 0,
                                rows: 20,
                                hlpre: '<em>',
                                hlpost: '<\/em>',
                                style: 0,
                                range: ["gns?\/\/21A9B9FD1B524CB49D54BF7399F82EB4\/*"],
                                begin: 1377849379097713,
                                end: 1464157910729192,
                                keys: 'key1%20key2',
                                keysfields: ['key1', 'key2'],
                                ext: ['.wps', '.doc'],
                                sort: 'size',
                                tags: ['小明', '小花'],
                                customattr: [{ "attr": 1, "condition": "<", "level": 2, "value": 123 }]
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('标签补全协议#tagSuggest', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            search.tagSuggest({
                                prefix: '小',
                                count: 5,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/search')
                            expect(url.query).deep.equal({
                                method: 'tagsuggest',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                prefix: '小',
                                count: 5,
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取自定义属性协议#customAttribute', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            search.customAttribute({
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/search')
                            expect(url.query).deep.equal({
                                method: 'customattribute',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                            })

                            restore();
                            done();
                        })
                    });

                });


            });
        })
    })
})