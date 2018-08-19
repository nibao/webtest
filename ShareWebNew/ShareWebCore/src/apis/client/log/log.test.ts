import { expect } from 'chai'
import { stub } from 'sinon'
import * as clientapi from '../../../clientapi/clientapi';

import { getSyncLogByIdAndType, hideAllSyncLogByType, hideSyncLogById } from './log'

describe('ShareWebCore', () => {
    describe('apis', () => {
        describe('client', () => {
            describe('log', () => {
                beforeEach('stub', () => {
                    stub(clientapi, 'clientAPI')
                })

                afterEach('restore', () => {
                    clientapi.clientAPI.restore()
                })

                it('获取同步日志通过日志唯一标示和日志类型#getSyncLogByIdAndType', () => {
                    getSyncLogByIdAndType({ logType: 'logType', logId: 'logId' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('cache') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetSyncLogByIdAndType') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ logType: 'logType', logId: 'logId' }) // 请求体正确
                })

                it('隐藏所有日志通过日志类型#hideAllSyncLogByType', () => {
                    hideAllSyncLogByType({ logType: 'logType' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('cache') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('HideAllSyncLogByType') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ logType: 'logType' }) // 请求体正确
                })

                it('隐藏同步日志通过日志#hideSyncLogById', () => {
                    hideSyncLogById({ logId: 'logId' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('cache') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('HideSyncLogById') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ logId: 'logId' }) // 请求体正确
                })

            })
        })
    })
})