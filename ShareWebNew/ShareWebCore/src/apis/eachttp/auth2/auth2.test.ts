import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import * as auth2 from './auth2';

declare const { describe, it }

describe('ShareWebCore', () => {

    describe('apis', () => {
        describe('eachttp', () => {

            describe('身份认证（新）#auth2', () => {

                describe('登录#login', () => {

                    it('传入授权类型为明文密码', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth2.login({ grant_type: 'anyshare_plain', token_type: 'short-lived', params: { key: 'test' }, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth2')
                            expect(url.query).to.deep.equal({ method: 'login' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ grant_type: 'anyshare_plain', token_type: 'short-lived', params: { key: 'test' } })

                            restore();
                            done();
                        })
                    })

                    it('默认登录类型', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth2.login();

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth2')
                            expect(url.query).to.deep.equal({ method: 'login' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ grant_type: 'anyshare_plain', token_type: 'short-lived', params: {} })

                            restore();
                            done();
                        })
                    })

                });


                describe('获取新的token#refresh', () => {

                    it('传入正确的必传参数，单个可选参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth2.refresh({ refresh_token: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth2')
                            expect(url.query).to.deep.equal({ method: 'refresh' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ refresh_token: 'test' })

                            restore();
                            done();
                        })
                    })

                });


            });
        })
    })
})