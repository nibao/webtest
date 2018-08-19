import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as quarantine from './quarantine';

declare const { describe, it, before, after }

describe('ShareWebCore', () => {

    describe('apis', () => {
        describe('efshttp', () => {

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

            describe('隔离区协议#quarantine', () => {

                
                describe('浏览协议#list', () => {

                    it('传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            quarantine.list({
                                _useless: true,
                            });
    
                            const url = parseURL(requests[0].url, true);
    
                            expect(url.pathname).equals('/v1/quarantine')
                            expect(url.query).deep.equal({
                                method: 'list',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
    
                            })
    
                            restore();
                            done();
                        })
                    });

                });
                

                describe('获取版本协议#listReversion', () => {

                    it('正确传入全部必传参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            quarantine.listReversion({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                _useless: true,
                            });
    
                            const url = parseURL(requests[0].url, true);
    
                            expect(url.pathname).equals('/v1/quarantine')
                            expect(url.query).deep.equal({
                                method: 'listreversion',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                            })
    
                            restore();
                            done();
                        })
                    });

                });
                

                describe('申述协议#appeal', () => {

                    it('正确传入全部必传参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            quarantine.appeal({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                reason: '文件正常',
                                _useless: true,
                            });
    
                            const url = parseURL(requests[0].url, true);
    
                            expect(url.pathname).equals('/v1/quarantine')
                            expect(url.query).deep.equal({
                                method: 'appeal',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                reason: '文件正常'
                            })
    
                            restore();
                            done();
                        })
                    });

                });
                

                describe('历史文件预览#preview', () => {

                    it('正确传入全部必传参数，正确传入全部可选参数，传入单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            quarantine.preview({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: 'AAA6CBAFE45B4E4D884DC59805E60A5C',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true,
                                _useless: true,
                            });
    
                            const url = parseURL(requests[0].url, true);
    
                            expect(url.pathname).equals('/v1/quarantine')
                            expect(url.query).deep.equal({
                                method: 'preview',
                                userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                                tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298'
                            });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({
                                docid: 'gns://605E7DA104FF473DBA82A42E8BCD5707/50FD3412E3B848EA90ECC8D8A2163772/49D891AD6C68436C95FBA4B966F689BF',
                                rev: 'AAA6CBAFE45B4E4D884DC59805E60A5C',
                                reqhost: 'anyshare.eisoo.com',
                                usehttps: true
                            })
    
                            restore();
                            done();
                        })
                    });

                });
                

            });
        })
    })
})