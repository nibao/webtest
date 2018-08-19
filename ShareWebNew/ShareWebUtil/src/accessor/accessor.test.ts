import { expect } from 'chai';
import * as sinon from 'sinon';
import { access, evaluate, shallowEqual, isExist, isEmpty, promisify, chain, bitSum, bitSub, bitTest, isNil, setCopy } from './accessor';

describe('ShareWebUtil', () => {
    describe('accessor', () => {
        describe('对象访问#access', () => {
            it('获取对象属性：返回属性值', () => {
                const o = { foo: true };

                expect(access(o, 'foo')).to.equal(true);
                expect(access(o, 'bar')).to.be.undefined;
            });

            it('传递key, value 设置对象属性：跟新对象对应属性', () => {
                const o = { foo: true }

                access(o, 'foo', false);
                expect(o.foo).to.equal(false);

                access(o, 'bar', true);
                expect(o.foo).to.equal(false);
                expect(o.bar).to.equal(true);
            });

            it('传递对象设置对象属性：更新对象对应属性', () => {
                const o = { foo: true }

                access(o, { foo: false });
                expect(o.foo).to.equal(false);

                access(o, { bar: true });
                expect(o.bar).to.equal(true);

                access(o, { foo: true, bar: false });
                expect(o.foo).to.equal(true);
                expect(o.bar).to.equal(false);
            });

            it('返回设置的对象的引用', () => {
                const o = { foo: true }
                expect(access(o, 'foo', false)).to.equal(o);
                expect(access(o, { foo: false })).to.equal(o);
            });
        });


        describe('计算表达式#evaluate', () => {
            it('传递普通值:返回普通值', () => {
                expect(evaluate(1)).to.equal(1);
            });

            it('传递对象：返回对象引用', () => {
                const o = {}
                expect(evaluate(o)).to.equal(o);
            });

            it('传递函数：返回函数执行结果', () => {
                expect(evaluate(() => true)).to.equal(true)
            });
        });



        describe('浅比较#shallowEqual', () => {
            it('简单数据类型比较', () => {
                expect(shallowEqual(1, 1)).to.equal(true);
                expect(shallowEqual('1', '1')).to.equal(true);
                expect(shallowEqual(1, '1')).to.equal(false);
                expect(shallowEqual(1, true)).to.equal(false);
                expect(shallowEqual(0, false)).to.equal(false);
            });

            it('对象比较', () => {
                expect(shallowEqual({}, {})).to.equal(true);
                expect(shallowEqual({ x: 1 }, {})).to.equal(false);
                expect(shallowEqual({ x: 1 }, { x: 1 })).to.equal(true);
            });

            it('数组比较', () => {
                let obj = {};
                expect(shallowEqual([], [])).to.equal(true);
                expect(shallowEqual([1], [])).to.equal(false);
                expect(shallowEqual([1, 2], [2, 1])).to.equal(false);
                expect(shallowEqual([obj], [obj])).to.equal(true);
                expect(shallowEqual([{}], [{}])).to.equal(false);
            });

        });


        describe('判断值不存在（为null或undefined）#isExist', () => {
            it('传入null：返回false', () => {
                expect(isExist(null)).to.be.false
            });

            it('传入undefined：返回false', () => {
                expect(isExist(undefined)).to.be.false
            });

            it('传入其他falsy值：返回true', () => {
                expect(isExist(false)).to.be.true
                expect(isExist(0)).to.be.true
                expect(isExist([])).to.be.true
                expect(isExist({})).to.be.true
            });

            it('传入truthy值：返回true', () => {
                expect(isExist('a')).to.be.true
                expect(isExist(1)).to.be.true
                expect(isExist(true)).to.be.true
                expect(isExist([0])).to.be.true
                expect(isExist({ a: 1 })).to.be.true
            });

        });


        describe('判断值为不存在／空数组／空对象#isEmpty', () => {
            it('值为null/undefined：返回true', () => {
                expect(isEmpty(null)).to.be.true
                expect(isEmpty(undefined)).to.be.true
            })

            it('值为空数组：返回true', () => {
                expect(isEmpty([])).to.be.true
            })

            it('值为非空数组：返回false', () => {
                expect(isEmpty([1])).to.be.false
            })

            it('值为空对象：返回true', () => {
                expect(isEmpty({})).to.be.true
            })

            it('值为非空对象：返回false', () => {
                expect(isEmpty({ a: 1 })).to.be.false
            })

            it('值为其他任意值：返回false', () => {
                expect(isEmpty(true)).to.be.false
                expect(isEmpty(1)).to.be.false
                expect(isEmpty('')).to.be.false
            })

        });


        describe('将任何输入Promise化#promisify', () => {
            it('传入一个普通值', (done) => {
                const promise = promisify(1);
                expect(promise).to.be.an.instanceOf(Promise);
                promise.then(val => {
                    expect(val).to.equal(1);
                    done();
                });
            });

            it('传入一个promise', (done) => {
                const promise = promisify(Promise.resolve(1));
                expect(promise).to.be.an.instanceOf(Promise);
                promise.then(val => {
                    expect(val).to.equal(1);
                    done();
                });
            });

            it('传入一个函数', (done) => {
                const promise = promisify(() => { return 1 });
                expect(promise).to.be.an.instanceOf(Promise);
                promise.then(val => {
                    expect(val()).to.equal(1);
                    done();
                });
            });
        });


        describe('Promise 队列调用#chain', () => {

            it('队列调用次数正确', (done) => {
                const spy = sinon.spy();
                const gt5 = chain(spy);
                gt5([1, 3, 6, 2, 7]).then(() => {
                    expect(spy.callCount).to.be.equal(5);
                    done();
                });
            });

            it('每次调用参数正确', (done) => {
                const spy = sinon.spy();
                const gt5 = chain(spy);
                gt5([1, 3, 6, 2, 7]).then(() => {
                    expect(spy.firstCall.calledWith(1, 0, [1, 3, 6, 2, 7])).to.be.true;
                    expect(spy.lastCall.calledWith(7, 4, [1, 3, 6, 2, 7])).to.be.true;
                    done();
                });
            });

            it('队列调用结果正确', (done) => {
                let result = [];
                const gt5 = chain((x) => result = [...result, x * 2]);
                gt5([1, 3, 6, 2, 7]).then(() => {
                    expect(result).deep.equal([2, 6, 12, 4, 14]);
                    done();
                });
            });

        });


        describe('按位增加值#bitSum', () => {
            it('传入一个十进制数', () => {
                expect(bitSum(1)).to.equal(1);
            });
            it('传入多个十进制数', () => {
                expect(bitSum(0, 1)).to.equal(1);
                expect(bitSum(1, 2, 3)).to.equal(3);
                expect(bitSum(1, 2, 4)).to.equal(7);
            });

            it('不传任何参数：返回undefined', () => {
                expect(bitSum()).to.be.undefined;
            });

            it('传入字面量undefined：返回undefined', () => {
                expect(bitSum(undefined)).to.be.undefined;
            });

        });


        describe('按位减去值#bitSub', () => {
            it('传入一个十进制数', () => {
                expect(bitSub(1)).to.equal(1);
            });

            it('传入多个十进制数', () => {
                expect(bitSub(1)).to.equal(1);
                expect(bitSub(15, 1)).to.equal(14);
                expect(bitSub(15, 3)).to.equal(12);
                expect(bitSub(15, 1, 3)).to.equal(12);
            })
            it('不传任何参数：返回undefined', () => {
                expect(bitSub()).to.be.undefined;
            });

            it('传入字面量undefined：返回undefined', () => {
                expect(bitSub(undefined)).to.be.undefined;
            });
        });


        describe('测试比特位x是否包含比特位y#bitTest', () => {
            it('x包含y：返回true', () => {
                expect(bitTest(13, 5)).to.be.true // 1101包含101
            });
            it('x等于y：返回true', () => {
                expect(bitTest(13, 13)).to.be.true // 1101包含1101                
            })
            it('x不包含y：返回false', () => {
                expect(bitTest(5, 13)).to.be.false // 101不包含1101                                
            });
        });


        describe('测试输入值是否是undefined或者null#isNil', () => {
            it('输入值为null：返回true', () => {
                expect(isNil(null)).to.be.true
            });

            it('输入值是undefined：返回true', () => {
                expect(isNil(undefined)).to.be.true
            });

            it('其他任意值：返回false', () => {
                expect(isNil(0)).to.be.false
                expect(isNil('a')).to.be.false
                expect(isNil([])).to.be.false
                expect(isNil({})).to.be.false
            });

        });


        describe('深度改变object值并返回新object#setCopy', () => {

            it('传入单层已有路径', () => {
                const oldObj = {
                    dirList: {
                        dir1: {
                            fileList: {
                                file1: {
                                    name: 'test.doc'
                                }
                            }
                        }
                    }
                }
                const newObj = setCopy(oldObj, 'dirList', 'aaa')
                expect(newObj).to.not.equal(oldObj)
                expect(newObj).to.deep.equal({ dirList: 'aaa' })
            });

            it('传入单层不存在路径', () => {
                const oldObj = {
                    dirList: {
                        dir1: {
                            fileList: {
                                file1: {
                                    name: 'test.doc'
                                }
                            }
                        }
                    }
                }
                const newObj = setCopy(oldObj, 'test', 'aaa')
                expect(newObj).to.not.equal(oldObj)
                expect(newObj).to.deep.equal({
                    test: 'aaa',
                    dirList: {
                        dir1: {
                            fileList: {
                                file1: {
                                    name: 'test.doc'
                                }
                            }
                        }
                    }
                })
            });

            it('传入多层已有路径', () => {
                const oldObj = {
                    dirList: {
                        dir1: {
                            fileList: {
                                file1: {
                                    name: 'test.doc'
                                }
                            }
                        }
                    }
                }
                const newObj = setCopy(oldObj, 'dirList.dir1.fileList', 'aaa')
                expect(newObj).to.not.equal(oldObj)
                expect(newObj).to.deep.equal({ dirList: { dir1: { fileList: 'aaa' } } })
            });

            it('传入多层不存在的路径', () => {
                const oldObj = {
                    dirList: {
                        dir1: {
                            fileList: {
                                file1: {
                                    name: 'test.doc'
                                }
                            }
                        }
                    }
                }
                const newObj = setCopy(oldObj, 'dirList.dir1.testDir', { test: 'aaa' })
                expect(newObj).to.not.equal(oldObj)
                expect(newObj).to.deep.equal({
                    dirList: {
                        dir1: {
                            testDir: { test: 'aaa' },
                            fileList: {
                                file1: {
                                    name: 'test.doc'
                                }
                            }
                        }
                    }
                })
            });

        });

    })
})