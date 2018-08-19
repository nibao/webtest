import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as config from './config';

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

            describe('配置管理#config', () => {


                describe('获取配置信息#get', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            config.get({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/config')
                            expect(url.query).to.deep.equal({ method: 'get' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals(null)

                            restore();
                            done();
                        })
                    })

                });


                describe('获取OEM配置信息#getOemConfigBySection', () => {

                    it('传入正确的必传参数、单个可选参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            config.getOemConfigBySection({ section: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/config')
                            expect(url.query).to.deep.equal({ method: 'getoemconfigbysection' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ section: 'test', _useless: true }) // 通过curry，无法排除无关参数

                            restore();
                            done();
                        })
                    })

                });


                describe('获取文件水印配置信息#getDocWatermarkConfig', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            config.getDocWatermarkConfig({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/config')
                            expect(url.query).to.deep.equal({ method: 'getdocwatermarkconfig' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals(null)

                            restore();
                            done();
                        })
                    })

                });


                describe('获取OfficeOnline配置#getSiteOfficeOnLineInfo', () => {

                    it('传入正确的必传参数、单个可选参数（OpenAPI上无接口文档）', (done) => {
                        useFakeXHR((requests, restore) => {
                            config.getSiteOfficeOnLineInfo({ sitename: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/config')
                            expect(url.query).to.deep.equal({ method: 'getsiteofficeonlineinfo' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ sitename: 'test' })

                            restore();
                            done();
                        })
                    })

                });


            });
        })
    })
})