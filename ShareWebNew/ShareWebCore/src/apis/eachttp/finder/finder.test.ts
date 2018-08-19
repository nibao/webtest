import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as finder from './finder';

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

            describe('发现管理#finder', () => {


                describe('获取文档发现状态#getStatus', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            finder.getStatus({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/finder')
                            expect(url.query).to.deep.equal({ method: 'getstatus', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        })
                    })

                });


                describe('开启文档发现状态#enable', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            finder.enable({ docid: '123', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/finder')
                            expect(url.query).to.deep.equal({ method: 'enable', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: '123' })

                            restore();
                            done();
                        })
                    })

                });


                describe('关闭文档发现状态#disable', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            finder.disable({ docid: '123', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/finder')
                            expect(url.query).to.deep.equal({ method: 'disable', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: '123', })

                            restore();
                            done();
                        })
                    })
                });


                describe('获取用户开启发现的文档#getEnabled', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            finder.getEnabled({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/finder')
                            expect(url.query).to.deep.equal({ method: 'getenabled', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({})

                            restore();
                            done();
                        })
                    })

                });


            });
        })
    })
})