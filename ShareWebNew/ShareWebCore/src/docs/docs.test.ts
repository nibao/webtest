import { expect } from 'chai';
import * as sinon from 'sinon';

import * as dir from '../apis/efshttp/dir/dir'
import * as file from '../apis/efshttp/file/file';
import * as openapi from '../openapi/openapi';
import * as config from '../config/config';
import * as gns from '../gns/gns';

import * as docs from './docs';
import { listByName } from './docs';


const sandbox = sinon.createSandbox();

describe('ShareWebCore', () => {
    describe('docs', () => {


        describe('判断是否为目录#isDir', () => {
            context('以下几种情况判断是目录：返回true', () => {
                it('doc对象存在isDir为true的属性', () => {
                    expect(docs.isDir({ isDir: true })).to.be.true
                    expect(docs.isDir({ isDir: true, isdir: false })).to.be.true
                    expect(docs.isDir({ isDir: true, docsize: 100 })).to.be.true
                    expect(docs.isDir({ isDir: true, isdir: false, docsize: 100 })).to.be.true
                });

                it('doc对象不存在isDir为true的属性，并且不存在size和isdir属性', () => {
                    expect(docs.isDir({ isDir: false })).to.be.true
                    expect(docs.isDir({ isDir: false, useless: '' })).to.be.true
                });

                it('doc对象不存在isDir为true的属性，size属性为-1', () => {
                    expect(docs.isDir({ isDir: false, size: -1 })).to.be.true
                    expect(docs.isDir({ isDir: false, size: -1, useless: '' })).to.be.true
                });

                it('doc对象不存在isDir为true的属性，size不存在或不为-1，isdir为true', () => {
                    expect(docs.isDir({ isDir: false, isdir: true })).to.be.true
                    expect(docs.isDir({ isDir: false, size: 100, isdir: true })).to.be.true
                });

            })

            context('以下几种情况判断不是目录：返回false', () => {
                it('isDir为false 且 size不为undefined或-1 且 isdir为undefined', () => {
                    expect(docs.isDir({ isDir: false, size: 100 })).to.be.false
                });

                it('doc对象存在isDir为false的属性 && size不为undefined或-1 && isdir属性为false', () => {
                    expect(docs.isDir({ isDir: false, size: 100, isdir: false })).to.be.false
                });
            });
        });


        describe('获取文档名称，包括入口文档和普通文档#docname', () => {
            it('doc.name属性值存在且不为空字符串：返回doc.name', () => {
                expect(docs.docname({ name: 'name' })).to.be.equal('name');
                expect(docs.docname({ name: 'name', docname: 'docname', basename: 'basename', ext: 'doc' })).to.be.equal('name');
            });

            it('doc.name不存在或属性值为空字符串，存在不为空的docname属性：返回doc.docname', () => {
                expect(docs.docname({ docname: 'docname' })).to.be.equal('docname');
                expect(docs.docname({ name: '', docname: 'docname' })).to.be.equal('docname');
                expect(docs.docname({ name: '', docname: 'docname', basename: 'basename', ext: 'doc' })).to.be.equal('docname');
            });

            it('doc.name不存在或值为空并且doc.docname不存在或值为空：返回docname和ext拼接后的字符串', () => {
                expect(docs.docname({ basename: 'basename', ext: '.doc' })).to.be.equal('basename.doc')
                expect(docs.docname({ name: '', basename: 'basename', ext: '.doc' })).to.be.equal('basename.doc')
                expect(docs.docname({ docname: '', basename: 'basename', ext: '.doc' })).to.be.equal('basename.doc')
                expect(docs.docname({ name: '', docname: '', basename: 'basename', ext: '.doc' })).to.be.equal('basename.doc')
            });

            it('doc.name doc.docname doc.basename doc.ext都不存在或都为空:返回空字符串', () => {
                expect(docs.docname({})).to.be.equal('')
                expect(docs.docname({ useless: '' })).to.be.equal('')
                expect(docs.docname({ name: '', docname: '', basename: '', ext: '' })).to.be.equal('')
            })
        });


        describe('返回正确的打开方式#getOpenMethod', () => {

            it('文件没有后缀名时：返回0(打开方式为LIST)', () => {
                expect(docs.getOpenMethod({ name: 'foo', size: -1 })).to.equal(docs.OpenMethod.LIST);
            })

            it('后缀为.pdf .doc .xls .ppt .txt时：返回1(打开方式为PREVIEW)', () => {
                expect(docs.getOpenMethod({ name: 'foo.pdf', size: 1 })).to.equal(docs.OpenMethod.PREVIEW);
                expect(docs.getOpenMethod({ name: 'foo.doc', size: 1 })).to.equal(docs.OpenMethod.PREVIEW);
                expect(docs.getOpenMethod({ name: 'foo.xls', size: 1 })).to.equal(docs.OpenMethod.PREVIEW);
                expect(docs.getOpenMethod({ name: 'foo.ppt', size: 1 })).to.equal(docs.OpenMethod.PREVIEW);
                expect(docs.getOpenMethod({ name: 'foo.txt', size: 1 })).to.equal(docs.OpenMethod.PREVIEW);
            });

            it('后缀为.mp4 .mp3时：返回2(打开方式为PLAY)', () => {
                expect(docs.getOpenMethod({ name: 'foo.mp4', size: 1 })).to.equal(docs.OpenMethod.PLAY);
                expect(docs.getOpenMethod({ name: 'foo.mp3', size: 1 })).to.equal(docs.OpenMethod.PLAY);
            });

            it('后缀为.jpg时：返回3(打开方式为THUMBNAIL)', () => {
                expect(docs.getOpenMethod({ name: 'foo.jpg', size: 1 })).to.equal(docs.OpenMethod.THUMBNAIL);
            });

            it('后缀为.zip时：返回4(打开方式为ABOUT)', () => {
                expect(docs.getOpenMethod({ name: 'foo.zip', size: 1 })).to.equal(docs.OpenMethod.ABOUT);

            })

        });


        describe('按正确规则排序#sort', () => {

            it('只存在文件时：文件按照正确顺序排序', () => {
                const alphabeltNamed = { name: 'a', size: 1 };
                const numberNamed = { name: '0', size: 1 };
                const chsNamed = { name: '文件', size: 1 };

                expect(docs.sort([alphabeltNamed, numberNamed, chsNamed])).deep.equal([numberNamed, alphabeltNamed, chsNamed])
            });

            it('只存在路径时：路径按照正确顺序排序', () => {
                const alphabeltNamed = { name: 'a', size: -1 };
                const numberNamed = { name: '0', size: -1 };
                const chsNamed = { name: '文件', size: -1 };

                expect(docs.sort([alphabeltNamed, numberNamed, chsNamed])).deep.equal([numberNamed, alphabeltNamed, chsNamed])
            });

            it('存在文件和路径，文件和路径同名时:路径应该排在前面', () => {
                const dir = { name: 'dir', size: -1 };
                const file = { name: 'dir', size: 1 }
                expect(docs.sort([file, dir])).deep.equal([dir, file]);
                expect(docs.sort([dir, file])).deep.equal([dir, file]);
            });

        });


        describe('合并dirs和files#combineDocs', () => {
            const file = [{ docid: 'docid', name: 'name', rev: 'rev', size: 1, modified: 1, client_mtime: 1, attr: 1 }]
            const files = [{ docid: 'docid', name: 'name', rev: 'rev', size: 1, modified: 1, client_mtime: 1, attr: 1 }, { docid: 'docid2', name: 'name2', rev: 'rev2', size: 2, modified: 2, client_mtime: 2, attr: 2 }]
            const dir = [{ docid: 'docid', name: 'name', rev: 'rev', size: -1, modified: 1, client_mtime: 1, attr: 1 }]
            const dirs = [{ docid: 'docid', name: 'name', rev: 'rev', size: -1, modified: 1, client_mtime: 1, attr: 1 }, { docid: 'docid2', name: 'name2', rev: 'rev2', size: -1, modified: 2, client_mtime: 2, attr: 2 }]

            it('dirs为[],files为[]:返回[]', () => {
                expect(docs.combineDocs({ dirs: [], files: [] })).to.deep.equal([]);
            });

            it('dirs为[]:正确返回拼接后的数组', () => {
                expect(docs.combineDocs({ dirs: [], files: file })).to.deep.equal(file);
                expect(docs.combineDocs({ dirs: [], files: files })).to.deep.equal(files);
            });

            it('files为[]:正确返回拼接后的数组', () => {
                expect(docs.combineDocs({ dirs: dir, files: [] })).to.deep.equal(dir);
                expect(docs.combineDocs({ dirs: dirs, files: [] })).to.deep.equal(dirs);
            });

            it('files和dirs都不为空：正确返回拼接后的数组', () => {
                expect(docs.combineDocs({ dirs: dir, files: file })).to.deep.equal(dir.concat(file));
                expect(docs.combineDocs({ dirs: dir, files: files })).to.deep.equal(dir.concat(files));
                expect(docs.combineDocs({ dirs: dirs, files: file })).to.deep.equal(dirs.concat(file));
                expect(docs.combineDocs({ dirs: dirs, files: files })).to.deep.equal(dirs.concat(files));
            });
        });


        describe('列举目录#listDir', () => {

            beforeEach('stub 外部模块list', () => {
                sandbox.stub(dir, 'list');
            });

            afterEach('restore list模块', () => {
                sandbox.restore();
            });

            it('list模块以正确的参数被调用', () => {
                dir.list.resolves({ dirs: [], files: [] });
                docs.listDir({ docid: 'docid' });
                docs.listDir({ docid: 'docid', useless: '' });
                expect(dir.list.getCall(0).calledWith({ docid: 'docid' })).to.be.true;
                expect(dir.list.getCall(1).calledWith({ docid: 'docid' })).to.be.true;
            });
        });


        describe('列举文档并缓存#cacheDB(listDir)', () => {
            it('暂不测试，意义不大，应该对cacheDB进行覆盖');
        });


        describe('读取docid下所有文档，包括入口文档和list出的文档#load', () => {
            it('无法stub内部模块，暂时不进行测试');
        });


        describe('获取下载地址#getDownloadURL', () => {
            before('stub 外部模块getOpenAPIConfig和OSDownload', () => {
                sandbox.stub(openapi, 'getOpenAPIConfig');
                sandbox.stub(file, 'OSDownload');
            });

            afterEach('restore 外部模块', () => {
                sandbox.restore();
            });

            it('OSDownload被正确调用，返回正确的url', () => {
                openapi.getOpenAPIConfig.returns('http://anyshare.eisoo.com');
                file.OSDownload.resolves({ authrequest: ['GET', 'http://192.168.138.30:9028/anyshares3accesstestbucket'] })

                return docs.getDownloadURL({ docid: 'docid', rev: 'rev', userid: 'userid', tokenid: 'tokenid', savename: 'savename' }).then(url => {
                    expect(file.OSDownload.calledWith({ docid: 'docid', rev: 'rev', authtype: 'QUERY_STRING', reqhost: 'anyshare.eisoo.com', usehttps: false, savename: 'savename' }, { userid: 'userid', tokenid: 'tokenid' })).to.be.true
                    expect(url).to.equal('http://192.168.138.30:9028/anyshares3accesstestbucket');
                })
            });

        });



        describe('批量下载#getBatchDownloadURL', () => {
            before('stub 外部模块getOpenAPIConfig和batchDownload', () => {
                sandbox.stub(openapi, 'getOpenAPIConfig');
                sandbox.stub(file, 'batchDownload');
            });

            afterEach('restore外部模块', () => {
                sandbox.restore();
            });

            it('batchDownload被正确调用，返回正确的url', () => {
                openapi.getOpenAPIConfig.returns('http://anyshare.eisoo.com');
                file.batchDownload.resolves({ method: 'GET', url: 'http://192.168.138.30:9028/anyshares3accesstestbucket' })

                return docs.getBatchDownloadURL({ name: 'name', files: ['file-gns1', 'file-gns2'], dirs: ['dir-gns1', 'dir-gns2'] }).then(url => {
                    expect(file.batchDownload.calledWith({ name: 'name', reqhost: 'anyshare.eisoo.com', usehttps: false, files: ['file-gns1', 'file-gns2'], dirs: ['dir-gns1', 'dir-gns2'] })).to.be.true
                    expect(url).to.equal('http://192.168.138.30:9028/anyshares3accesstestbucket');
                })
            });

        });


        describe('下载文件#download', () => {
            it('在getDownloadURL中进行覆盖')
        });


        describe('是否可以使用OWAS预览#canOWASPreview', () => {
            beforeEach('stub getOEMConfig模块', () => {
                sandbox.stub(config, 'getOEMConfig');
            });
            afterEach('restore getOEMConfig模块', () => {
                sandbox.restore()
            });

            context('未开启OWAS：返回false', () => {
                it('支持的owas格式', () => {
                    config.getOEMConfig.resolves({ owasurl: '', wopiurl: '' })
                    return docs.canOWASPreview({ name: 'name.doc' }).then(isSupported => {
                        expect(isSupported).to.be.false;
                    })
                });
                it('不支持的owas格式', () => {
                    config.getOEMConfig.resolves({ owasurl: '', wopiurl: '' })
                    return docs.canOWASPreview({ name: 'name.abc' }).then(isSupported => {
                        expect(isSupported).to.be.false;
                    })
                });
            });

            context('开启OWAS，但是不是支持的文件格式：返回false', () => {
                it('任意不支持的格式', () => {
                    config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                    return docs.canOWASPreview({ name: 'name.dac' }).then(isSupported => {
                        expect(isSupported).to.be.false;
                    })
                });
            });

            context('开启OWAS，并且是支持的文件格式：返回true', () => {
                it('word文件格式：返回true', () => {
                    config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                    return docs.canOWASPreview({ name: 'name.doc' }).then(isSupported => {
                        expect(isSupported).to.be.true;
                    })
                });
                it('excel文件格式：返回true', () => {
                    config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                    return docs.canOWASPreview({ name: 'name.xlsm' }).then(isSupported => {
                        expect(isSupported).to.be.true;
                    })
                });
                it('PPT文件格式：返回true', () => {
                    config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                    return docs.canOWASPreview({ name: 'name.odp' }).then(isSupported => {
                        expect(isSupported).to.be.true;
                    })
                });
            });

        });


        describe('是否可以使用OWA编辑', () => {
            beforeEach('stub getOEMConfig模块', () => {
                sandbox.stub(config, 'getOEMConfig');
            });
            afterEach('restore getOEMConfig模块', () => {
                sandbox.restore()
            });

            context('未开启OWAS：返回false', () => {
                it('支持的owas编辑格式', () => {
                    config.getOEMConfig.resolves({ owasurl: '', wopiurl: '' })
                    return docs.canOWASEdit({ name: 'name.doc' }).then(isSupported => {
                        expect(isSupported).to.be.false;
                    })
                });

                it('不支持的owas编辑格式', () => {
                    config.getOEMConfig.resolves({ owasurl: '', wopiurl: '' })
                    return docs.canOWASEdit({ name: 'name.abc' }).then(isSupported => {
                        expect(isSupported).to.be.false;
                    })
                });
            });

            context('开启OWAS，但是不是支持的文件格式：返回false', () => {
                it('支持预览但是不支持编辑的格式', () => {
                    config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                    return docs.canOWASEdit({ name: 'name.dotx' }).then(isSupported => {
                        expect(isSupported).to.be.false;
                    })
                });

                it('不支持预览且不支持编辑的格式', () => {
                    config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                    return docs.canOWASEdit({ name: 'name.dac' }).then(isSupported => {
                        expect(isSupported).to.be.false;
                    })
                });

            });

            context('开启OWAS，并且是支持的文件格式：返回true', () => {
                it('支持编辑的word文件格式：返回true', () => {
                    config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                    return docs.canOWASEdit({ name: 'name.docx' }).then(isSupported => {
                        expect(isSupported).to.be.true;
                    })
                });

                it('支持编辑的excel文件格式：返回true', () => {
                    config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                    return docs.canOWASEdit({ name: 'name.xlsx' }).then(isSupported => {
                        expect(isSupported).to.be.true;
                    })
                });

                it('支持编辑的PPT文件格式：返回true', () => {
                    config.getOEMConfig.resolves({ owasurl: 'owasurl', wopiurl: 'wopiurl' })
                    return docs.canOWASEdit({ name: 'name.pptx' }).then(isSupported => {
                        expect(isSupported).to.be.true;
                    })
                });
            });

        });


        describe('是否支持cad预览#canCADPreview', () => {
            beforeEach('stub getOEMConfig模块', () => {
                sandbox.stub(config, 'getOEMConfig');
            });
            afterEach('restore getOEMConfig模块', () => {
                sandbox.restore()
            });
            it('不支持cad预览：返回false', () => {
                config.getOEMConfig.withArgs('cadpreview').resolves(false);
                return docs.canCADPreview().then(isSupported => {
                    expect(isSupported).to.be.false
                })
            });

            it('支持cad预览：返回true', () => {
                config.getOEMConfig.withArgs('cadpreview').resolves(true);
                return docs.canCADPreview().then(isSupported => {
                    expect(isSupported).to.be.true
                })
            });
        });


        describe('通过名字查找缓存的文档对象，可能返回多个匹配的名字#listByName', () => {
            const mockdata = {
                'docid1': { name: 'name1', size: -1, useless: 'useless' },
                'docid2': { name: 'name2', size: 100, useless: 'useless' },
                'docid3': { name: 'name3', size: 101, useless: 'useless' },
                'docid4': { name: 'name3', size: -1, useless: 'useless' }
            }

            beforeEach('stub DATABASE模块', () => {
                sandbox.stub(gns, 'DATABASE').value(mockdata);
            });

            afterEach('restore DATABASE模块', () => {
                sandbox.restore()
            });

            it('匹配单个：返回单个文档对象组成的数组', () => {
                expect(listByName('name1')).to.deep.equal([mockdata['docid1']])
                expect(listByName('name2')).to.deep.equal([mockdata['docid2']])
            });

            it('匹配多个：返回多个文档对象组成的数组', () => {
                expect(listByName('name3')).to.deep.equal([mockdata['docid3'], mockdata['docid4']])
            });

            it('未匹配：返回空数组[]', () => {
                expect(listByName('name')).to.deep.equal([])
            });
        });


        describe('查找目录下子文档#findSubs', () => {
            const mockdata = {
                'gns://dir1': { docid: 'gns://dir1', size: -1, name: 'Yemeni Rial Camp', attr: 83907924, create_time: 1507533932871301, modified: 1507533932871302, creator: 'Jazmyne McDermott', rev: 'rev1' },
                'gns://dir1/dir2': { docid: 'gns://dir1/dir2', size: -1, name: 'Incredible Wooden Chips', attr: 83907924, create_time: 1507533932871301, modified: 1507533932871302, creator: 'creator1Zion Price', rev: 'rev1' },
                'gns://dir1/dir2/dir3': { docid: 'gns://dir1/dir2/dir3', size: -1, name: 'indexingdir3', attr: 83907924, create_time: 1507533932871301, modified: 1507533932871302, creator: 'Avery Kulascreator1', rev: 'rev1' },
                'gns://dir1/file1': { docid: 'gns://dir1/file1', size: 1, name: 'file1investment_account_navigate.wav', attr: 83907924, create_time: 1507533932871301, modified: 1507533932871302, creator: 'creator1Alice Predovic Sr.', rev: 'rev1' },
                'gns://dir1/dir2/file2': { docid: 'gns://dir1/dir2/file2', size: 2, name: 'file2multi_lateral_circles_research.htm', attr: 83907924, create_time: 1507533932871301, modified: 1507533932871302, creator: 'Lurline Okunevacreator1', rev: 'rev1' },
                'gns://dir1/dir2/file3': { docid: 'gns://dir1/dir2/file3', size: 3, name: 'generic.mpe', attr: 83907924, create_time: 1507533932871301, modified: 1507533932871302, creator: 'creator1', rev: 'rev1' },
            }

            beforeEach('stub DATABASE模块', () => {
                sandbox.stub(gns, 'DATABASE').value(mockdata);
            });

            afterEach('restore DATABASE模块', () => {
                sandbox.restore()
            });

            context('不传过滤函数', () => {
                it('目录下存在文件或目录：返回目录下所有doc对象构成的数组', () => {
                    expect(docs.findSubs(mockdata['gns://dir1'])).to.deep.equal([mockdata['gns://dir1/dir2'], mockdata['gns://dir1/file1']])
                    expect(docs.findSubs(mockdata['gns://dir1/dir2'])).to.deep.equal([mockdata['gns://dir1/dir2/dir3'], mockdata['gns://dir1/dir2/file2'], mockdata['gns://dir1/dir2/file3']])
                });

                it('目录下不存在文件或目录：返回[]', () => {
                    expect(docs.findSubs(mockdata['gns://dir1/dir2/dir3'])).to.deep.equal([]);
                });

            });

            context('传递过滤函数', () => {

                it('子目录下存在文件或目录,且都满足过滤条件：返回目录下所有doc对象数组', () => {
                    expect(docs.findSubs(mockdata['gns://dir1'], (doc) => doc.attr === 83907924)).to.deep.equal([mockdata['gns://dir1/dir2'], mockdata['gns://dir1/file1']])
                });

                it('子目录下存在文件或目录,且部分满足过滤条件：返回过滤后的doc对象数组', () => {
                    expect(docs.findSubs(mockdata['gns://dir1'], (doc) => doc.creator === 'creator1Zion Price')).to.deep.equal([mockdata['gns://dir1/dir2']])
                    expect(docs.findSubs(mockdata['gns://dir1/dir2'], (doc) => doc.creator === 'Lurline Okunevacreator1')).to.deep.equal([mockdata['gns://dir1/dir2/file2']])
                });

                it('子目录下存在文件或目录,但都不满足过滤条件：返回[]', () => {
                    expect(docs.findSubs(mockdata['gns://dir1'], (doc) => doc.creator === 'other')).to.deep.equal([])
                    expect(docs.findSubs(mockdata['gns://dir1'], (doc) => doc.size === 100)).to.deep.equal([])
                });

                it('子目录下不存在文件或目录：返回[]', () => {
                    expect(docs.findSubs(mockdata['gns://dir1/dir2/dir3'], (doc) => doc.size === 100)).to.deep.equal([])
                });
            });
        });


        describe('从数据中中查找docid对应的文档#findById', () => {
            const mockdata = {
                'docid1': { name: 'name1', size: -1, useless: 'useless' },
                'docid2': { name: 'name2', size: 100, useless: 'useless' },
                'docid3': { name: 'name3', size: 101, useless: 'useless' },
                'docid4': { name: 'name3', size: -1, useless: 'useless' }
            }

            beforeEach('stub DATABASE模块', () => {
                sandbox.stub(gns, 'DATABASE').value(mockdata);
            });

            afterEach('restore DATABASE模块', () => {
                sandbox.restore();
            });
            it('docid对应的对象存在：返回对应的doc对象', () => {
                expect(docs.findById('docid1')).to.deep.equal(mockdata['docid1']);
                expect(docs.findById('docid4')).to.deep.equal(mockdata['docid4']);
            });
            it('docid对应的对象不存在：返回[]', () => {
                expect(docs.findById('notExist')).to.be.null;
            });
        });

    });
})