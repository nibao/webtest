import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as audit from './audit';

declare const { describe, it, before, after };

describe('ShareWebCore', () => {
    describe('apis', () => {
        describe('eachttp', () => {

            before('初始化userid和tokenid', () => {
                setupOpenAPI({
                    userid: '6dbf36ea-0e01-11e7-818e-005056af2424',
                    tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2',
                });
            });

            after('清除userid和tokenid', () => {
                setupOpenAPI({
                    userid: undefined,
                    tokenid: undefined,
                });
            });

            describe('审核管理#audit', () => {


                describe('获取我的共享申请#getApplys', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getApplys({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getapplys', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });
                            expect(JSON.parse(requests[0].requestBody)).to.deep.equals({});

                            restore();
                            done();
                        });
                    });

                    it('不传参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getApplys();

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getapplys', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });
                            expect(JSON.parse(requests[0].requestBody)).to.deep.equals({});

                            restore();
                            done();
                        });
                    });
                });


                describe('获取待审核的共享申请#getPendingApprovals', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getPendingApprovals({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getpendingapprovals', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });

                    it('不传参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getPendingApprovals();

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getpendingapprovals', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });

                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });
                });

                describe('获取待审核的共享申请#getPendingApprovals', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getPendingApprovalsCount({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getpendingapprovalscount', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });

                    it('不传参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getPendingApprovalsCount();

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getpendingapprovalscount', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });
                });


                describe('获取待审流程信息#getDocApprovals', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getDocApprovals({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getdocapprovals', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });

                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });

                    it('不传参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getDocApprovals();

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getdocapprovals', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });

                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });

                });


                describe('获取所有流程信息#getDocProcesses', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getDocProcesses({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getdocprocesses', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });

                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });


                    it('不传参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getDocProcesses();

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getdocprocesses', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });

                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });

                });


                describe('发起流程申请#publishDoc', () => {

                    it('传入正确的必传参数、唯一可选参数dstdocname、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.publishDoc({ processid: '-1', docid: 'gns://97A9EFA938994A8C81B95664CAFB158D/AD22345696FD417AB7F4C77EE06EF759', applymsg: '', dstdocname: 'cs11', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'publishdoc', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ processid: '-1', docid: 'gns://97A9EFA938994A8C81B95664CAFB158D/AD22345696FD417AB7F4C77EE06EF759', applymsg: '', dstdocname: 'cs11' });

                            restore();
                            done();
                        });
                    });

                });


                describe('获取申请中的流程信息#getDocApplys', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getDocApplys({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getdocapplys', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });

                });


                describe('获取流程申请历史总数量#getApplyHistoryCount', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getApplyHistoryCount({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getapplyhistorycount', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });

                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });

                });


                describe('获取流程申请历史#getApplyHistory', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getApplyHistory({ start: 0, limit: -1, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getapplyhistory', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ start: 0, limit: -1 });

                            restore();
                            done();
                        });
                    });

                });


                describe('获取流程审核历史总数量#getApproveHistoryCount', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getApproveHistoryCount({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getapprovehistorycount', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });

                });


                describe('获取流程审核历史#getApproveHistory', () => {

                    it('传入正确的必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getApproveHistory({ start: 0, limit: -1, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getapprovehistory', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });

                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ start: 0, limit: -1 });

                            restore();
                            done();
                        });
                    });

                });


                describe('获取共享申请历史数量#getShareApplyHistoryCount', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getShareApplyHistoryCount({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getshareapplyhistorycount', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });

                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });

                });


                describe('获取共享申请历史#getShareApplyHistory', () => {

                    it('传入所有必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getShareApplyHistory({ start: 0, limit: -1, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getshareapplyhistory', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ start: 0, limit: -1 });

                            restore();
                            done();
                        });
                    });

                });


                describe('获取共享审核历史数#getShareApproveHistoryCount', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getShareApproveHistoryCount({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getshareapprovehistorycount', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });                            
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({});

                            restore();
                            done();
                        });
                    });

                });


                describe('获取共享审核历史#getShareApproveHistory', () => {

                    it('传入所有必传参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            audit.getShareApproveHistory({ start: 0, limit: -1, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/audit');
                            expect(url.query).to.deep.equal({ method: 'getshareapprovehistory', userid: '6dbf36ea-0e01-11e7-818e-005056af2424', tokenid: 'cd272406-020a-42bc-bd39-a696ea401fc2' });                                                        
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ start: 0, limit: -1 });

                            restore();
                            done();
                        });
                    });

                });


            });
        });
    });
});