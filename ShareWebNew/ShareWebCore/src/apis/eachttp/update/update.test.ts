import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as update from './update';

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

            describe('客户端检查更新#update', () => {


                describe('检查客户端是否需要更新#check', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            update.check({ platform: 'windows', arch: 'x64', version: '3.5.3.244', softwaretype: 'AnyShare', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/update')
                            expect(url.query).to.deep.equal({ method: 'check', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ platform: 'windows', arch: 'x64', version: '3.5.3.244', softwaretype: 'AnyShare' })

                            restore();
                            done();
                        })
                    })

                });


                describe('下载客户端升级包#download', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            update.download({ osType: '1', reqhost: 'eisoo', usehttps: false, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/update')
                            expect(url.query).to.deep.equal({ method: 'download' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ osType: '1', reqhost: 'eisoo', usehttps: false })

                            restore();
                            done();
                        })
                    })

                });


            });
        })
    })
})