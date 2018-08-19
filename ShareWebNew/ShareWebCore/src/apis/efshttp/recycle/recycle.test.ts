import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as recycle from './recycle';

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

            describe('recycle', () => {


                describe('浏览回收站资源协议#list', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            recycle.list({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                by: 'name',
                                sort: 'asc',
                                name: ['abc', 'de'],
                                path: ['个人文档'],
                                editor: ['张三'],
                                start: 0,
                                limit: -1,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/recycle')
                            expect(url.query).deep.equal({
                                method: 'list',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                by: 'name',
                                sort: 'asc',
                                name: ['abc', 'de'],
                                path: ['个人文档'],
                                editor: ['张三'],
                                start: 0,
                                limit: -1
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('删除回收站资源协议#del', () => {

                    it('正确传入全部必传参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            recycle.del({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/recycle')
                            expect(url.query).deep.equal({
                                method: 'delete',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('还原回收站资源协议#restore', () => {

                    it('正确传入全部必传参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            recycle.restore({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                ondup: 1,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/recycle')
                            expect(url.query).deep.equal({
                                method: 'restore',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                ondup: 1
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取回收站还原后的建议名称协议#getSuggestName', () => {

                    it('正确传入全部必传参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            recycle.getSuggestName({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/recycle')
                            expect(url.query).deep.equal({
                                method: 'getsuggestname',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772'
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