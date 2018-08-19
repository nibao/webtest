import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as favorites from './favorites';

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

            describe('文档收藏协议#favorites', () => {


                describe('添加收藏#add', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            favorites.add({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/favorites')
                            expect(url.query).deep.equal({
                                method: 'add',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取收藏列表#list', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            favorites.list({
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/favorites')
                            expect(url.query).deep.equal({
                                method: 'list',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({

                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('删除收藏#del', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            favorites.del({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/favorites')
                            expect(url.query).deep.equal({
                                method: 'delete',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('批量查询收藏状态#check', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            favorites.check({
                                docids: ['gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF'],
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/favorites')
                            expect(url.query).deep.equal({
                                method: 'check',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docids: ['gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF'],
                            });

                            restore();
                            done();
                        })
                    });

                });


            });
        })
    })
})