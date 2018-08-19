import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as pki from './pki';

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

            describe('PKI认证#pki', () => {


                describe('获取original#original', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            pki.original({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/pki')
                            expect(url.query).to.deep.equal({ method: 'original' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({})

                            restore();
                            done();
                        })
                    })

                });

                describe('使用PKI认证#authen', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            pki.authen({ original: 'test', detach: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/pki')
                            expect(url.query).to.deep.equal({ method: 'authen' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ original: 'test', detach: 'test' })

                            restore();
                            done();
                        })
                    })

                });


            });
        })
    })
})