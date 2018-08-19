import { expect } from 'chai';
import * as sinon from 'sinon';
import * as message from '../apis/eachttp/message/message';

import {
    MessageType,
    Type,
    AntiVirusOperation,
    MsgStatus,
    subscribe,
    fetchMessages,
    getMessages,
    setRead
} from './message';

describe('ShareWebCore', () => {
    describe('message', () => {
        const fakeMessage = [
            {
                type: 3,
                isread: false
            },
            {
                type: 4,
                isread: true
            },
            {
                type: 5,
                isread: false
            },
            {
                type: 20,
                isread: true
            },
            {
                type: 18,
                isread: true
            },
            {
                type: 21,
                isread: false
            }
        ];
        const reverseFakeMessage = [...fakeMessage].reverse();
        before('stub', () => {
            sinon.stub(message, 'get');
            sinon.stub(message, 'read2');
        });
        after('restore', () => {
            message.get.restore();
            message.read2.restore();
        });
        it('导出消息类型#Type', () => {
            expect(Type.OpenShare).to.equal(1);
            expect(Type.AntivirusMessage).to.equal(23);
        });

        it('导出杀毒消息操作类型#AntiVirusOperation', () => {
            expect(AntiVirusOperation.Isolated).to.equal(1);
            expect(AntiVirusOperation.Repaired).to.equal(2);
        });

        it('导出消息分类#MessageType', () => {
            expect(MessageType.All).to.equal(0);
            expect(MessageType.Share).to.equal(1);
            expect(MessageType.Check).to.equal(2);
            expect(MessageType.Security).to.equal(3);
        });

        it('导出消息筛选类型#MsgStatus', () => {
            expect(MsgStatus.All).to.equal(1);
            expect(MsgStatus.Unread).to.equal(2);
            expect(MsgStatus.Read).to.equal(3);
        });

        it('请求所有消息#fetchMessages', () => {
            const spy = sinon.spy();
            subscribe(spy);
            message.get.resolves({ msgs: fakeMessage });
            return fetchMessages().then(() => {
                expect(spy.calledWith(reverseFakeMessage)).to.be.true;
            });
        });

        describe('根据传入的消息类型和状态返回消息列表，默认返回所有消息#getMessages', () => {
            it('默认返回所有消息', () => {
                expect(getMessages()).to.deep.equal(reverseFakeMessage);
            });

            it('返回所有共享消息', () => {
                expect(getMessages(MessageType.Share)).to.deep.equal([
                    reverseFakeMessage[4],
                    reverseFakeMessage[5]
                ]);
            });

            it('返回已读共享消息', () => {
                expect(getMessages(MessageType.Share, true)).to.deep.equal([
                    reverseFakeMessage[4]
                ]);
            });

            it('返回未读共享消息', () => {
                expect(getMessages(MessageType.Share, false)).to.deep.equal([
                    reverseFakeMessage[5]
                ]);
            });

            it('返回所有审核消息', () => {
                expect(getMessages(MessageType.Check)).to.deep.equal([
                    reverseFakeMessage[2],
                    reverseFakeMessage[3]
                ]);
            });

            it('返回已读审核消息', () => {
                expect(getMessages(MessageType.Check, true)).to.deep.equal([
                    reverseFakeMessage[2]
                ]);
            });

            it('返回未读审核消息', () => {
                expect(getMessages(MessageType.Check, false)).to.deep.equal([
                    reverseFakeMessage[3]
                ]);
            });

            it('返回所有安全消息', () => {
                expect(getMessages(MessageType.Security)).to.deep.equal([
                    reverseFakeMessage[0],
                    reverseFakeMessage[1]
                ]);
            });

            it('返回已读安全消息', () => {
                expect(getMessages(MessageType.Security, true)).to.deep.equal([
                    reverseFakeMessage[1]
                ]);
            });

            it('返回未读安全消息', () => {
                expect(getMessages(MessageType.Security, false)).to.deep.equal([
                    reverseFakeMessage[0]
                ]);
            });

            it('获取所有未读消息', () => {
                expect(getMessages(MessageType.All, false)).to.deep.equal([
                    reverseFakeMessage[0],
                    reverseFakeMessage[3],
                    reverseFakeMessage[5]
                ]);
            });

            it('获取所有已读消息', () => {
                expect(getMessages(MessageType.All, true)).to.deep.equal([
                    reverseFakeMessage[1],
                    reverseFakeMessage[2],
                    reverseFakeMessage[4]
                ]);
            });

            it('传递不存在的消息类型，默认返回所有消息', () => {
                expect(getMessages(4)).to.deep.equal(reverseFakeMessage);
                expect(getMessages(4, true)).to.deep.equal([
                    reverseFakeMessage[1],
                    reverseFakeMessage[2],
                    reverseFakeMessage[4]
                ]);
            });
        });

        it('取消订阅', () => {
            const spy = sinon.spy();
            subscribe(spy)();
            message.get.resolves({ msgs: fakeMessage });
            return fetchMessages().then(() => {
                expect(spy.called).to.be.false;
            });
        });

        describe('设置已读#setRead', () => {
            it('单条消息', () => {
                const spy = sinon.spy();
                subscribe(spy);
                message.read2.resolves();
                return setRead(reverseFakeMessage[0]).then(() => {
                    expect(spy.args[0][0][0].isread).to.be.true;
                });
            });

            it('多条消息', () => {
                const spy = sinon.spy();
                subscribe(spy);
                message.read2.resolves();
                return setRead([
                    reverseFakeMessage[0],
                    reverseFakeMessage[3]
                ]).then(() => {
                    expect(spy.args[0][0][0].isread).to.be.true; // arg[0][0] 第1次调用的参数，arg[0][0][0]第一次调用时Messages[0]
                    expect(spy.args[0][0][3].isread).to.be.true;
                });
            });
        });
    });
});
