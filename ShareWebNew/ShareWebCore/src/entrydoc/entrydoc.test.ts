import { expect } from 'chai';
import { useFakeXHR } from '../../libs/fake-server-factory';
import { createSandbox, stub } from 'sinon';
import * as entrydoc from '../apis/eachttp/entrydoc/entrydoc';
import {
    DocType,
    queryAll,
    queryByType,
    getResolvedAll,
    getResolvedByType,
    ViewDocType,
    ViewTypesName,
    getViewById,
    getTopViews,
    getViewByType,
    isTopView,
    getTypeNameByDocType,
    getDocTypeByName,
    getTypeById,
    getViewName,
    resolveEntries,
    calcGNSLevel,
    groupByType,
    getIds
} from './entrydoc';
import __ from './locale';
import { sandboxStub } from '../../libs/test-helper';


describe('ShareWebCore', () => {
    describe('entrydoc', () => {
        const sandbox = createSandbox()

        beforeEach('stub', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: entrydoc,
                    moduleProp: ['get', 'getViews']
                }
            ])
        })

        afterEach('restore', () => {
            sandbox.restore()
        })

        it('导出文档类型参数枚举#DocType', () => {
            expect(DocType.userdoc).to.equal(1)
            expect(DocType.groupdoc).to.equal(2)
            expect(DocType.customdoc).to.equal(3)
            expect(DocType.sharedoc).to.equal(4)
            expect(DocType.archivedoc).to.equal(5)
        })

        it('导出文档分类枚举#ViewDocType', () => {
            expect(ViewDocType.UserDoc).to.equal(10)
            expect(ViewDocType.ShareDoc).to.equal(11)
            expect(ViewDocType.GroupDoc).to.equal(20)
            expect(ViewDocType.ShareGroup).to.equal(21)
            expect(ViewDocType.CustomDoc).to.equal(30)
            expect(ViewDocType.ArchiveDoc).to.equal(40)
        });

        it('文档分类名称正确#ViewTypesName', () => {
            expect(ViewTypesName[ViewDocType.UserDoc]).to.equal(__('个人文档'))
            expect(ViewTypesName[ViewDocType.ShareDoc]).to.equal(__('共享文档'))
            expect(ViewTypesName[ViewDocType.GroupDoc]).to.equal(__('个人群组文档'))
            expect(ViewTypesName[ViewDocType.ShareGroup]).to.equal(__('共享群组文档'))
            expect(ViewTypesName[ViewDocType.CustomDoc]).to.equal(__('文档库'))
            expect(ViewTypesName[ViewDocType.ArchiveDoc]).to.equal(__('归档库'))
        });

        it('根据docid获取视图#getViewById');

        it('根据docType获取视图对象#getViewByType', async () => {
            const fakeTopViews = {
                viewsinfo: [
                    {
                        view_type: 1,
                        view_name: '个人文档',
                        view_doctype: 10,
                        doc_type: 'userdoc'
                    },
                    {
                        view_type: 1,
                        view_name: '个人文档',
                        view_doctype: 11,
                        doc_type: 'sharedoc'
                    }
                ]
            }

            // getTopViews内部调用getViews函数，stub getView函数并resolve构造数据
            entrydoc.getViews.resolves(fakeTopViews)

            expect(await getViewByType(DocType.userdoc)).to.deep.equal(fakeTopViews.viewsinfo[0])


        });

        it('获取入口文档顶级视图#getTopViews', async () => {
            const fakeTopViews = {
                viewsinfo: [
                    {
                        view_type: 1,
                        view_name: '个人文档',
                        view_doctype: 10,
                        doc_type: 'userdoc'
                    },
                    {
                        view_type: 1,
                        view_name: '个人文档',
                        view_doctype: 11,
                        doc_type: 'sharedoc'
                    }
                ]
            }
            entrydoc.getViews.resolves(fakeTopViews)
            expect(await getTopViews({ options: 'options' })).to.deep.equal(fakeTopViews.viewsinfo)
            expect(entrydoc.getViews.calledWith(null, { options: 'options' })).to.be.true
        });

        it('判断是否是视图对象#isTopView', () => {
            expect(isTopView({ doc_type: 'userdoc' })).to.be.true
            expect(isTopView({ doc_type: 'sharedoc' })).to.be.true
            expect(isTopView({})).to.be.false
            expect(isTopView()).to.be.false
        });

        it('根据doctype获取对应名称#getTypeNameByDocType', () => {
            expect(getTypeNameByDocType('userdoc')).to.equal(__('个人文档'))
            expect(getTypeNameByDocType('sharedoc')).to.equal(__('共享文档'))
            expect(getTypeNameByDocType('groupdoc')).to.equal(__('群组文档'))
            expect(getTypeNameByDocType('customdoc')).to.equal(__('文档库'))
            expect(getTypeNameByDocType('archivedoc')).to.equal(__('归档库'))

            expect(getTypeNameByDocType(DocType.userdoc)).to.equal(__('个人文档'))
            expect(getTypeNameByDocType(DocType.sharedoc)).to.equal(__('共享文档'))
            expect(getTypeNameByDocType(DocType.groupdoc)).to.equal(__('群组文档'))
            expect(getTypeNameByDocType(DocType.customdoc)).to.equal(__('文档库'))
            expect(getTypeNameByDocType(DocType.archivedoc)).to.equal(__('归档库'))
        });

        it('根据名称获取doctype#getDocTypeByName', () => {
            expect(getDocTypeByName(__('个人文档'))).to.equal(1)
            expect(getDocTypeByName(__('群组文档'))).to.equal(2)
            expect(getDocTypeByName(__('文档库'))).to.equal(3)
            expect(getDocTypeByName(__('共享文档'))).to.equal(4)
            expect(getDocTypeByName(__('归档库'))).to.equal(5)
        });


        it('根据docid获取doctype#getTypeById');

        it('获取视图名称#getViewName', () => {
            expect(getViewName({ doc_type: 'userdoc' })).to.equal(__('个人文档'))
            expect(getViewName({ doc_type: 'sharedoc' })).to.equal(__('共享文档'))
            expect(getViewName({ doc_type: 'groupdoc' })).to.equal(__('群组文档'))
            expect(getViewName({ doc_type: 'customdoc' })).to.equal(__('文档库'))
            expect(getViewName({ doc_type: 'archivedoc' })).to.equal(__('归档库'))
            expect(getViewName({})).to.equal('')
        });

        it('批量分解入口文档#resolveEntries', () => {
            const fakeEntryDocs = [
                {
                    docid: 'gns://gns1',
                    docname: 'path1',
                    doctype: 'groupdoc',
                    typename: '群组文档',
                    otherAttr: 'otherAttr',
                },
                {
                    docid: 'gns://gns2/gns3',
                    docname: 'path2\\path3',
                    doctype: 'groupdoc',
                    typename: '群组文档',
                    otherAttr: 'otherAttr',
                },
                {
                    docid: 'gns://gns4/gns5/gns6',
                    docname: 'path4\\path5\\path6',
                    doctype: 'groupdoc',
                    typename: '群组文档',
                    otherAttr: 'otherAttr',
                }
            ]
            expect(resolveEntries(fakeEntryDocs)).to.deep.equal([
                {
                    docid: 'gns://gns1',
                    docname: 'path1',
                    doctype: 'groupdoc',
                    typename: '群组文档',
                    otherAttr: 'otherAttr',
                },
                {
                    docid: 'gns://gns2',
                    docname: 'path2',
                    doctype: 'groupdoc',
                    typename: '群组文档',
                },
                {
                    docid: 'gns://gns2/gns3',
                    docname: 'path3',
                    doctype: 'groupdoc',
                    typename: '群组文档',
                    otherAttr: 'otherAttr',
                },
                {
                    docid: 'gns://gns4',
                    docname: 'path4',
                    doctype: 'groupdoc',
                    typename: '群组文档',
                },
                {
                    docid: 'gns://gns4/gns5',
                    docname: 'path5',
                    doctype: 'groupdoc',
                    typename: '群组文档',
                },
                {
                    docid: 'gns://gns4/gns5/gns6',
                    docname: 'path6',
                    doctype: 'groupdoc',
                    typename: '群组文档',
                    otherAttr: 'otherAttr',
                }

            ])
        });

        it('获取某一类型顶级入口文档#getTopEntriesByType')

        it('将单条gns路径分解成多条#splitGNS(与path gns中模块重复)')

        it('计算gns路径的层级#calcGNSLevel', () => {
            expect(calcGNSLevel('gns://gns1')).to.equal(1)
            expect(calcGNSLevel('gns://gns1/gns2')).to.equal(2)
            expect(calcGNSLevel('gns://gns1/gns2/gns3')).to.equal(3)
        });

        describe('获取所有入口文档#queryAll', () => {
            const fakeEntryDocs = [
                {
                    docid: 'gns://gns1',
                    docname: 'path1',
                    doctype: 'groupdoc',
                    typename: '群组文档',
                    otherAttr: 'otherAttr',
                },
                {
                    docid: 'gns://gns2/gns3',
                    docname: 'path2\\path3',
                    doctype: 'groupdoc',
                    typename: '群组文档',
                    otherAttr: 'otherAttr',
                },
                {
                    docid: 'gns://gns4/gns5/gns6',
                    docname: 'path4\\path5\\path6',
                    doctype: 'groupdoc',
                    typename: '群组文档',
                    otherAttr: 'otherAttr',
                }
            ]
            it('第一次调用，无缓存', async () => {
                entrydoc.get.resolves({ docinfos: [fakeEntryDocs[0]] })
                expect(await queryAll()).to.deep.equal([fakeEntryDocs[0]])
                expect(entrydoc.get.called).to.be.true
            })

            it('第二次调用，已有缓存，使用缓存', async () => {
                entrydoc.get.resolves({ docinfos: [fakeEntryDocs[1]] })
                expect(await queryAll()).to.deep.equal([fakeEntryDocs[0]])
                expect(entrydoc.get.called).to.be.false
            })

            it('第三次调用，已有缓存，不使用缓存', async () => {
                entrydoc.get.resolves({ docinfos: [fakeEntryDocs[2]] })
                expect(await queryAll({ update: true })).to.deep.equal([fakeEntryDocs[2]])
                expect(entrydoc.get.called).to.be.true
            })
        });


        it('获取解析后的入口文档#getResolvedAll')


        describe('获取指定类型的入口文档#queryByType', () => {

            it('传入doctype：发出包含正确doctype的请求', (done) => {
                useFakeXHR((requests, restore) => {
                    queryByType(DocType.sharedoc);

                    expect(requests[0].requestBody).equal(JSON.stringify({ doctype: 4 }));

                    restore();
                    done();
                });
            });

            it('响应正确：返回正确的文档数组', (done) => {
                useFakeXHR((requests, restore) => {

                    queryByType(DocType.sharedoc, { update: true }).then(entries => {
                        expect(entries).to.be.an('array').that.have.lengthOf(0);

                        restore();
                        done();
                    });

                    requests[0].respond(200, null, JSON.stringify({ docinfos: [] }));
                });
            });

            it('不强制请求时：已有缓存,不再发起请求,获取缓存的doc', (done) => {
                useFakeXHR((requests, restore) => {
                    queryByType(DocType.sharedoc, { update: true });
                    expect(requests).to.be.an('array').that.have.lengthOf(1);
                    queryByType(DocType.sharedoc);
                    expect(requests).to.be.an('array').that.have.lengthOf(1);

                    restore();
                    done();
                });
            });

        });

        // 依赖比较复杂
        it('比较指定类型的文档，返回三元数组 [新增，修改，删除] 的入口文档#getCompared')

        it('将入口文档分类#groupByType', () => {
            const sortResult = groupByType([
                {
                    doctype: 'userdoc'
                },
                {
                    doctype: 'sharedoc'
                },
                {
                    doctype: 'sharedoc'
                },
                {
                    doctype: 'customdoc'
                }
            ])
            expect(sortResult.userdoc).have.lengthOf(1)
            expect(sortResult.sharedoc).have.lengthOf(2)
            expect(sortResult.customdoc).have.lengthOf(1)
            expect(sortResult.groupdoc).have.lengthOf(0)
            expect(sortResult.archivedoc).have.lengthOf(0)
        });


        it('获取组织好的数据#getResolvedAll')


        it('获取组织好的数据并缓存#getResolvedAllDB')


        it('获取组织好的指定类型数据#getResolvedByType')


        it('获取组织好的指定类型数据并缓存#getResolvedByTypeDB')

        it('获取所有入口文档的docid#getIds(本地缓存，测试之间相互影响)');

        it('获取所有入口文档的docid#getIdsByType')

        it('判断一个目录是否是虚拟目录#isVirtual(依赖getIds)')

        it('判断一个文档是否是入口文档或虚拟目录#isInEntry')

    });
});
