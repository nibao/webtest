import * as sinon from 'sinon';
import { expect } from 'chai';
import {
    DATABASE,
    serializePath,
    splitGNS,
    updateCache,
    cacheDB,
    omitSubs
} from './gns';
import { generateGNS } from '../../libs/test-helper';

describe('ShareWebCore', () => {
    describe('gns', () => {
        // 模拟GNS
        const rootGNS = generateGNS();
        const childGNS = generateGNS();
        const grandChildGNS = generateGNS();
        const gns1 = `gns://${rootGNS}`;
        const gns2 = `gns://${rootGNS}/${childGNS}`;
        const gns3 = `gns://${rootGNS}/${childGNS}/${grandChildGNS}`;

        beforeEach('初始化DATABASE', () => {
            DATABASE = {};
        });
        it('导出文件缓存对象', () => {
            expect(DATABASE).to.deep.equal({});
        });

        it('序列化路径，移除首尾 / ，并分割成数组#serializePath', () => {
            expect(serializePath('')).to.deep.equal([]);

            expect(serializePath('/dir0/')).to.deep.equal(
                ['dir0'].map(item => decodeURIComponent(item))
            );

            expect(serializePath('/dir0/dir1/')).to.deep.equal(
                ['dir0', 'dir1'].map(item => decodeURIComponent(item))
            );

            expect(serializePath('/dir0/dir1/dir2')).to.deep.equal(
                ['dir0', 'dir1', 'dir2'].map(item => decodeURIComponent(item))
            );
        });

        it('将单条gns路径按层级拆分成多条#splitGNS', () => {
            expect(splitGNS('')).to.deep.equal([]);

            expect(splitGNS(`gns://${rootGNS}`)).to.deep.equal([
                `gns://${rootGNS}`
            ]);

            expect(splitGNS(`gns://${rootGNS}/${childGNS}`)).to.deep.equal([
                `gns://${rootGNS}`,
                `gns://${rootGNS}/${childGNS}`
            ]);

            expect(
                splitGNS(`gns://${rootGNS}/${childGNS}/${grandChildGNS}`)
            ).to.deep.equal([
                `gns://${rootGNS}`,
                `gns://${rootGNS}/${childGNS}`,
                `gns://${rootGNS}/${childGNS}/${grandChildGNS}`
            ]);
        });

        it('缓存结果#cacheDB', done => {
            const spy = sinon.spy(() =>
                Promise.resolve([{ docid: `gns://${rootGNS}` }])
            );
            cacheDB(spy)('arg1', 'arg2').then(value => {
                expect(value).to.deep.equal([
                    {
                        docid: `gns://${rootGNS}`
                    }
                ]);
                expect(spy.calledWith('arg1', 'arg2')).to.be.true;
                expect(DATABASE).to.deep.equal({
                    [`gns://${rootGNS}`]: { docid: `gns://${rootGNS}` }
                });
                done();
            });
        });

        it('更新缓存#updateCache', () => {
            expect(
                updateCache([{ docid: gns1 }, { docid: gns2 }])
            ).to.deep.equal({
                [gns1]: { docid: gns1 },
                [gns2]: { docid: gns2 }
            });

            expect(updateCache([{ docid: gns3 }])).to.deep.equal({
                [gns1]: { docid: gns1 },
                [gns2]: { docid: gns2 },
                [gns3]: { docid: gns3 }
            });
        });

        it('移除docid下的子目录#omitSubs', () => {
            /* 传入docid不是入口文件，移除其子目录 */
            DATABASE = {
                [gns1]: { docid: gns1 },
                [gns2]: { docid: gns2 },
                [gns3]: { docid: gns3 }
            };
            expect(omitSubs({ docid: gns2 })).to.deep.equal({
                [gns1]: { docid: gns1 },
                [gns2]: { docid: gns2 }
            });
            /* 传入docid为入口文件，不做移除操作 */
            DATABASE = {
                [gns1]: { docid: gns1 },
                [gns2]: { docid: gns2 },
                [gns3]: { docid: gns3, doctype: 'userdoc' }
            };
            expect(omitSubs({ docid: gns2 })).to.deep.equal({
                [gns1]: { docid: gns1 },
                [gns2]: { docid: gns2 },
                [gns3]: { docid: gns3, doctype: 'userdoc' }
            });
        });
    });
});
