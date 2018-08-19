import { expect } from 'chai'
import { stub } from 'sinon'
import * as user from '../apis/eachttp/user/user';
import { get, getFullInfo, isUserId } from './user'

describe('ShareWebCore', () => {
    describe('user', () => {
        beforeEach('stub', () => {
            stub(user, 'get')
        })

        afterEach('restore', () => {
            user.get.restore()
        })

        it('获取用户信息#get', () => {
            get({ userid: 'userid', tokenid: 'tokenid' })
            expect(user.get.calledWith({}, { userid: 'userid', tokenid: 'tokenid' })).to.be.true
        })

        describe('获取用户信息，并合并userid和tokenid#getFullInfo', () => {
            it('获取信息与原信息一致', async () => {
                user.get.resolves({ userid: 'userid', tokenid: 'tokenid' })
                expect(await getFullInfo('userid', 'tokenid')).to.deep.equal({ userid: 'userid', tokenid: 'tokenid' })
            })

            it('获取信息与原信息不一致', async () => {
                user.get.resolves({ userid: 'userid1', tokenid: 'tokenid1' })
                expect(await getFullInfo('userid', 'tokenid')).to.deep.equal({ userid: 'userid1', tokenid: 'tokenid1' })
            })
        })

        it('判断value是否是userid#isUserId', () => {
            expect(isUserId('0abcdefa-1abc-1abc-1abc-123456abcdef')).to.be.true
            expect(isUserId('0abcdefg-1abc-1abc-1abc-123456abcdef')).to.be.false
            expect(isUserId('0abcdefab-1abc-1abc-1abc-123456abcdef')).to.be.false
            expect(isUserId('0abcdefab-1abcd-1abc-1abc-123456abcdef')).to.be.false
            expect(isUserId('0abcdefab-1ab-d-1abc-1abc-123456abcdef')).to.be.false
            
        })

    })
})