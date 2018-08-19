import { expect } from 'chai'
import { stub } from 'sinon'
import * as clientapi from '../../../clientapi/clientapi';

import { getInfoByPath, getUnsyncLog, getUnsyncLogNum } from './cache'

describe('ShareWebCore', () => {
    describe('apis', () => {
        describe('client', () => {
            describe('cache', () => {
                beforeEach('stub', () => {
                    stub(clientapi, 'clientAPI')
                })
                afterEach('restore', () => {
                    clientapi.clientAPI.restore()
                })

                it('通过相对路径获取缓存信息#getInfoByPath', () => {
                    getInfoByPath({ relPath: 'relPath' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('cache') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetInfoByPath') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ relPath: 'relPath' }) // 请求体正确
                })

                it('通过绝对路径获取未同步任务#getUnsyncLog', () => {
                    getUnsyncLog({ absPath: 'absPath', countLimit: 10 })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('cache') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetUnsyncLog') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ absPath: 'absPath', countLimit: 10 }) // 请求体正确
                })

                it('获取某个路径下的未同步文档个数#getUnsyncLog', () => {
                    getUnsyncLogNum({ absPath: 'absPath' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('cache') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetUnsyncLogNum') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ absPath: 'absPath' }) // 请求体正确
                })

            })
        })
    })
})