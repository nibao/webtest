import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as link from './link';

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

            describe('外链协议link', () => {


                describe('获取外链文件信息#get', () => {

                    it('正确传入全部必传参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.get({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'get',
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取外链信息#getInfo', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.getInfo({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'getinfo',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('缩略图预览#thumbnail', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.thumbnail({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                height: 600,
                                width: 800,
                                quality: 75,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'thumbnail',
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                height: 600,
                                width: 800,
                                quality: 75
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('浏览目录#listDir', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.listDir({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                by: 'name',
                                sort: 'asc',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'listdir',
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                by: 'name',
                                sort: 'asc'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取文件#OSDownload', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.OSDownload({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                savename: 'test.txt',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'osdownload',
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                savename: 'test.txt'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('在线播放请求#playInfo', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.playInfo({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                definition: 'od',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'playinfo',
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                definition: 'od'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('文档预览#previewOSS', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.previewOSS({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                type: 'pdf',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'previewoss',
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                type: 'pdf',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('开始上传文件#OSBeginUpload', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.OSBeginUpload({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                length: 42,
                                name: 'test.txt',
                                ondup: 1,
                                client_mtime: 1380245084296354,
                                reqmethod: 'put',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'osbeginupload',
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                length: 42,
                                name: 'test.txt',
                                ondup: 1,
                                client_mtime: 1380245084296354,
                                reqmethod: 'put',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取文件#OSDownloadExt', () => {

                    it('正确传入全部必传参数，正确传入部分可选参数（不传savename），传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.OSDownloadExt({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'osdownloadext',
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('文件上传完成#OSEndUpload', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.OSEndUpload({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                md5: 'B029C864F8E75AB6CA3BBE6976C9AF27',
                                crc32: 'C89E6EA0',
                                slice_md5: '9602A3C17962CE961F04FBECFC5594D4',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'osendupload',
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                md5: 'B029C864F8E75AB6CA3BBE6976C9AF27',
                                crc32: 'C89E6EA0',
                                slice_md5: '9602A3C17962CE961F04FBECFC5594D4'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取外链开启信息#getDetail', () => {

                    it('正确传入全部必传参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.getDetail({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'getdetail',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('修改外链#set', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.set({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                open: false,
                                endtime: 1380502542876354,
                                perm: 3,
                                limittimes: -1,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'set',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                open: false,
                                endtime: 1380502542876354,
                                perm: 3,
                                limittimes: -1
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('开启外链#open', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.open({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                open: false,
                                endtime: 1380502542876354,
                                perm: 3,
                                limittimes: -1,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'open',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                open: false,
                                endtime: 1380502542876354,
                                perm: 3,
                                limittimes: -1
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('关闭外链#close', () => {

                    it('正确传入全部必传参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.close({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'close',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('权限检查#checkPerm', () => {

                    it('正确传入全部必传参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.checkPerm({
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                perm: 1,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'checkperm',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                perm: 1,
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('由提取码获取外链#getLinkByAccessCode', () => {

                    it('正确传入全部必传参数，传入单个无关参数（缺少OpenAPI文档）', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.getLinkByAccessCode({
                                accesscode: 'abcdefg',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'getlinkbyaccesscode',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                accesscode: 'abcdefg'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('文件及文件夹批量下载#batchDownload', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.batchDownload({
                                name: 'test.txt',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                files: ["gns://6763BA63E691467E80C7051731747AB5/4E3092B407284343BBB144922B73D50C"],
                                dirs: ["gns://6763BA63E691467E80C7051731747AB5/AD62A756C43C478FA0E2157A99C39882"],
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'batchdownload',
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                name: 'test.txt',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                files: ["gns://6763BA63E691467E80C7051731747AB5/4E3092B407284343BBB144922B73D50C"],
                                dirs: ["gns://6763BA63E691467E80C7051731747AB5/AD62A756C43C478FA0E2157A99C39882"],
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('复制协议#copy', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.copy({
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                destparent: 'gns://21A9B9FD1B524CB49D54BF7399F82EB4/4283DE754B2A4261A2A59B9812D8C682',
                                ondup: 1,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'copy',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                link: 'FC5E038D38A57032085441E7FE7010B0',
                                password: '4def',
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                destparent: 'gns://21A9B9FD1B524CB49D54BF7399F82EB4/4283DE754B2A4261A2A59B9812D8C682',
                                ondup: 1
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取被访问文件列表#opFiles', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.opFiles({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                start: 0,
                                limit: -1,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'opfiles',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                start: 0,
                                limit: -1
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取文件访问详情#opStatistics', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.opStatistics({
                                link_docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926/21A9B9FD1B524CB49D54BF7399F82EB4',
                                file_docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926/21A9B9FD1B524CB49D54BF7399F82EB4',
                                start: 0,
                                limit: -1,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'opstatistics',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                link_docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926/21A9B9FD1B524CB49D54BF7399F82EB4',
                                file_docid: 'gns://DED18AD77A2849509DB0A7F6BAA58926/21A9B9FD1B524CB49D54BF7399F82EB4',
                                start: 0,
                                limit: -1
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取我的外链#getLinked', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.getLinked({
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'getlinked',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({

                            })

                            restore();
                            done();
                        })
                    });
                });


                describe('在线播放#paly', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.play({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'play',
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取视频缩略图#playThumbnail', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.playThumbnail({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'playthumbnail',
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('复制目录进度查询协议#copyProgress', () => {

                    it('正确传入全部必传参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            link.copyProgress({
                                id: '99326FF8-B2F3-42d3-B9F3-C7B3A3C2289B',
                                _useless: true,
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/link')
                            expect(url.query).deep.equal({
                                method: 'copyprogress',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                id: '99326FF8-B2F3-42d3-B9F3-C7B3A3C2289B'
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