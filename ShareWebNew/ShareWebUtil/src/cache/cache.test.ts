import { expect } from 'chai';
import { cache } from './cache';

describe('ShareWebUtil', () => {
    describe('cache', () => {
        describe('缓存任意类型的值#cache', () => {
            it('传入值,缓存值', () => {
                const value = {};
                const getValue = cache(value);
                const getValueOnce = getValue();
                const getValueTwice = getValue();

                expect(getValueOnce).to.equal(value);
                expect(getValueOnce).to.equal(getValueTwice);
            });

            it('传入函数，缓存函数调用结果', () => {
                const value = {};
                const getValue = cache(() => (value));
                const getValueOnce = getValue();
                const getValueTwice = getValue();

                expect(getValueOnce).to.equal(value);
                expect(getValueOnce).to.equal(getValueTwice);
            });

            it('传入Promise,返回同一个promise', async () => {
                const value = {};
                const getValue = cache(() => Promise.resolve(value));

                const getValueOnce = getValue();
                const getValueTwice = getValue();

                expect(getValueOnce).to.equal(getValueTwice);

                const getValueOnceResult = await getValueOnce;
                const getValueTwiceResult = await getValueTwice;
                expect(getValueOnceResult).to.equal(value)
                expect(getValueOnceResult).to.equal(getValueTwiceResult)
            });

            it('调用cache()返回的函数并传递 { update: true }', () => {
                let count = 0;
                const getValue = cache(() => ++count);
                const getValueOnce = getValue();
                const getValueWithUpdate = getValue({ update: true })

                expect(getValueOnce).to.equal(1);
                expect(getValueWithUpdate).to.equal(2);

            });
        });
    })
})