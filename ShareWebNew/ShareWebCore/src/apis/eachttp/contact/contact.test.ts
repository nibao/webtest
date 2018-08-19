import { expect } from 'chai';
import { stub } from 'sinon'
import * as openapi from '../../../openapi/openapi';
import {
    getGroups,
    get,
    search,
    addGroup,
    editGroup,
    deleteGroup,
    addPersons,
    deletePersons,
    getPersons,
    searchPersons
} from './contact';

describe('ShareWebCore', () => {

    describe('apis', () => {
        describe('eachttp', () => {

            beforeEach('stub', () => {
                stub(openapi, 'eachttp')
            })

            afterEach('restore', () => {
                openapi.eachttp.restore()
            })


            describe('联系人管理#contact', () => {
                it('获取所有联系人分组#getGroup', () => {
                    getGroups({}, { userid: 'userid', readAs: 'readAs' })
                    expect(openapi.eachttp.calledWith('contactor', 'getgroups', {}, { userid: 'userid', readAs: 'readAs' })).to.be.true
                })

                it('获取分组下所有联系人#get', () => {
                    get({ groupid: 'groupid' }, { userid: 'userid', readAs: 'readAs' })
                    expect(openapi.eachttp.calledWith('contactor', 'get', { groupid: 'groupid' }, { userid: 'userid', readAs: 'readAs' })).to.be.true
                })

                it('在联系人组搜索用户和联系人组信息#search', () => {
                    search({ key: 'key' }, { userid: 'userid', readAs: 'readAs' })
                    expect(openapi.eachttp.calledWith('contactor', 'search', { key: 'key' }, { userid: 'userid', readAs: 'readAs' })).to.be.true
                })

                it('新建联系人分组#addGroup', () => {
                    addGroup({ groupname: 'groupname' }, { userid: 'userid', readAs: 'readAs' })
                    expect(openapi.eachttp.calledWith('contactor', 'addgroup', { groupname: 'groupname' }, { userid: 'userid', readAs: 'readAs' })).to.be.true
                })

                it('编辑联系人分组#editGroup', () => {
                    editGroup({ groupid: 'groupid', newname: 'newname' }, { userid: 'userid', readAs: 'readAs' })
                    expect(openapi.eachttp.calledWith('contactor', 'editgroup', { groupid: 'groupid', newname: 'newname' }, { userid: 'userid', readAs: 'readAs' })).to.be.true
                })

                it('删除联系人分组#deleteGroup', () => {
                    deleteGroup({ groupid: 'groupid' }, { userid: 'userid', readAs: 'readAs' })
                    expect(openapi.eachttp.calledWith('contactor', 'deletegroup', { groupid: 'groupid' }, { userid: 'userid', readAs: 'readAs' })).to.be.true
                })

                it('添加联系人到指定分组#addPersons', () => {
                    addPersons({ groupid: 'groupid', userids: ['userid1', 'userid2'] }, { userid: 'userid', readAs: 'readAs' })
                })

                it('删除指定联系人#deletePersons', () => {
                    deletePersons({ groupid: 'groupid', userids: ['userid1', 'userid2'] }, { userid: 'userid', readAs: 'readAs' })
                    expect(openapi.eachttp.calledWith('contactor', 'deletepersons', { groupid: 'groupid', userids: ['userid1', 'userid2'] }, { userid: 'userid', readAs: 'readAs' })).to.be.true
                })

                it('获取分组下所有联系人#getPersons', () => {
                    getPersons({ groupid: 'groupid', start: 0, limit: 10 }, { userid: 'userid', readAs: 'readAs' })
                    expect(openapi.eachttp.calledWith('contactor', 'getpersons', { groupid: 'groupid', start: 0, limit: 10 }, { userid: 'userid', readAs: 'readAs' })).to.be.true
                })

                it('搜索联系人#searchPersons', () => {
                    searchPersons({ key: 'key' }, { userid: 'userid', readAs: 'readAs' })
                    expect(openapi.eachttp.calledWith('contactor', 'searchpersons', { key: 'key' }, { userid: 'userid', readAs: 'readAs' })).to.be.true
                })


            });
        })
    })
})