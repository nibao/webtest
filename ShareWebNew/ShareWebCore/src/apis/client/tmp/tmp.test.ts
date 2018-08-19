import { expect } from 'chai'
import { stub } from 'sinon'
import * as clientapi from '../../../clientapi/clientapi';

import { getTokenId, defaultExecute, openUrlByChrome } from './tmp'

describe('ShareWebCore', () => {
    describe('apis', () => {
        describe('client', () => {
            describe('tmp', () => {
                beforeEach('stub', () => {
                    stub(clientapi, 'clientAPI')
                })

                afterEach('restore', () => {
                    clientapi.clientAPI.restore()
                })

                it('获取tokenid#getTokenId', () => {
                    getTokenId()
                    expect(clientapi.clientAPI.args[0][0]).to.equal('tmp') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetTokenId') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.be.undefined // 请求体正确
                })

                it('运行一个外部程序#defaultExecute', () => {
                    defaultExecute({ url: 'url' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('tmp') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('DefaultExecute') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ url: 'url' }) // 请求体正确
                })

                it('使用谷歌浏览器打开指定url#openUrlByChrome', () => {
                    openUrlByChrome({ url: 'url' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('tmp') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('OpenUrlByChrome') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ url: 'url' }) // 请求体正确
                })

            })
        })
    })
})