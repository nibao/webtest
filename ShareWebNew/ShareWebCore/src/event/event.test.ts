import { expect } from 'chai'
import * as sinon from 'sinon'
import * as event from './event'

describe('ShareWebCore', () => {
    describe('event', () => {
        describe('事件系统工厂函数#eventFactory', () => {
            enum TestEventType {
                TestType1,
                TestType2,
                TestType3
            }
            const testEvent = event.eventFactory(TestEventType)

            /* 当判断抛错时，不能直接调用，需要传递函数引用，否则错误无法被expect捕获
             * http://www.chaijs.com/api/bdd/#method_throw
             */
            it('注册事件类型不在已知类型中，正确抛错', () => {
                expect(() => testEvent.subscribe('unknowEventType', () => { })).to.throw('event unknowEventType does not exist')
            })

            it('handler不是函数时，正确抛错', () => {
                expect(() => testEvent.subscribe(TestEventType.TestType1, 'noFunc')).to.throw('handler must be function')
            })

            it('正确注册事件，并被正确触发（defaultHandler的逻辑问题，后续跟进）', () => {
                const handlerSpy = sinon.spy();
                const defaultHandlerSpy = sinon.spy()

                /* 未注册事件直接trigger,触发defaultHandler */
                testEvent.trigger(TestEventType.TestType1, defaultHandlerSpy, 'testArg', 1)
                expect(defaultHandlerSpy.calledOnce).to.be.true
                expect(defaultHandlerSpy.calledWith('testArg', 1)).to.be.true

                testEvent.subscribe(TestEventType.TestType1, handlerSpy)

                /* 不传递defaultHanlder和args */
                testEvent.trigger(TestEventType.TestType1)
                expect(handlerSpy.calledOnce).to.be.true
                expect(handlerSpy.getCall(0).calledWith()).to.be.true
                expect(defaultHandlerSpy.calledOnce).to.be.true

                /* 传递defaultHanlder和args，不执行defaultHanlder（这里有一些问题，待优化） */
                testEvent.trigger(TestEventType.TestType1, defaultHandlerSpy, 'testArg', 1)
                expect(handlerSpy.calledTwice).to.be.true
                expect(handlerSpy.getCall(1).calledWith('testArg', 1)).to.be.true
                expect(defaultHandlerSpy.calledOnce).to.be.true
            })

            it('正确处理取消订阅', () => {
                const handlerSpy = sinon.spy();
                const unsubscribe = testEvent.subscribe(TestEventType.TestType1, handlerSpy)
                /* 订阅后正常触发 */
                testEvent.trigger(TestEventType.TestType1)
                expect(handlerSpy.calledOnce).to.be.true

                /* 取消订阅 */
                unsubscribe()

                /* 取消订阅后不再触发 */
                testEvent.trigger(TestEventType.TestType1)
                expect(handlerSpy.calledOnce).to.be.true
            })


        })
    })
})