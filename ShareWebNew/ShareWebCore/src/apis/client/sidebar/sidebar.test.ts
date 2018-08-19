import { expect } from 'chai'
import { stub } from 'sinon'
import * as clientapi from '../../../clientapi/clientapi';

import { getSelectItemsById } from './sidebar'

describe('ShareWebCore', () => {
    describe('apis', () => {
        describe('client', () => {
            describe('sidebar', () => {
                beforeEach('stub', () => {
                    stub(clientapi, 'clientAPI')
                })

                afterEach('restore', () => {
                    clientapi.clientAPI.restore()
                })

                it('获取侧边栏选中项#getSelectItemsById', () => {
                    getSelectItemsById({ id: 'id' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sidebar') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetSelectItemsById') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ id: 'id' }) // 请求体正确
                })
            })
        })
    })
})