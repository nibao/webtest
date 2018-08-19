import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as department from './department';

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

            describe('部门管理#department', () => {


                describe('获取用户所能访问的根部门信息#getRoots', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            department.getRoots({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/department')
                            expect(url.query).to.deep.equal({ method: 'getroots', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({})

                            restore();
                            done();
                        })
                    })

                });


                describe('获取子部门信息#getSubDeps', () => {

                    it('传入非空子部门id，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            department.getSubDeps({ depid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/department')
                            expect(url.query).to.deep.equal({ method: 'getsubdeps', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ depid: 'test' })

                            restore();
                            done();
                        })
                    })

                });


                describe('获取部门下的子用户信息#getSubUsers', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            department.getSubUsers({ depid: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/department')
                            expect(url.query).to.deep.equal({ method: 'getsubusers', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ depid: 'test' })

                            restore();
                            done();
                        })
                    })

                });

                describe('在组织下搜索用户和部门信息#search', () => {

                    it('传入非空搜索关键词、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            department.search({ key: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/department')
                            expect(url.query).to.deep.equal({ method: 'search', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ key: 'test' })
                            
                            restore();
                            done();
                        })
                    })

                });


            });
        })
    })
})