import { expect } from 'chai';
import { timer } from './timer';
import * as sinon from 'sinon';

describe('ShareWebUtil', () => {
    describe('timer', () => {
        describe('#timer', () => {
            it('按设定间隔定时执行函数', (done) => {
                const clock = sinon.useFakeTimers();

                const spy = sinon.spy();
                const stop = timer(spy, 100);
                clock.tick(99)
                expect(spy.calledOnce).to.be.true;
                clock.tick(1)
                expect(spy.calledTwice).to.be.true;
                clock.tick(100)
                expect(spy.calledThrice).to.be.true;

                stop();
                clock.restore();
                done();

            })

            // it('按设定延迟执行Promise', (done) => {
            //     const spy = sinon.spy();
            //     const stop = timer(() => {
            //         return new Promise((resolve, reject) => {
            //             setTimeout(() => {
            //                 spy();
            //                 resolve(spy.callCount);
            //                 if (spy.callCount === 5) {
            //                     stop();
            //                     done();
            //                 }
            //             }, 100)
            //         })
            //     }, 100)

            // })

        })
    })
})