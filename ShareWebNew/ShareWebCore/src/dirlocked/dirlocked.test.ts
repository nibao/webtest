import { expect } from 'chai';
import * as dirlocked from './dirlocked'

describe('ShareWebCore', () => {
    describe('dirlocked', () => {
        describe('导出子文件被锁定的文件夹的策略#DirLockedStrategy', () => {
            it('导出枚举DirLockedStrategy', () => {
                expect(dirlocked.DirLockedStrategy.None).to.equal(0)
                expect(dirlocked.DirLockedStrategy.Cancel).to.equal(1)
                expect(dirlocked.DirLockedStrategy.Continue).to.equal(2)
            });
        });
    })
})