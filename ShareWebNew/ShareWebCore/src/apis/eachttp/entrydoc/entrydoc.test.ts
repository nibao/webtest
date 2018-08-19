import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as entrydoc from './entrydoc';

declare const { describe, it, before, after }

describe('ShareWebCore', () => {

    describe('apis', () => {
        describe('eachttp', () => {

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

            describe('入口文档管理#entrydoc', () => {


                describe('获取入口文档（过滤后）#get', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            entrydoc.get({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/entrydoc')
                            expect(url.query).to.deep.equal({ method: 'get', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).equals(null)
                            restore();
                            done();
                        });
                    });

                });


                describe('获取入口文档（根据文档类型）#getByType', () => {

                    it('#传入不合法文档类型，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            entrydoc.getByType({ doctype: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/entrydoc')
                            expect(url.query).to.deep.equal({ method: 'getbytype', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ doctype: 'test' })

                            restore();
                            done();
                        });
                    });

                });


                describe('获取顶层文档入口视图#getViews', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            entrydoc.getViews({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/entrydoc')
                            expect(url.query).to.deep.equal({ method: 'getviews', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).equals(null)

                            restore();
                            done();
                        });
                    });

                });


                describe('获取文档类型#getDocType', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            entrydoc.getDocType({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/entrydoc')
                            expect(url.query).to.deep.equal({ method: 'getdoctype', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        });
                    });

                });


                describe('退出入口文档#quit', () => {

                    it('传入正确的必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            entrydoc.quit({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/entrydoc')
                            expect(url.query).to.deep.equal({ method: 'quit', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        });
                    });

                });


                describe('加入入口文档#join', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            entrydoc.join({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/entrydoc')
                            expect(url.query).to.deep.equal({ method: 'join', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        });
                    });

                });


                describe('获取已退出的入口文档#getQuitInfos', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            entrydoc.getQuitInfos({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/entrydoc')
                            expect(url.query).to.deep.equal({ method: 'getquitinfos', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({})

                            restore();
                            done();
                        });
                    });

                });

                describe('获取入口文档信息（根据文档ID）#getByDocId', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            entrydoc.getByDocId({ docid: 'docid', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/entrydoc')
                            expect(url.query).to.deep.equal({ method: 'getbydocid', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'docid' })

                            restore();
                            done();
                        });
                    });

                });


            });
        })
    })
})