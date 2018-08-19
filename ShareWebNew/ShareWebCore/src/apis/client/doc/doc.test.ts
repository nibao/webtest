import { expect } from 'chai'
import { stub } from 'sinon'
import * as clientapi from '../../../clientapi/clientapi';

import { checkLocalSync, getUnsyncDoc, isNewView } from './doc'

describe('ShareWebCore', () => {
    describe('apis', () => {
        describe('client', () => {
            describe('doc', () => {
                beforeEach('stub', () => {
                    stub(clientapi, 'clientAPI')
                })

                afterEach('restore', () => {
                    clientapi.clientAPI.restore()
                })

                it('检查本地同步目录#checkLocalSync', () => {
                    checkLocalSync({ localPath: 'localPath', syncPath: 'syncPath' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('doc') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('CheckLocalSync') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ localPath: 'localPath', syncPath: 'syncPath' }) // 请求体正确
                })

                it('检查未同步文档#getUnsyncDoc', () => {
                    getUnsyncDoc({ absPath: 'absPath' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('doc') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetUnsyncDoc') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ absPath: 'absPath' }) // 请求体正确
                })

                it('是否是新视图模式#isNewView', () => {
                    isNewView()
                    expect(clientapi.clientAPI.args[0][0]).to.equal('doc') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('IsNewView') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({}) // 请求体正确
                })
            })
        })
    })
})