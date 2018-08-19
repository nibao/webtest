import { expect } from 'chai';
import { currify } from './currify';
import * as sinon from 'sinon';

describe('ShareWebUtil', () => {
    describe('currify', () => {
        describe('函数柯里化#currify', () => {

            it('函数柯里化调用正确', () => {
                const spy = sinon.spy();
                currify(spy, 1)(2);
                expect(spy.calledOnce).to.be.true;
                expect(spy.calledWith(1, 2)).to.be.true;
            });

            it('函数柯里化调用结果正确', () => {
                expect(currify((x, y) => x + y, 10)(1)).equal(11);
                expect(currify((x, y) => [x, y], [1])([2])).deep.equal([[1], [2]]);
            });

        });

        
    });
});