import { expect } from 'chai';
import * as sinon from 'sinon';
import { useFakeXHR } from '../../libs/fake-server-factory'
import { queryString, joinURL, get, post } from './http';
import { parse as parseUrl } from 'url';


describe('ShareWebUtil', () => {
    describe('http', () => {


        describe('通过对象构建queryString#queryString', () => {
            it('传入空对象', () => {
                expect(queryString({})).equal('');
            })

            it('传入对象值为undefined', () => {
                expect(queryString({ x: undefined })).equal('');
                expect(queryString({ x: 1, y: undefined })).equal('x=1');
            });

            it('传入对象值为null', () => {
                expect(queryString({ x: null })).equal('');
                expect(queryString({ x: 1, y: null })).equal('x=1');
            });

            it('其他正常值', () => {
                expect(queryString({ x: 1 })).equal('x=1');
                expect(queryString({ x: 1, y: 2 })).equal('x=1&y=2');
            });
        });


        describe('连接URL和参数#joinURL', () => {

            it('不传queryString对象', () => {
                expect(joinURL('/uri')).equal('/uri');
                expect(joinURL('/uri?foo=bar')).equal('/uri?foo=bar');
            })

            it('queryString对象为{}', () => {
                expect(joinURL('/uri', {})).equal('/uri');
                expect(joinURL('/uri?foo=bar', {})).equal('/uri?foo=bar');
            });

            it('queryString对象包含值为undefined', () => {
                expect(joinURL('/uri', { x: 'aaa', y: undefined })).equal('/uri?x=aaa');
                expect(joinURL('/uri?foo=bar', { x: 'aaa', y: undefined })).equal('/uri?foo=bar&x=aaa');
            });

            it('其他queryString对象', () => {
                expect(joinURL('/uri', 'x=1&y=2')).equal('/uri?x=1&y=2');
                expect(joinURL('/uri', { x: 1 })).equal('/uri?x=1');
                expect(joinURL('/uri', { x: 1, y: 2 })).equal('/uri?x=1&y=2');
            });

        });


        describe('#get', () => {

            it('method为GET', (done) => {
                useFakeXHR((request, restore) => {
                    get('/uri').then(() => {
                        restore();
                        done();
                    });
                    expect(request[0].method).equal('GET');
                    request[0].respond();
                })
            })

            it('请求url正确', (done) => {
                useFakeXHR((request, restore) => {
                    get('/uri').then(() => {
                        restore();
                        done();
                    });
                    expect(request[0].method).equal('GET');
                    expect(request[0].url).equal('/uri');
                    request[0].respond();
                })
            })

            it('queryString参数正确', (done) => {
                useFakeXHR((request, restore) => {
                    get('/uri', { arg1: 1, arg2: 2 }).then(() => {
                        restore();
                        done();
                    });

                    const url = parseUrl(request[0].url, true);
                    expect(url.query).to.deep.equal({
                        arg1: '1',
                        arg2: '2'
                    })
                    request[0].respond();
                })
            })

            describe('sendAs正确', () => {
                it('sendAs为text', (done) => {
                    useFakeXHR((request, restore) => {
                        get('/uri', null, { sendAs: 'text' }).then(() => {
                            restore();
                            done();
                        });
                        request[0].respond();

                        expect(request[0].requestHeaders).to.deep.equal({ 'Content-Type': 'text/plain;charset=utf-8' });

                    })
                });

                it('sendAs为json', (done) => {
                    useFakeXHR((request, restore) => {
                        get('/uri', null, { sendAs: 'json' }).then(() => {
                            restore();
                            done();
                        });
                        request[0].respond();

                        expect(request[0].requestHeaders).to.deep.equal({ 'Content-Type': 'application/json;charset=utf-8' });

                    })
                });

                it('sendAs为form', (done) => {
                    useFakeXHR((request, restore) => {
                        get('/uri', null, { sendAs: 'form' }).then(() => {
                            restore();
                            done();
                        });
                        request[0].respond();

                        expect(request[0].requestHeaders).to.deep.equal({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' });

                    })
                });

                it('默认sendAs', (done) => {
                    useFakeXHR((request, restore) => {
                        get('/uri', null).then(() => {
                            restore();
                            done();
                        });
                        request[0].respond();

                        expect(request[0].requestHeaders).to.deep.equal({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' });

                    })
                });
            });

            describe('readAs正确', () => {
                it('readAs为json', (done) => {
                    useFakeXHR((request, restore) => {
                        get('/uri', null, { readAs: 'json' }).then(res => {
                            expect(res.response).to.deep.equal({ test: 'aaa' })
                            restore();
                            done();
                        })
                        request[0].respond(200, null, JSON.stringify({ test: 'aaa' }));
                    })
                })

                // it('readAS为xml', (done) => {
                //     useFakeXHR((request, restore) => {
                //         get('/uri', null, { readAs: 'xml' }).then(res => {
                //             expect(res.response).to.equal('{"test":"aaa"}')
                //             restore();
                //             done();
                //         })
                //         request[0].respond(200, null, JSON.stringify({ test: 'aaa' }));
                //     })
                // })

                it('readAS默认', (done) => {
                    useFakeXHR((request, restore) => {
                        get('/uri', null).then(res => {
                            expect(res.response).to.equal('{"test":"aaa"}')
                            restore();
                            done();
                        })
                        request[0].respond(200, null, JSON.stringify({ test: 'aaa' }));
                    })
                })

            });


            it('headers自定义请求头有效', (done) => {
                useFakeXHR((request, restore) => {
                    get('/uri', null, { headers: { name: 'test' } }).then(() => {
                        restore();
                        done();
                    });
                    expect(request[0].requestHeaders).to.deep.equal({
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                        'name': 'test'
                    });
                    request[0].respond();
                })
            });

            it('正确调用beforeSend', (done) => {
                const spy = sinon.spy();
                useFakeXHR((request, restore) => {
                    get('/uri', null, { beforeSend: spy }).then(() => {
                        restore();
                        done();
                    });
                    expect(spy.calledOnce).to.be.true;
                    request[0].respond();
                })

            });

        });

        describe('#post', () => {

            it('method为POST', (done) => {
                useFakeXHR((request, restore) => {
                    post('/uri').then(() => {
                        restore();
                        done();
                    });
                    expect(request[0].method).equal('POST');
                    request[0].respond();
                })
            });

            it('requestBody正确', (done) => {
                useFakeXHR((request, restore) => {
                    post('/uri', { test: 'aaa' }).then(() => {
                        restore();
                        done();
                    });
                    expect(request[0].requestBody).equal('test=aaa');
                    request[0].respond();
                })
            });

        });

    })
})
