import { expect } from 'chai';
import { range } from 'lodash';
import {
    generateNumber,
    generateLetter,
    generateGNS
} from '../../libs/test-helper';
import {
    EventType,
    GNS_LENGTH,
    isEntryDoc,
    isDescentdantOf,
    isChildOf
} from './filesystem';

describe('ShareWebCore', () => {
    describe('filesystem', () => {
        // 模拟GNS
        const rootGNS = generateGNS();
        const childGNS = generateGNS();
        const grandChildGNS = generateGNS();

        it('导出事件对象#EventType', () => {
            expect(EventType.FS_INSERT).to.equal(0);
            expect(EventType.FS_DELETE).to.equal(1);
            expect(EventType.FS_UPDATE).to.equal(2);
        });

        it('正确导出事件订阅和事件触发器#{ subscribe, trigger }');

        it('导出一级gns长度（32）#GNS_LENGTH', () => {
            expect(GNS_LENGTH).to.equal(32);
        });

        it('清空缓存#clearCache');

        it('列举目录#list');

        it('判断虚拟目录#isVirtual');

        it('是否是入口文档#isEntryDoc', () => {
            /* 不能使用new Array(32).map()
            * .map会跳过空的数组元素
            * [,,,].map(()=>1) 不会返回[1,1,1]
            */

            // 纯数字，合法长度gns
            expect(
                isEntryDoc({
                    docid: `gns://${range(32)
                        .map(generateNumber)
                        .join('')}`
                })
            ).to.be.true;
            // 纯数字，不合法长度gns
            expect(
                isEntryDoc({
                    docid: `gns://${range(33)
                        .map(generateNumber)
                        .join('')}`
                })
            ).to.be.false;

            // 纯字母，合法长度gns
            expect(
                isEntryDoc({
                    docid: `gns://${range(32)
                        .map(generateLetter)
                        .join('')}`
                })
            ).to.be.true;

            // 纯字母，不合法长度gns
            expect(
                isEntryDoc({
                    docid: `gns://${range(33)
                        .map(generateLetter)
                        .join('')}`
                })
            ).to.be.false;

            // 数字字母混合，合法长度gns
            expect(
                isEntryDoc({
                    docid: `gns://${range(16)
                        .map(generateLetter)
                        .join('') +
                        range(16)
                            .map(generateLetter)
                            .join('')}`
                })
            ).to.be.true;
        });

        it('判断 target 是否为 parent 的子目录#isChildOf', () => {
            expect(isChildOf(null, { docid: `gns://${generateGNS()}` })).to.be
                .true;

            expect(
                isChildOf(null, {
                    docid: `gns://${generateGNS()}/${generateGNS()}`
                })
            ).to.be.false;

            expect(
                isChildOf(
                    { docid: `gns://${rootGNS}` },
                    {
                        docid: `gns://${rootGNS}/${childGNS}`
                    }
                )
            ).to.be.true;

            expect(
                isChildOf(
                    { docid: `gns://${childGNS}` },
                    {
                        docid: `gns://${rootGNS}/${childGNS}`
                    }
                )
            ).to.be.false;

            expect(
                isChildOf(
                    { docid: `gns://${rootGNS}` },
                    {
                        docid: `gns://${rootGNS}/${childGNS}/${grandChildGNS}`
                    }
                )
            ).to.be.false;
        });

        it('判断 target 是否为 parent 或 parent 的子目录中#isDescentdantOf', () => {
            expect(isDescentdantOf(null, { docid: `gns://${rootGNS}` })).to.be
                .true;

            expect(
                isDescentdantOf(
                    { docid: `gns://${rootGNS}` },
                    { docid: `gns://${rootGNS}/${childGNS}` }
                )
            ).to.be.true;

            expect(
                isDescentdantOf(
                    { docid: `gns://${rootGNS}` },
                    { docid: `gns://${rootGNS}/${childGNS}/${grandChildGNS}` }
                )
            ).to.be.true;

            expect(
                isDescentdantOf(
                    { docid: `gns://${rootGNS}/${childGNS}` },
                    { docid: `gns://${rootGNS}/${childGNS}/${grandChildGNS}` }
                )
            ).to.be.true;

            expect(
                isDescentdantOf(
                    { docid: `gns://${rootGNS}/${childGNS}` },
                    {
                        docid: `gns://${generateGNS()}/${rootGNS}/${childGNS}/${grandChildGNS}`
                    }
                )
            ).to.be.false;

            expect(
                isDescentdantOf(
                    { docid: `gns://${rootGNS}/${childGNS}` },
                    {
                        docid: `gns://${rootGNS}/${generateGNS()}/${childGNS}/${grandChildGNS}`
                    }
                )
            ).to.be.false;
        });

        it('根据文件获取doc路径#getDocsChainByDocId');

        it('根据docid获取文档#getDocByDocId');

        it('根据doc获取文件链#getDocsChain');

        it('把文件转换为路径#convertPath');

        it('根据文件路径获取文件链#getDocsChainByNamePath');

        it('根据路径获取doc#getDocByNamePath');

        it('插入新doc#insert');

        it('从缓存中删除文档#del');

        it('更新缓存文件信息#update');

        it('获取文件对应的入口文档#getViewDoc');

        it('获取文件的 view_type#getViewType');

        it('获取文件的 view_doctype#getViewDocType');
    });
});
