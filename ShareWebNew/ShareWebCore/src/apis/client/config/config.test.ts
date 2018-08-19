import { expect } from 'chai'
import { stub } from 'sinon'
import * as clientapi from '../../../clientapi/clientapi';

import { getLocalServerById, getLocalUserById, getVersionInfo, getLanguageInfo } from './config'

describe('ShareWebCore', () => {
    describe('apis', () => {
        describe('client', () => {
            describe('config', () => {
                beforeEach('stub', () => {
                    stub(clientapi, 'clientAPI')
                })

                afterEach('restore', () => {
                    clientapi.clientAPI.restore()
                })

                it('获取用户配置通过用户唯一标识#getLocalUserById', () => {
                    getLocalUserById({ userId: 'userId' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('config') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetLocalUserById') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ userId: 'userId' }) // 请求体正确
                })

                it('获取本地服务配置#getLocalServerById', () => {
                    getLocalServerById({ serverId: 'serverId' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('config') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetLocalServerById') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ serverId: 'serverId' }) // 请求体正确
                })

                it('获取版本信息#getVersionInfo', () => {
                    getVersionInfo()
                    expect(clientapi.clientAPI.args[0][0]).to.equal('config') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetVersionInfo') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.be.undefined // 请求体正确,无请求体
                })

                it('获取语言信息#getLanguageInfo', () => {
                    getLanguageInfo()
                    expect(clientapi.clientAPI.args[0][0]).to.equal('config') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetLanguageInfo') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.be.undefined // 请求体正确,无请求体
                })

            })
        })
    })
})