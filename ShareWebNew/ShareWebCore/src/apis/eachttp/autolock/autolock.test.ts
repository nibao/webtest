import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as autolock from './autolock';

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

            after('清除userid和tokenid', () => {
                setupOpenAPI({
                    userid: undefined,
                    tokenid: undefined,
                })
            });

            describe('文件锁管理（自动锁）#autolock', () => {


                describe('锁定文件#lock', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {

                        useFakeXHR((requests, restore) => {
                            autolock.lock({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/autolock')
                            expect(url.query).to.deep.equal({ method: 'lock', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        })
                    })

                });

                
                describe('尝试锁定文件#trylock', () => {

                    it('传入全部必选参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            autolock.trylock({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/autolock')
                            expect(url.query).to.deep.equal({ method: 'trylock', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })
                            
                            restore();
                            done();
                        })
                    })

                });


                describe('刷新文件锁#refresh', () => {

                    it('传入正确的必传参数（lockinfos传入空数组）、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            autolock.refresh({ lockinfos: [], _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/autolock')
                            expect(url.query).to.deep.equal({ method: 'refresh', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ lockinfos: [] })
                            
                            restore();
                            done();
                        })
                    })

                });


                describe('解锁文件#unlock', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            autolock.unlock({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/autolock')
                            expect(url.query).to.deep.equal({ method: 'unlock', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        })
                    })

                });

                
                describe('获取文件锁信息#getLockInfo', () => {

                    it('传入正确的必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            autolock.getLockInfo({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/autolock')
                            expect(url.query).to.deep.equal({ method: 'getlockinfo', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        })
                    })

                });


                describe('获取文件夹锁信息#getDirLockInfo', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            autolock.getDirLockInfo({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/autolock')
                            expect(url.query).to.deep.equal({ method: 'getdirlockinfo', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })
                            
                            restore();
                            done();
                        })
                    })

                });


            });
        })
    })
})