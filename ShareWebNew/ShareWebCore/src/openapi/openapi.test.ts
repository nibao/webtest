import { expect } from 'chai';
import * as sinon from 'sinon';
import { useFakeXHR, respondQueue } from '../../libs/fake-server-factory';
import { parse as parseURL } from 'url';
import { setup, eachttp, efshttp, getOpenAPIConfig, CacheableOpenAPIFactory } from './openapi';

declare const { describe, it, before, after }

const onTokenExpire = sinon.spy();

describe('ShareWebCore', () => {
    describe('openapi', () => {

        before('初始化openAPI配置和userid、tokenid', () => {
            setup({
                host: 'http://localhost',
                EACPPort: 9998,
                EFSPPort: 9123,
                userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                onTokenExpire
            })
        });

        after('还原openAPI配置，userid、tokenid', () => {
            setup({
                host: 'http://localhost',
                EACPPort: undefined,
                EFSPPort: undefined,
                userid: undefined,
                tokenid: undefined,
                onTokenExpire: undefined,
            })
        });


        describe('获取OpenAPI配置#getOpenAPIConfig', () => {

            it('不传参数：返回全部配置项', () => {
                expect(getOpenAPIConfig()).deep.equal({
                    host: 'http://localhost',
                    EACPPort: 9998,
                    EFSPPort: 9123,
                    userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                    tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    onTokenExpire
                });
            });

            it('传入单个字符串：获取单项配置', () => {
                expect(getOpenAPIConfig('userid')).equal('39951a06-0e15-11e7-83e7-643e8cb593de')
            });

            it('传入字符串数组：返回多项配置', () => {
                expect(getOpenAPIConfig(['userid', 'tokenid', 'onTokenExpire'])).deep.equal({
                    userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                    tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    onTokenExpire
                });
            });

        })


        describe('可缓存的开放API工厂函数#CacheableOpenAPIFactory', () => {

            describe('函数定义时使用默认缓存（1000ms）', () => {
                it('调用时使用默认缓存', async () => {
                    const clock = sinon.useFakeTimers(0) // 模拟时间为0毫秒值对应的时间,Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)

                    const spy = sinon.spy(() => 'testSpy')
                    const cacheSpy = CacheableOpenAPIFactory(spy, 'fakeResource', 'fakeMethod')

                    /* 当前时间为0，第一次调用，没有缓存 */
                    expect(await cacheSpy(undefined)).to.equal('testSpy')
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true
                    expect(spy.calledOnce).to.be.true

                    clock.tick(999) // 距上一次缓存999ms
                    expect(await cacheSpy(undefined)).to.equal('testSpy')
                    expect(spy.calledOnce).to.be.true

                    clock.tick(1) // 距上一次缓存1000ms，缓存超时，更新缓存
                    expect(await cacheSpy(undefined)).to.equal('testSpy')
                    expect(spy.calledTwice).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true

                    clock.tick(1) // 距上一次缓存1ms
                    expect(await cacheSpy(undefined)).to.equal('testSpy')
                    expect(spy.calledTwice).to.be.true

                    clock.tick(1) // 距上一次缓存1ms,使用新的userid和tokenid,立即重新请求
                    expect(await cacheSpy(undefined, { userid: 'fakeUserid', tokenid: 'fakeTokenid' })).to.equal('testSpy')
                    expect(spy.calledThrice).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: 'fakeUserid',
                        tokenid: 'fakeTokenid',
                    })).to.be.true

                    clock.tick(2) // 距上一次缓存1ms,使用新参数，立即重新请求
                    expect(await cacheSpy({ newParams: 'newParams' }, { userid: 'fakeUserid', tokenid: 'fakeTokenid' })).to.equal('testSpy')
                    expect(spy.callCount).to.equal(4)
                    expect(spy.calledWith('fakeResource', 'fakeMethod', { newParams: 'newParams' }, {
                        userid: 'fakeUserid',
                        tokenid: 'fakeTokenid',
                    })).to.be.true

                    clock.restore()
                });

                it('调用时使用自定义缓存[0-1000]', async () => {
                    const clock = sinon.useFakeTimers(0) // 模拟时间为0毫秒值对应的时间,Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)

                    const spy = sinon.spy(() => 'testSpy')
                    const cacheSpy = CacheableOpenAPIFactory(spy, 'fakeResource', 'fakeMethod')

                    /* 第一次调用，无缓存，新建缓存 */
                    expect(await cacheSpy(undefined, { useCache: 0 })).to.equal('testSpy')
                    expect(spy.calledOnce).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true

                    clock.tick(1) // 距上一次缓存1ms
                    expect(await cacheSpy(undefined, { useCache: 0 })).to.equal('testSpy')
                    expect(spy.calledTwice).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true

                    clock.tick(200) // 距上一次缓存200ms
                    expect(await cacheSpy(undefined, { useCache: 100 })).to.equal('testSpy') // 使用100ms内的缓存，缓存过期，更新缓存
                    expect(spy.calledThrice).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true

                    clock.tick(800) // 距上一次缓存800ms,使用新的userid和tokenid进行请求，重新调用
                    expect(await cacheSpy(undefined, { useCache: 1000, userid: 'fakeUserid', tokenid: 'fakeTokenid' })).to.equal('testSpy')
                    expect(spy.callCount).to.equal(4)
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: 'fakeUserid',
                        tokenid: 'fakeTokenid',
                    })).to.be.true

                })
            })

            describe('函数定义时使用自定义缓存时间[0-Infinity]', () => {
                it('expires=0,函数本身不支持缓存', async () => {
                    const clock = sinon.useFakeTimers(0) // 模拟时间为0毫秒值对应的时间,Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)

                    const spy = sinon.spy(() => 'testSpy')
                    const cacheSpy = CacheableOpenAPIFactory(spy, 'fakeResource', 'fakeMethod', { expires: 0 })

                    /* 第一次调用，无缓存 */
                    expect(await cacheSpy(undefined)).to.equal('testSpy')
                    expect(spy.calledOnce).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true

                    clock.tick(1) // 1ms后
                    expect(await cacheSpy(undefined)).to.equal('testSpy')
                    expect(spy.calledTwice).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true

                    clock.tick(1) // 2ms后
                    expect(await cacheSpy(undefined, { useCache: 1000 })).to.equal('testSpy') // 即使传入useCache也不会生效，因为没有缓存
                    expect(spy.calledThrice).to.be.true

                    clock.tick(1) // 2ms后,使用新的userid和tokenid重新请求
                    expect(await cacheSpy(undefined, { userid: 'fakeUserid', tokenid: 'fakeTokenid' })).to.equal('testSpy')
                    expect(spy.callCount).to.equal(4)
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: 'fakeUserid',
                        tokenid: 'fakeTokenid',
                    })).to.be.true

                    clock.restore()
                });

                it('expires=Infinity,函数本身支持永久缓存', async () => {
                    const clock = sinon.useFakeTimers(0) // 模拟时间为0毫秒值对应的时间,Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)

                    const spy = sinon.spy(() => 'testSpy')
                    const cacheSpy = CacheableOpenAPIFactory(spy, 'fakeResource', 'fakeMethod', { expires: Infinity })

                    /* 第一次调用，无缓存 */
                    expect(await cacheSpy(undefined)).to.equal('testSpy')
                    expect(spy.calledOnce).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true

                    clock.tick(1) // 1ms后，不使用缓存
                    expect(await cacheSpy(undefined, { useCache: 0 })).to.equal('testSpy')
                    expect(spy.calledTwice).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true

                    clock.tick(2000) // 距上一次缓存2000ms
                    expect(await cacheSpy(undefined, { useCache: 2001 })).to.equal('testSpy')
                    expect(spy.calledTwice).to.be.true


                    clock.tick(new Date('2020/01/01').getTime()) // 距离上一次缓存50年
                    expect(await cacheSpy(undefined)).to.equal('testSpy')
                    expect(spy.calledTwice).to.be.true

                    /* 使用新的userid和tokenid，立即重新请求 */
                    expect(await cacheSpy(undefined, { userid: 'fakeUserid', tokenid: 'fakeTokenid' })).to.equal('testSpy')
                    expect(spy.calledThrice).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: 'fakeUserid',
                        tokenid: 'fakeTokenid',
                    })).to.be.true

                    clock.restore()
                })

                it('expires=(0,Infinity)时，函数支持在该时间范围内缓存', async () => {
                    const clock = sinon.useFakeTimers(0) // 模拟时间为0毫秒值对应的时间,Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)

                    const spy = sinon.spy(() => 'testSpy')
                    const cacheSpy = CacheableOpenAPIFactory(spy, 'fakeResource', 'fakeMethod', { expires: 100 })

                    /* 当前时间为[0,100)，第一次调用，没有缓存 */
                    expect(await cacheSpy(undefined, { useCache: 0 })).to.equal('testSpy')
                    expect(spy.calledOnce).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true

                    clock.tick(1) // 距离上一次缓存1ms
                    expect(await cacheSpy(undefined, { useCache: 0 })).to.equal('testSpy')
                    expect(spy.calledTwice).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true

                    clock.tick(99) // 距离上一次缓存99ms
                    expect(await cacheSpy(undefined)).to.equal('testSpy')
                    expect(spy.calledTwice).to.be.true

                    clock.tick(1) // 距离上一次缓存100ms，更新缓存
                    expect(await cacheSpy(undefined)).to.equal('testSpy')
                    expect(spy.calledThrice).to.be.true
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true

                    clock.tick(100) // 距离上次缓存100ms
                    expect(await cacheSpy(undefined, { useCache: 101 })).to.equal('testSpy') // usecache>expires时，expires为超时时间
                    expect(spy.callCount).to.equal(4)
                    expect(spy.calledWith('fakeResource', 'fakeMethod', undefined, {
                        userid: '39951a06-0e15-11e7-83e7-643e8cb593de',
                        tokenid: '4e167673-1e76-4ea5-92a3-f947aa2fb079',
                    })).to.be.true

                })
            })

        })


        describe('EACHttp协议#eachttp', () => {

            it('发送请求，不传递method,userid,tokenid', (done) => {
                useFakeXHR((requests, restore) => {
                    eachttp('ping', null, null, { userid: null, tokenid: null }).then((res) => {
                        expect(res).to.deep.equal({ docinfo: [] });

                        restore();
                        done()
                    });

                    const url = parseURL(requests[0].url, true);

                    expect(url.query).to.deep.equal({})
                    expect(requests[0].url).to.equal('http://localhost:9998/v1/ping');
                    expect(requests[0].requestBody).to.be.equal('null');

                    requests[0].respond(200, null, JSON.stringify({ docinfo: [] }));
                });
            });

            it('发送请求，不传递userid,tokenid', (done) => {
                useFakeXHR((requests, restore) => {
                    eachttp('ping', 'get', null, { userid: null, tokenid: null }).then((res) => {
                        expect(res).to.deep.equal({ docinfo: [] })

                        restore();
                        done()
                    });

                    const url = parseURL(requests[0].url, true);

                    expect(url.query).to.deep.equal({ method: 'get' })
                    expect(requests[0].url).to.equal('http://localhost:9998/v1/ping?method=get');
                    expect(requests[0].requestBody).to.be.equal('null');

                    requests[0].respond(200, null, JSON.stringify({ docinfo: [] }));

                });
            });

            it('发送请求，传递method,userid,tokenid', (done) => {
                useFakeXHR((requests, restore) => {
                    eachttp('entrydoc', 'get', { doctype: 1 }, { userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: 'f90073f8-1c78-4fc8-b3e7-bc545521b5c6' })
                        .then((res) => {
                            expect(res).deep.equal({ docinfo: [] });

                            restore();
                            done();
                        });

                    const url = parseURL(requests[0].url, true);

                    expect(url.query).to.deep.equal({ method: 'get', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: 'f90073f8-1c78-4fc8-b3e7-bc545521b5c6' })
                    expect(requests[0].url).to.equal('http://localhost:9998/v1/entrydoc?method=get&userid=2a664704-5e18-11e3-a957-dcd2fc061e41&tokenid=f90073f8-1c78-4fc8-b3e7-bc545521b5c6');
                    expect(requests[0].requestBody).equal(JSON.stringify({ doctype: 1 }));

                    requests[0].respond(200, null, JSON.stringify({ docinfo: [] }));

                });
            });

        });


        describe('EFSHttp协议#efshttp', () => {

            it('发送请求，不传递method,userid,tokenid', (done) => {
                useFakeXHR((requests, restore) => {
                    efshttp('link', null, null, { userid: null, tokenid: null }).then(() => {

                        restore();
                        done();
                    });

                    const url = parseURL(requests[0].url, true);

                    expect(url.query).to.deep.equal({});
                    expect(requests[0].url).to.equal('http://localhost:9123/v1/link');
                    expect(requests[0].requestBody).to.be.equal('null');

                    requests[0].respond();

                });
            });

            it('发送请求，不传递userid和tokenid', (done) => {
                useFakeXHR((requests, restore) => {
                    efshttp('link', 'get', null, { userid: null, tokenid: null }).then(() => {
                        restore();
                        done();
                    });

                    expect(requests[0].url).to.equal('http://localhost:9123/v1/link?method=get');
                    expect(requests[0].requestBody).to.be.equal('null');

                    requests[0].respond();
                });
            });

            it('发送请求，传递method,userid,tokenid', (done) => {
                useFakeXHR((requests, restore) => {
                    efshttp('link', 'get', null, { userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: 'f90073f8-1c78-4fc8-b3e7-bc545521b5c6' }).then(() => {
                        restore();
                        done();
                    });

                    const url = parseURL(requests[0].url, true);

                    expect(url.query).to.deep.equal({ method: 'get', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: 'f90073f8-1c78-4fc8-b3e7-bc545521b5c6' })
                    expect(requests[0].url).to.equal('http://localhost:9123/v1/link?method=get&userid=2a664704-5e18-11e3-a957-dcd2fc061e41&tokenid=f90073f8-1c78-4fc8-b3e7-bc545521b5c6');
                    expect(requests[0].requestBody).to.be.equal('null');

                    requests[0].respond();

                });
            });

        });


    });
})