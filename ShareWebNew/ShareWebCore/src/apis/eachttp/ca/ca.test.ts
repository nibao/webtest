import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as ca from './ca';

declare const { describe, it, before, after }

describe('ShareWebCore', () => {

    describe('apis', () => {
        describe('eachttp', () => {

            before('初始化userid和tokenid', () => {
                setupOpenAPI({
                    userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                    tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298',
                })
            });

            after('清除初始化userid和tokenid', () => {
                setupOpenAPI({
                    userid: undefined,
                    tokenid: undefined,
                })
            });

            describe('CA认证#ca', () => {

                
                describe('获取CA信息#get', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            ca.get({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/ca')
                            expect(url.query).to.deep.equal({ method: 'get' })
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