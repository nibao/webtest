import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as message from './message';

declare const { describe, it, before, after }

describe('ShareWebCore', () => {

    describe('apis', () => {
        describe('eachttp', () => {

            before('初始化userid和tokenid', () => {
                setupOpenAPI({
                    userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                    tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298',
                });
            });

            after('清除userid和tokenid', () => {
                setupOpenAPI({
                    userid: undefined,
                    tokenid: undefined,
                });
            });

            describe('消息通知#message', () => {


                describe('邮件发送#sendMail', () => {

                    it('传入正确的必传参数，正确传入所有可选参数，单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            message.sendMail({ mailto: 'test@eisoo.com', subject: 'test', content: 'this is a test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/message')
                            expect(url.query).to.deep.equal({ method: 'sendmail', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ mailto: 'test@eisoo.com', subject: 'test', content: 'this is a test' })

                            restore();
                            done();
                        })
                    })

                });

                describe('获取消息通知#get', () => {

                    it('传入正确的可选参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            message.get({ stamp: 0, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/message')
                            expect(url.query).to.deep.equal({ method: 'get', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ stamp: 0 })

                            restore();
                            done();
                        })
                    })

                });


                describe('确认消息通知#read2', () => {

                    it('传入错误类型的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            message.read2({ msgids: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/message')
                            expect(url.query).to.deep.equal({ method: 'read2', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ msgids: 'test' })

                            restore();
                            done();
                        })
                    })

                });


            });
        })
    })
})