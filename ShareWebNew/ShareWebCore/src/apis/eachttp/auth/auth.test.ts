import { expect } from 'chai'
import { stub } from 'sinon'
import * as openapi from '../../../openapi/openapi';

import { servertime } from './auth'

describe('ShareWebCore', () => {
    describe('apis', () => {
        describe('eachttp', () => {
            describe('auth', () => {
                beforeEach('stub', () => {
                    stub(openapi, 'eachttp')
                })

                afterEach('restore', () => {
                    openapi.eachttp.restore()
                })

                describe('获取服务器时间#servertime', () => {
                    it('传入options', () => {
                        servertime({ readAs: 'json', userid: 'userid', tokenid: 'tokenid' })
                        expect(openapi.eachttp.args[0][0]).to.equal('auth') // 请求资源正确
                        expect(openapi.eachttp.args[0][1]).to.equal('servertime') // 请求方法正确
                        expect(openapi.eachttp.args[0][2]).to.deep.equal({}) // 请求体正确
                        expect(openapi.eachttp.args[0][3]).to.deep.equal({ readAs: 'json', userid: 'userid', tokenid: 'tokenid' }) // 请求设置
                    })

                    it('不传入options', () => {
                        servertime()
                        expect(openapi.eachttp.args[0][0]).to.equal('auth') // 请求资源正确
                        expect(openapi.eachttp.args[0][1]).to.equal('servertime') // 请求方法正确
                        expect(openapi.eachttp.args[0][2]).to.deep.equal({}) // 请求体正确
                        expect(openapi.eachttp.args[0][3]).to.be.undefined // 请求设置
                    })

                })

            })
        })
    })
})