import { expect } from 'chai';
import { useFakeXHR, respondQueue } from '../../libs/fake-server-factory';
import * as sinon from 'sinon';

import * as oem from '../oem/oem';
import * as language from './language';

const sandbox = sinon.createSandbox();

describe('ShareWebCore', () => {
    describe('language', () => {

        describe('默认导出#Languages', () => {
            it('默认导出Languages', () => {
                expect(language.Languages).to.deep.equal([{
                    language: 'zh-cn',
                    title: '简体中文'
                }, {
                    language: 'zh-tw',
                    title: '繁體中文'
                }, {
                    language: 'en-us',
                    title: 'English'
                }])
            });
        });

        /* 语言配置获取后采用了局部变量缓存因此后面的测试用例无法再进行 */

        describe.skip('获取当前允许的语言版本列表#getLanguageList', () => {

            beforeEach('stub getOEMConfByOptions(["allowTw", "allowEn", "allowCn"])', () => {
                sandbox.stub(oem, 'getOEMConfByOptions');
            });
            afterEach('retore getOEMConfByOptions(["allowTw", "allowEn", "allowCn"])', () => {
                sandbox.restore();
            });

            it('禁用英文：返回简体中文和繁体中文配置', () => {
                oem.getOEMConfByOptions.withArgs(['allowTw', 'allowEn', 'allowCn']).resolves({ allowTw: true, allowEn: false, allowCn: true })

                return language.getLanguageList().then((languageList) => {
                    expect(languageList).to.be.an('array').that.to.deep.equal([
                        {
                            language: 'zh-cn',
                            title: '简体中文'
                        },
                        {
                            language: 'zh-tw',
                            title: '繁體中文'
                        }
                    ]);
                });
            });


            it('禁用英文、繁体：返回简体中文配置', () => {
                oem.getOEMConfByOptions.withArgs(['allowTw', 'allowEn', 'allowCn']).resolves({ allowTw: false, allowEn: false, allowCn: true })

                return language.getLanguageList().then((languageList) => {
                    expect(languageList).to.be.an('array').that.to.deep.equal([{
                        language: 'zh-cn',
                        title: '简体中文'
                    }]);
                });
            })

            it('三种语言都被禁用，不考虑这种情况');

            it('获取语言配置失败：默认返回三种语言配置', () => {
                oem.getOEMConfByOptions.withArgs(['allowTw', 'allowEn', 'allowCn']).rejects();

                return language.getLanguageList().then((languageList) => {
                    expect(languageList).to.be.an('array').that.to.deep.equal([
                        {
                            language: 'zh-cn',
                            title: '简体中文'
                        },
                        {
                            language: 'zh-tw',
                            title: '繁體中文'
                        },
                        {
                            language: 'en-us',
                            title: 'English'
                        }
                    ]);
                });
            });
        });


        describe('获取当前的语言#getEnvLanguage', () => {
            afterEach('恢复默认环境', () => {
                window.location.hash = '';
                window.sessionStorage.clear();
            });
            it('从location.hash中获取语言', () => {
                window.location.hash = 'lang=zh-cn';
                expect(language.getEnvLanguage()).to.equal('zh-cn');
            });

            it('从session中获取语言', () => {
                window.sessionStorage.setItem('lang', JSON.stringify('en-us'));
                expect(language.getEnvLanguage()).to.equal('en-us');
            });

            it('使用默认语言,依赖浏览器环境', () => {
                expect(language.getEnvLanguage()).to.equal('zh-cn');
            });

        });


        describe('设置当前语言#setLanguage', () => {
            afterEach('恢复默认环境', () => {
                window.location.hash = '';
                window.sessionStorage.clear();
            });

            it('正确设置语言为zh-cn', () => {
                language.setLanguage('zh-cn');
                expect(language.getEnvLanguage()).to.equal('zh-cn')
            });

            it('正确设置语言为zh-tw', () => {
                language.setLanguage('zh-tw');
                expect(language.getEnvLanguage()).to.equal('zh-tw')
            });

            it('正确设置语言为en-us', () => {
                language.setLanguage('en-us');
                expect(language.getEnvLanguage()).to.equal('en-us')
            });

        });

        /* 语言配置获取后采用了局部变量缓存因此后面的测试用例无法再进行 */
        // describe('获取当前的语言 如果语言版本不被允许则按优先级显示(中文版本>英文版本>繁体版本)#getCurrentLang', () => {

        // });


    });
});

