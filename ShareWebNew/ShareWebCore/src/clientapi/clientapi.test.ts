import { expect } from 'chai';
import { clientAPI, getConfig } from './clientapi';
import { useFakeXHR } from '../../libs/fake-server-factory';

describe('ShareWebCore', () => {
    describe('clientapi', () => {
        describe('客户端API调用#clientAPI', () => {

            it('响应status码>400，reject响应体', (done) => {
                useFakeXHR((requests, restore) => {
                    clientAPI('resource', 'get', 'name').then(null, (res) => {
                        expect(res).to.deep.equal({ test: 'a' });
                        restore()
                        done();
                    })
                    requests[0].respond(400, null, JSON.stringify({ test: 'a' }))
                })
            });

            it('正常响应，resolve响应体', (done) => {
                useFakeXHR((requests, restore) => {
                    clientAPI('resource', 'get', 'name').then((res) => {
                        expect(res).to.deep.equal({ test: 'a' });
                        restore()
                        done();
                    })
                    requests[0].respond(200, null, JSON.stringify({ test: 'a' }))
                })
            });
        });


        describe('获取OpenAPI配置#getConfig', () => {
            it('不传递参数:返回所有配置', () => {
                expect(getConfig()).to.deep.equal({
                    host: `http://localhost:7001`
                })
            });
            it('传递数组:返回配置对象', () => {
                expect(getConfig(['host'])).to.deep.equal({
                    host: `http://localhost:7001`
                })
            });
            it('传递单个字符串:返回单个配置', () => {
                expect(getConfig('host')).to.equal('http://localhost:7001')
            })
        });
    })
})