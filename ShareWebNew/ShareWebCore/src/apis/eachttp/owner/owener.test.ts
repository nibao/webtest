import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as owner from './owner';

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

            describe('所有者管理#owner', () => {


                describe('检查是否是文档id的所有者#check', () => {

                    it('正确传入全部必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            owner.check({ docid: '123', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/owner')
                            expect(url.query).to.deep.equal({ method: 'check', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: '123' })

                            restore();
                            done();
                        })
                    })

                });


                describe('添加所有者（永久有效）#addByEndTime', () => {

                    it('正确传入全部必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            owner.addByEndTime({ docid: '123', userids: ['zs', 'ls'], _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/owner')
                            expect(url.query).to.deep.equal({ method: 'addbyendtime', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: '123', userids: ['zs', 'ls'] })

                            restore();
                            done();
                        })
                    })

                });


                describe('获取所有者信息#get', () => {

                    it('正确传入全部必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            owner.get({ docid: '123', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/owner')
                            expect(url.query).to.deep.equal({ method: 'get', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: '123' })

                            restore();
                            done();
                        })
                    })

                });


                describe('删除所有者#del', () => {

                    it('正确传入全部必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            owner.del({ docid: '123', userids: ['zs', 'ls'], _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/owner')
                            expect(url.query).to.deep.equal({ method: 'delete', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: '123', userids: ['zs', 'ls'] })

                            restore();
                            done();
                        })
                    })

                });


                describe('一次批量设置所有者#set', () => {

                    it('传入不完整的必传参数（缺失userid、inheritpath）、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            owner.set({ docid: '123', userconfigs: [], _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/owner')
                            expect(url.query).to.deep.equal({ method: 'set', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: '123', userconfigs: [] })

                            restore();
                            done();
                        })
                    })

                });


            });
        })
    })
})