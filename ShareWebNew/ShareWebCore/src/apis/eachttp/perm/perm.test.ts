import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as perm from './perm';

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

            describe('权限管理（支持细粒度）#perm', () => {


                describe('检查单个权限#check', () => {

                    it('正确传入全部必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            perm.check({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                perm: 2,
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/perm1')
                            expect(url.query).to.deep.equal({ method: 'check', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                perm: 2,
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41'
                            })

                            restore();
                            done();
                        })
                    });

                })


                describe('获取权限配置信息#get', () => {

                    it('正确传入全部必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            perm.get({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/perm1')
                            expect(url.query).to.deep.equal({ method: 'get', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926'
                            })

                            restore();
                            done();
                        })
                    });

                })


                describe('一次批量设置权限#set', () => {

                    it('正确传入全部必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            perm.set({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                permconfigs: [
                                    {
                                        'id': 23,
                                        'isallowed': true,
                                        'permvalue': 3,
                                        'accessorid': 'd22f7ec5-231f-35f5-a495-9194b66193e4',
                                        'accessortype': 'department',
                                        'endtime': 1380502542876354,
                                        'inheritpath': ''
                                    }
                                ],
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/perm1')
                            expect(url.query).to.deep.equal({ method: 'set', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                permconfigs: [
                                    {
                                        'id': 23,
                                        'isallowed': true,
                                        'permvalue': 3,
                                        'accessorid': 'd22f7ec5-231f-35f5-a495-9194b66193e4',
                                        'accessortype': 'department',
                                        'endtime': 1380502542876354,
                                        'inheritpath': ''
                                    }
                                ]
                            })

                            restore();
                            done();
                        })
                    });

                })


                describe('获取内链共享模板#getInternalLinkTemplate', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            perm.getInternalLinkTemplate({
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/perm1')
                            expect(url.query).to.deep.equal({ method: 'getinternallinktemplate', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({

                            })

                            restore();
                            done();
                        })
                    });
                })


                describe('获取外链共享模板#getExternalLinkTemplate', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            perm.getExternalLinkTemplate({
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/perm1')
                            expect(url.query).to.deep.equal({ method: 'getexternallinktemplate', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({

                            })

                            restore();
                            done();
                        })
                    });

                })


                describe('展示各访问者的最终权限#list', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            perm.list({
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/perm1')
                            expect(url.query).to.deep.equal({ method: 'list', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({

                            })

                            restore();
                            done();
                        })
                    });

                })


                describe('添加权限配置#add', () => {

                    it('正确传入全部必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            perm.add({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                permconfigs: [
                                    {
                                        'id': 23,
                                        'isallowed': true,
                                        'permvalue': 3,
                                        'accessorid': 'd22f7ec5-231f-35f5-a495-9194b66193e4',
                                        'accessortype': 'department',
                                        'endtime': 1380502542876354,
                                        'inheritpath': ''
                                    }
                                ],
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/perm1')
                            expect(url.query).to.deep.equal({ method: 'add', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                permconfigs: [
                                    {
                                        'id': 23,
                                        'isallowed': true,
                                        'permvalue': 3,
                                        'accessorid': 'd22f7ec5-231f-35f5-a495-9194b66193e4',
                                        'accessortype': 'department',
                                        'endtime': 1380502542876354,
                                        'inheritpath': ''
                                    }
                                ]
                            })

                            restore();
                            done();
                        })
                    });
                })


                describe('编辑权限配置#edit', () => {

                    it('正确传入全部必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            perm.edit({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                permconfigs: [
                                    {
                                        'id': 23,
                                        'isallowed': true,
                                        'permvalue': 3,
                                        'accessorid': 'd22f7ec5-231f-35f5-a495-9194b66193e4',
                                        'accessortype': 'department',
                                        'endtime': 1380502542876354,
                                        'inheritpath': ''
                                    }
                                ],
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/perm1')
                            expect(url.query).to.deep.equal({ method: 'edit', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                permconfigs: [
                                    {
                                        'id': 23,
                                        'isallowed': true,
                                        'permvalue': 3,
                                        'accessorid': 'd22f7ec5-231f-35f5-a495-9194b66193e4',
                                        'accessortype': 'department',
                                        'endtime': 1380502542876354,
                                        'inheritpath': ''
                                    }
                                ]
                            })

                            restore();
                            done();
                        })
                    });

                })


                describe('删除权限配置#del', () => {

                    it('正确传入全部必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            perm.del({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                permids: [2, 3, 4],
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/perm1')
                            expect(url.query).to.deep.equal({ method: 'delete', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                permids: [2, 3, 4]
                            })

                            restore();
                            done();
                        })
                    });

                })


                describe('检查所有权限#checkAll', () => {

                    it('正确传入全部必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            perm.checkAll({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/perm1')
                            expect(url.query).to.deep.equal({ method: 'checkall', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41'
                            })

                            restore();
                            done();
                        })
                    });

                })


                describe('获取用户已共享文档#getShared', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            perm.getShared({
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/perm1')
                            expect(url.query).to.deep.equal({ method: 'getshared', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({

                            })

                            restore();
                            done();
                        })
                    });

                })


                describe('获取共享文档开关配置#getShareDocConfig', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            perm.getShareDocConfig({
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/perm1')
                            expect(url.query).to.deep.equal({ method: 'getsharedocconfig', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({

                            })

                            restore();
                            done();
                        })
                    });

                })


            });
        })
    })
})