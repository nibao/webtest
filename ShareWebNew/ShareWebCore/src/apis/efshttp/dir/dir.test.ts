import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as dir from './dir';

declare const { describe, it, before, after }

describe('ShareWebCore', () => {

    describe('apis', () => {
        describe('efshttp', () => {

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


            describe('目录协议#dir', () => {


                describe('创建目录协议#create', () => {

                    it('正确传入全部必传参数,传入正确的可选参数,传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.create({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                name: 'test',
                                ondup: 1,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'create',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                name: 'test',
                                ondup: 1,
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('删除目录协议#del', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.del({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'delete',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('重命名目录协议#rename', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.rename({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                name: 'test',
                                ondup: 1,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'rename',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                name: 'test',
                                ondup: 1,
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('浏览目录协议#list', () => {

                    it('正确传入全部必传参数，正确传入所有可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.list({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                by: 'name',
                                sort: 'asc',
                                attr: true,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'list',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                by: 'name',
                                sort: 'asc',
                                attr: true,
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('移动目录协议#move', () => {

                    it('正确传入全部必传参数，正确传入所有可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.move({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                destparent: 'gns://605E7DA104FF473DBA82A42E8BCD5707',
                                ondup: 1,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'move',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                destparent: 'gns://605E7DA104FF473DBA82A42E8BCD5707',
                                ondup: 1,
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('复制目录协议#copy', () => {

                    it('正确传入全部必传参数，正确传入所有可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.copy({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                destparent: 'gns://605E7DA104FF473DBA82A42E8BCD5707',
                                ondup: 1,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'copy',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                destparent: 'gns://605E7DA104FF473DBA82A42E8BCD5707',
                                ondup: 1,
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('复制目录进度查询协议#copyProgress', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.copyProgress({
                                id: '99326FF8-B2F3-42d3-B9F3-C7B3A3C2289B',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'copyprogress',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                id: '99326FF8-B2F3-42d3-B9F3-C7B3A3C2289B',
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取创建目录的建议名称#getSuggestName', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.getSuggestName({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                name: 'test',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'getsuggestname',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                name: 'test',
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取目录属性协议#attribute', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.attribute({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'attribute',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取目录大小协议#size', () => {

                    it('正确传入全部必传参数，正确传入所有可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.size({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                onlyrecycle: true,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'size',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                onlyrecycle: true,
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('设置目录密级#setCsfLevel', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.setCsfLevel({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                csflevel: 5,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'setcsflevel',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                csflevel: 5,
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('创建多级目录协议#createMultiLevelDir', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.createMultiLevelDir({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                path: '605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'createmultileveldir',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                path: '605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('检查是否是发件箱协议#isFileoutBox', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            dir.isFileoutBox({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/dir')
                            expect(url.query).deep.equal({
                                method: 'isfileoutbox',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                            })

                            restore();
                            done();
                        })
                    });

                });


            });
        })
    })
})