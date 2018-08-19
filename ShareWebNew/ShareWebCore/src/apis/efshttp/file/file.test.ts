import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as file from './file';

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

            describe('文件协议(操作相关)#file', () => {


                describe('获取文件属性协议#attribute', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.attribute({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'attribute',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('在线播放请求协议#playInfo', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.playInfo({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                definition: 'od',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'playinfo',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                definition: 'od',
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('文档预览协议#previewOSS', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.previewOSS({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                type: 'pdf',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                watermark: true,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'previewoss',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                type: 'pdf',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                watermark: true
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('下载文件协议#OSDownload', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.OSDownload({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: 'AAA6CBAFE45B4E4D884DC59805E60A5C',
                                authtype: '',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                savename: 'test.txt',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'osdownload',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: 'AAA6CBAFE45B4E4D884DC59805E60A5C',
                                authtype: '',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                savename: 'test.txt'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('获取元数据协议#metaData', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.metaData({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: 'AAA6CBAFE45B4E4D884DC59805E60A5C',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'metadata',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: 'AAA6CBAFE45B4E4D884DC59805E60A5C'
                            });

                            restore();
                            done();
                        })
                    });

                });

                describe('#getSuggestName', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.getSuggestName({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                name: 'test.txt',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'getsuggestname',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                name: 'test.txt'
                            });

                            restore();
                            done();
                        })

                    });

                });

                describe('开始上传文件协议#OSBeginUpload', () => {

                    it('正确传入全部必传参数，正确传入部分可选参数（不传externalrequest），传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.OSBeginUpload({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                length: 42,
                                name: 'test.txt',
                                client_mtime: 1380245084296354,
                                ondup: 1,
                                reqmethod: 'put',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                csflevel: 5,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'osbeginupload',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                length: 42,
                                name: 'test.txt',
                                client_mtime: 1380245084296354,
                                ondup: 1,
                                reqmethod: 'put',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                csflevel: 5
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('上传文件完成协议#OSEndUpload', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.OSEndUpload({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                md5: 'B029C864F8E75AB6CA3BBE6976C9AF27',
                                crc32: 'C89E6EA0',
                                slice_md5: '9602A3C17962CE961F04FBECFC5594D4',
                                csflevel: 5,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'osendupload',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                md5: 'B029C864F8E75AB6CA3BBE6976C9AF27',
                                crc32: 'C89E6EA0',
                                slice_md5: '9602A3C17962CE961F04FBECFC5594D4',
                                csflevel: 5
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('获取外部文件下载#OSDownloadEXT', () => {

                    it('缺少接口文档', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.OSDownloadEXT({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                authtype: '',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                savename: 'test.txt',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'osdownloadext',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                authtype: '',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                savename: 'test.txt'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('获取自定义属性值#customAttributeValue', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.customAttributeValue({
                                attributeid: 1,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'customattributevalue',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                attributeid: 1
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('获取文件自定义属性值#getFileCustomAttribute', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.getFileCustomAttribute({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'getfilecustomattribute',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('设置文件属性值#setFileCustomAttribute', () => {

                    it('传入部分必选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.setFileCustomAttribute({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                attribute: [{ 'id': 1, 'value': [1, 2, 3] }],
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'setfilecustomattribute',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                attribute: [{ 'id': 1, 'value': [1, 2, 3] }]
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('设置文件密级#setCsfLevel', () => {

                    it('传入部分必选参数、传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.setCsfLevel({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                csflevel: 5,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'setcsflevel',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                csflevel: 5
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('添加文件标签#addTag', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.addTag({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                tag: '待添加用户标签',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'addtag',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                tag: '待添加用户标签'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('删除文件标签#deleteTag', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.deleteTag({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                tag: '待添加用户标签',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'deletetag',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                tag: '待添加用户标签'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('获取文件评论#getComment', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.getComment({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'getcomment',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('提交文件评论#submitComment', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.submitComment({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                answertoid: '9c506d88-9bdf-11e6-9834-005056927d49',
                                score: 5,
                                comment: '恩，确实不错',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'submitcomment',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                answertoid: '9c506d88-9bdf-11e6-9834-005056927d49',
                                score: 5,
                                comment: '恩，确实不错'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('删除文件评论#deleteComment', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.deleteComment({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                commentid: 5,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'deletecomment',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                commentid: 5
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('删除文件协议#del', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.del({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'delete',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772'
                            });

                            restore();
                            done();
                        })
                    });
                });


                describe('重命名文件协议#rename', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.rename({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                name: 'test.txt',
                                ondup: 1,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'rename',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                name: 'test.txt',
                                ondup: 1
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('移动文件协议#move', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.move({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                destparent: 'gns://21A9B9FD1B524CB49D54BF7399F82EB4/4283DE754B2A4261A2A59B9812D8C682',
                                ondup: 1,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'move',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                destparent: 'gns://21A9B9FD1B524CB49D54BF7399F82EB4/4283DE754B2A4261A2A59B9812D8C682',
                                ondup: 1
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('复制文件协议#copy', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.copy({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                destparent: 'gns://21A9B9FD1B524CB49D54BF7399F82EB4/4283DE754B2A4261A2A59B9812D8C682',
                                ondup: 1,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'copy',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                destparent: 'gns://21A9B9FD1B524CB49D54BF7399F82EB4/4283DE754B2A4261A2A59B9812D8C682',
                                ondup: 1
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('获取应用元数据#getAppmetadata', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.getAppmetadata({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                appid: '44e7a244-541b-4bf2-86bd-935a0e5f06b7',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'getappmetadata',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                appid: '44e7a244-541b-4bf2-86bd-935a0e5f06b7'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('转换路径协议#convertPath', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.convertPath({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'convertpath',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('添加文件多个标签#addTags', () => {

                    it('正确传入全部必传参数（包含多个标签）、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.addTags({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                tags: ['标签1', '标签2'],
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'addtags',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772',
                                tags: ['标签1', '标签2']
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('文件及文件夹批量下载#batchDownload', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.batchDownload({
                                name: 'test.zip',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                files: ["gns://6763BA63E691467E80C7051731747AB5/4E3092B407284343BBB144922B73D50C"],
                                dirs: ["gns://6763BA63E691467E80C7051731747AB5/AD62A756C43C478FA0E2157A99C39882"],
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'batchdownload',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                name: 'test.zip',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                files: ["gns://6763BA63E691467E80C7051731747AB5/4E3092B407284343BBB144922B73D50C"],
                                dirs: ["gns://6763BA63E691467E80C7051731747AB5/AD62A756C43C478FA0E2157A99C39882"]
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('开始上传大文件协议#OSInitMultiUpload', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.OSInitMultiUpload({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                length: 42,
                                name: 'test.txt',
                                ondup: 1,
                                client_mtime: 1380245084296354,
                                csflevel: 5,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'osinitmultiupload',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                length: 42,
                                name: 'test.txt',
                                ondup: 1,
                                client_mtime: 1380245084296354,
                                csflevel: 5
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('上传大文件的分块完成协议#OSCompleteUpload', () => {

                    it('OpenAPI文档不一致', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.OSCompleteUpload({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                uploadid: '0004B9895DBBB6EC98E36',
                                usehttps: true,
                                reqhost: 'anyshare.eisoo.com',
                                partinfo: { "1": ['3349DC700140D7F86A078484278075A9', 4194304] },
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'oscompleteupload',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                uploadid: '0004B9895DBBB6EC98E36',
                                usehttps: true,
                                reqhost: 'anyshare.eisoo.com',
                                partinfo: { "1": ['3349DC700140D7F86A078484278075A9', 4194304] }
                            });

                            restore();
                            done();
                        })
                    });

                });

                describe('上传大文件的分块协议#OSUploadPart', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数（不传externalrequest），传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.OSUploadPart({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                uploadid: '0004B9895DBBB6EC98E36',
                                parts: '1-2',
                                usehttps: true,
                                reqhost: 'anyshare.eisoo.com',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'osuploadpart',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                uploadid: '0004B9895DBBB6EC98E36',
                                usehttps: true,
                                reqhost: 'anyshare.eisoo.com',
                                parts: '1-2'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('获取历史版本协议#revisions', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.revisions({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'revisions',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('还原文件历史版本协议#restoreRevision', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.restoreRevision({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'restorerevision',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C'
                            });

                            restore();
                            done();
                        })
                    });

                });


                describe('对象存储的选项值#osOption', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.osOption({
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'osoption',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({})

                            restore();
                            done();
                        })
                    });

                });


                describe('上传文件更新协议#osUploadRefresh', () => {

                    it('正确传入全部必传参数，正确传入部分可选参数（不传externalrequest），传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.osUploadRefresh({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                length: 42,
                                multiupload: true,
                                reqmethod: 'put',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'osuploadrefresh',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                length: 42,
                                multiupload: true,
                                reqmethod: 'put',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('秒传校验码协议#predUpload', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.predUpload({
                                length: 439430401,
                                slice_md5: '0ACF03F408F90EA0DCBA786D300620DB',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'predupload',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                length: 439430401,
                                slice_md5: '0ACF03F408F90EA0DCBA786D300620DB'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('秒传文件协议#dupload', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.dupload({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                length: 42,
                                md5: 'B029C864F8E75AB6CA3BBE6976C9AF27',
                                crc32: 'C89E6EA0',
                                name: 'test.txt',
                                ondup: 1,
                                client_mtime: 1380245084296354,
                                csflevel: 5,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'dupload',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                length: 42,
                                md5: 'B029C864F8E75AB6CA3BBE6976C9AF27',
                                crc32: 'C89E6EA0',
                                name: 'test.txt',
                                ondup: 1,
                                client_mtime: 1380245084296354,
                                csflevel: 5
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('图片缩略图协议#thumbnail', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.thumbnail({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                height: 600,
                                width: 800,
                                quality: 75,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'thumbnail',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
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


                describe('在线播放协议#play', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.play({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'play',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('获取视频缩略图协议#playthumbnail', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.playthumbnail({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'playthumbnail',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: '91E6CBAFE45B4E4D884DC59805E60A5C'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('发送文件协议#send', () => {

                    it('正确传入全部必传参数（recipients为数组）、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.send({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                recipients: ["user1", "user2", "user3"],
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'send',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                recipients: ["user1", "user2", "user3"]
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('由名字路径获取对象信息协议#getInfoByPath', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.getInfoByPath({
                                namepath: 'user1/文件夹2',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'getinfobypath',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                namepath: 'user1/文件夹2'
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('设置应用元数据#setAppMetaData', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.setAppMetaData({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                appid: '44e7a244-541b-4bf2-86bd-935a0e5f06b7',
                                appmetadata: { "文件名": "订餐记录.pdf", "订餐人": "小王" },
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'setappmetadata',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                appid: '44e7a244-541b-4bf2-86bd-935a0e5f06b7',
                                appmetadata: { "文件名": "订餐记录.pdf", "订餐人": "小王" }
                            })

                            restore();
                            done();
                        })
                    });

                });


                describe('批量获取文件操作统计#opStatistics', () => {

                    it('正确传入全部必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            file.opStatistics({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                _useless: true
                            });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/file')
                            expect(url.query).deep.equal({
                                method: 'opstatistics',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF'
                            })

                            restore();
                            done();
                        })
                    });
                });




            })
        })
    })
})