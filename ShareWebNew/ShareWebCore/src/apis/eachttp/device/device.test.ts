import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as device from './device';

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


            describe('登录设备管理#device', () => {


                describe('获取所有设备信息#list', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            device.list({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/device')
                            expect(url.query).to.deep.equal({ method: 'list', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({})

                            restore();
                            done();
                        })
                    })

                });


                describe('禁用设备#disable', () => {

                    it('传入非空设备id、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            device.disable({ udid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/device')
                            expect(url.query).to.deep.equal({ method: 'disable', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ udid: 'test' })

                            restore();
                            done();
                        });

                    });

                });


                describe('启用设备#enable', () => {

                    it('传入非空设备id、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            device.enable({ udid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/device')
                            expect(url.query).to.deep.equal({ method: 'enable', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ udid: 'test' })

                            restore();
                            done();
                        });
                    })

                });


                describe('擦除缓存#erase', () => {

                    it('传入非空设备id、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            device.erase({ udid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/device')
                            expect(url.query).to.deep.equal({ method: 'erase', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ udid: 'test' })

                            restore();
                            done();
                        });
                    });

                });


                describe('获取设备状态（mobile）#getStatus', () => {

                    it('传入非空设备id、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            device.getStatus({ udid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/device')
                            expect(url.query).to.deep.equal({ method: 'getstatus', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ udid: 'test' })

                            restore();
                            done();
                        });
                    });

                });


                describe('通知AnyShare缓存擦除成功（mobile）#onEraseSuc', () => {

                    it('传入非空设备id、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            device.onEraseSuc({ udid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/device')
                            expect(url.query).to.deep.equal({ method: 'onerasesuc', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ udid: 'test' })

                            restore();
                            done();
                        });
                    });

                });


            });
        })
    })
})