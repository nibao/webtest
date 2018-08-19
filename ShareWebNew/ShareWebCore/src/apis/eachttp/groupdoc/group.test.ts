import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as groupdoc from './groupdoc';

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

            describe('群组文档管理#groupdoc', () => {


                describe('删除群组#del', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            groupdoc.del({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/groupdoc')
                            expect(url.query).to.deep.equal({ method: 'delete', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        })
                    })

                });


                describe('创建群组文档#add', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            groupdoc.add({ name: 'test', quota: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/groupdoc')
                            expect(url.query).to.deep.equal({ method: 'add', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ name: 'test', quota: 'test' })

                            restore();
                            done();
                        })
                    })

                });


                describe('编辑群组名称#edit', () => {

                    it('必传参数中不传新群组名，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            groupdoc.edit({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/groupdoc')
                            expect(url.query).to.deep.equal({ method: 'edit', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ docid: 'test' })

                            restore();
                            done();
                        })
                    })

                });


                describe('编辑群组配额#editQuota', () => {

                    it('必传参数中不传新群组名，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            groupdoc.editQuota({ docid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/groupdoc')
                            expect(url.query).to.deep.equal({ method: 'editquota', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
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