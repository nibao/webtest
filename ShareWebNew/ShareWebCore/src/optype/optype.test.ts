import { expect } from 'chai'
import { OpType } from './optype'

describe('ShareWebCore', () => {
    describe('optype', () => {
        it('正确导出操作类型', () => {
            expect(OpType.ALL).to.equal(0)
            expect(OpType.DOWNLOAD).to.equal(1)
            expect(OpType.UPLOAD).to.equal(2)
            expect(OpType.COLLECT).to.equal(3)
        });
    })
})