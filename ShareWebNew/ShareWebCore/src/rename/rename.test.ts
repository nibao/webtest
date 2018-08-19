import { expect } from 'chai'
import * as sinon from 'sinon'
import * as file from '../apis/efshttp/file/file'
import * as dir from '../apis/efshttp/dir/dir'

import { EventType, OnDup } from './rename'

describe('ShareWebCore', () => {
    describe('rename', () => {
        it('导出事件类型#EventType', () => {
            expect(EventType.GET_NEW_NAME).to.equal(0)
            expect(EventType.SUCCESS).to.equal(1)
            expect(EventType.ONDUP).to.equal(2)
            expect(EventType.ERROR).to.equal(3)
            expect(EventType.CANCEL).to.equal(4)
        });

        it('导出同名处理方式#OnDup', () => {
            expect(OnDup.Skip).to.equal(-1)
            expect(OnDup.NoCheck).to.equal(0)
            expect(OnDup.Check).to.equal(1)
            expect(OnDup.Rename).to.equal(2)
            expect(OnDup.Cover).to.equal(3)
        });

        // TODO:重命名

    })
})