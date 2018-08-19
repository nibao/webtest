import { expect } from 'chai'
import { stub } from 'sinon'
import * as clientapi from '../../../clientapi/clientapi';

import { requestDownloadFile, requestDownloadDir, requestLocalCleanDir, requestLocalCleanFile, hasSyncTask, getSyncTaskNum, getSyncDetailByInterval, pauseTaskById, cancelTaskById, resumeTaskById, pauseAllTask, cancelAllTask, resumeAllTask, requestTransferUnsync, requestUploadUnsync } from './sync'

describe('ShareWebCore', () => {
    describe('apis', () => {
        describe('client', () => {
            describe('sync', () => {
                beforeEach('stub', () => {
                    stub(clientapi, 'clientAPI')
                })

                afterEach('restore', () => {
                    clientapi.clientAPI.restore()
                })

                it('请求下载本地缓存文件#requestDownloadFile', () => {
                    requestDownloadFile({ relPath: 'relPath' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('RequestDownloadFile') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ relPath: 'relPath' }) // 请求体正确
                })

                it('请求下载本地缓存目录#requestDownloadDir', () => {
                    requestDownloadDir({ relPath: 'relPath' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('RequestDownloadDir') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ relPath: 'relPath' }) // 请求体正确
                })

                it('请求清除本地缓存目录#requestLocalCleanDir', () => {
                    requestLocalCleanDir({ relPath: 'relPath' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('RequestLocalCleanDir') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ relPath: 'relPath' }) // 请求体正确
                })

                it('请求清除本地缓存目录#requestLocalCleanFile', () => {
                    requestLocalCleanFile({ relPath: 'relPath' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('RequestLocalCleanFile') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ relPath: 'relPath' }) // 请求体正确
                })

                it('是否有同步任务#hasSyncTask', () => {
                    hasSyncTask()
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('HasSyncTask') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({}) // 请求体正确
                })

                it('获取正在同步任务数#getSyncTaskNum', () => {
                    getSyncTaskNum()
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetSyncTaskNum') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({}) // 请求体正确
                })

                it('获取同步详情#getSyncDetailByInterval', () => {
                    getSyncDetailByInterval({ begin: 'begin', end: 'end' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('GetSyncDetailByInterval') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ begin: 'begin', end: 'end' }) // 请求体正确
                })

                it('暂停某个同步任务通过任务id#pauseTaskById', () => {
                    pauseTaskById({ taskId: 'taskId' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('PauseTaskById') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ taskId: 'taskId' }) // 请求体正确
                })

                it('取消某个同步任务通过任务id#cancelTaskById', () => {
                    cancelTaskById({ taskId: 'taskId' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('CancelTaskById') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ taskId: 'taskId' }) // 请求体正确
                })

                it('恢复某个同步任务通过任务id#resumeTaskById', () => {
                    resumeTaskById({ taskId: 'taskId' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('ResumeTaskById') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ taskId: 'taskId' }) // 请求体正确
                })

                it('暂停所有同步任务#pauseAllTask', () => {
                    pauseAllTask()
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('PauseAllTask') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({}) // 请求体正确
                })

                it('取消所有同步任务#cancelAllTask', () => {
                    cancelAllTask()
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('CancelAllTask') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({}) // 请求体正确
                })

                it('恢复所有同步任务#resumeAllTask', () => {
                    resumeAllTask()
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('ResumeAllTask') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({}) // 请求体正确
                })

                it('请求转移未同步文件#requestTransferUnsync', () => {
                    requestTransferUnsync({ absPaths: 'absPaths', dirPath: 'dirPath' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('RequestTransferUnsync') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ absPaths: 'absPaths', dirPath: 'dirPath' }) // 请求体正确
                })

                it('请求上传未同步文件#requestUploadUnsync', () => {
                    requestUploadUnsync({ absPaths: 'absPaths' })
                    expect(clientapi.clientAPI.args[0][0]).to.equal('sync') // 请求资源正确
                    expect(clientapi.clientAPI.args[0][1]).to.equal('RequestUploadUnsync') // 请求方法正确
                    expect(clientapi.clientAPI.args[0][2]).to.deep.equal({ absPaths: 'absPaths' }) // 请求体正确
                })

            })
        })
    })
})