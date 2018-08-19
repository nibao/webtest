import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as invitation from './invitation';

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

            describe('共享邀请管理#invitation', () => {

                describe('开启共享邀请链接#open', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            invitation.open({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/invitation')
                            expect(url.query).to.deep.equal({ method: 'open', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        })
                    })

                });

                describe('设置共享邀请基本信息#setbaseinfo', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            invitation.setBaseInfo({ docid: 'test', invitationendtime: 0, perm: 1, permendtime: 0, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/invitation')
                            expect(url.query).to.deep.equal({ method: 'setbaseinfo', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test', invitationendtime: 0, perm: 1, permendtime: 0 })

                            restore();
                            done();
                        })
                    })

                });


                describe('设置共享邀请图片备注信息#setNoteInfo', () => {

                    it('传入正确的必传参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            invitation.setNoteInfo({ docid: 'test', image: '123', description: '123', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/invitation')
                            expect(url.query).to.deep.equal({ method: 'setnoteinfo', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test', image: '123', description: '123' })

                            restore();
                            done();
                        })
                    })

                });

                describe('获取共享邀请基本信息#getBaseInfoByDocId', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            invitation.getBaseInfoByDocId({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/invitation')
                            expect(url.query).to.deep.equal({ method: 'getbaseinfobydocid', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        })
                    })

                });


                describe('获取共享邀请图片备注信息#getNoteInfoByDocId', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            invitation.getNoteInfoByDocId({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/invitation')
                            expect(url.query).to.deep.equal({ method: 'getnoteinfobydocid', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        })
                    })

                })


                describe('关闭共享邀请链接#close', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            invitation.close({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/invitation')
                            expect(url.query).to.deep.equal({ method: 'close', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        })
                    })

                });


                describe('获取共享邀请信息#get', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            invitation.get({ invitationid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/invitation')
                            expect(url.query).to.deep.equal({ method: 'get' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ invitationid: 'test' })

                            restore();
                            done();
                        })
                    })

                });


                describe('加入共享邀请#join', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            invitation.join({ invitationid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/invitation')
                            expect(url.query).to.deep.equal({ method: 'join', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ invitationid: 'test' })

                            restore();
                            done();
                        })
                    })

                });


            });
        })
    })
})