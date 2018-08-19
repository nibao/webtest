import { expect } from 'chai';
import { Browser, OSType, open, userAgent, isBrowser, useHTTPS, isIE8, origin, mapKeyCode, toRelative, loadCSS, loadScript, load, bindEvent, unbindEvent, insertStyle, envLanguage, getSupportedLanguage, substrByEncodedLength, } from './browser';
import * as sinon from 'sinon';

describe('ShareWebUtil', () => {
    describe('browser', () => {

        describe('打开新窗口#open', () => {
            // 暂时无法测试
            it('打开新窗口')
        });


        describe('是否使用https#useHTTPS', () => {

            // 无法改变protocol，暂时无法进行使用https的测试
            it('使用https时：返回true');

            // protocol默认为about:
            it('未使用https时：返回false', () => {
                expect(useHTTPS()).to.be.false;
            });
        });

        /* window.navigator.userAgent是可读属性，无法模拟测试 */
        describe('获取UserAgent信息#userAgent', () => {
            it('IOS');
            it('IPAD');
            it('IE浏览器');
            it('Edge浏览器');
            it('Safari浏览器');
            it('Firefox浏览器');
            it('Chrome浏览器');
            it('WeChat浏览器');
        });

        /* 调用userAgent()无法测试 */
        describe('判断浏览器是否匹配查询结果#isBrowser', () => {
            it('正确匹配单个条件查询');

            it('正确匹配多个条件查询');
        });

        /* 调用userAgent()无法测试 */
        describe('检测是否是#isIE8', () => {
            it('是IE8：返回true');
            it('非IE8：返回false');

        });


        describe('获取页面的origin#origin', () => {
            // location.origin 和 localtion.protocol localtion.host 无法在node中模拟更改
            it('正确返回页面origin');
        });


        describe('映射keyCode到字符串#mapKeyCode--未使用模块', () => {
            it('keycode为闭区间[186,192]U[219,222]中的Unicode', () => {
                expect(mapKeyCode(186)).to.equal(';');
                expect(mapKeyCode(191)).to.equal('/');
                expect(mapKeyCode(222)).to.equal('\'');
            });

            it('keycode为其他合法Unicode', () => {
                expect(mapKeyCode(185)).to.equal('¹');
                expect(mapKeyCode(223)).to.equal('ß');
            })
        });


        describe('获取当前执行中的脚本相对的路径#toRelative', () => {
            it('传入路径为空，返回脚本路径');
            it('传入路径不为空，返回原始路径')
        });

        describe('加载CSS#loadCSS', () => {
            it('正确创建link标签');
        });

        describe('加载JS#loadScript', () => {
            it('正确创建Script标签');
        });


        describe('根据文件后缀加载js或css#load', () => {
            it('文件类型为js时调用loadScript()');

            it('文件类型为js时调用loadCSS()');
        });

        describe('绑定事件#bindEvent', () => {
            // 事件涉及到浏览器兼容性问题，测试覆盖问题
            it('正确绑定事件到目标上,并且返回取消响应事件函数', () => {
                const spy = sinon.spy();
                const unbind = bindEvent(document.body, 'click', spy);
                document.body.click();
                expect(spy.called).to.be.true;
                unbind();
                document.body.click();
                expect(spy.calledTwice).to.be.false;
            });
        });

        describe('移除事件响应#unbindEvent', () => {
            it('正确绑定移除事件', () => {
                const spy = sinon.spy();
                const unbind = bindEvent(document.body, 'click', spy);
                unbind();
                document.body.click();
                expect(spy.called).to.be.false;
            });
        });

        describe('插入样式声明#insertStyle', () => {
            it('正确插入样式声明');
        });

        describe('获取浏览器当前语言临时解决方案#envLanguage', () => {
            afterEach('恢复默认环境', () => {
                window.location.hash = '';
                window.sessionStorage.clear();
            });
            it('从location.hash中获取语言', () => {
                window.location.hash = 'lang=zh-cn';
                expect(envLanguage()).to.equal('zh-cn');
            });

            it('从session中获取语言', () => {
                window.sessionStorage.setItem('lang', JSON.stringify('en-us'));
                expect(envLanguage()).to.equal('en-us');
            });

            it('使用默认语言(这里依赖浏览器语言)', () => {
                expect(envLanguage()).to.equal('zh-cn');
            });

        });

        describe('获取适配后的语言环境#getSupportedLanguage', () => {

            it('传入语言前缀为zh', () => {
                expect(getSupportedLanguage('zh-cn')).to.equal('zh-cn');
                expect(getSupportedLanguage('zH-cn')).to.equal('zh-cn');
                expect(getSupportedLanguage('zh-Cn')).to.equal('zh-cn');
                expect(getSupportedLanguage('zH-cN')).to.equal('zh-cn');
                expect(getSupportedLanguage('zH_cn')).to.equal('zh-cn');
                expect(getSupportedLanguage('zH-tw')).to.equal('zh-tw');
                expect(getSupportedLanguage('zH-')).to.equal('zh-cn');
            });

            it('传入语言前缀不为zh', () => {
                expect(getSupportedLanguage('en-us')).to.equal('en-us');
                expect(getSupportedLanguage('cn-zh')).to.equal('en-us');
                expect(getSupportedLanguage('')).to.equal('en-us');
            });

        });

        describe('#substrByEncodedLength', () => {
            it('截取中文字符，以符合转义后最大长度限制', () => {

                expect(substrByEncodedLength('Web客户端HTTPS证书安装.docx', 1000)).equals('Web客户端HTTPS证书安装.docx');
            });
            it('限制长度为零，返回空字符串', () => {
                expect(substrByEncodedLength('Web客户端HTTPS证书安装.docx', 0)).equals('');
            })
            it('限制长度小于转义后的长度，返回限制长度的字符串', () => {
                expect(substrByEncodedLength('Web客户端HTTPS证书安装.docx', 75)).equals('Web客户端HTTPS证书安装.doc');
            });
            it('限制长度等于转义后的，返回整个字符串', () => {
                expect(substrByEncodedLength('Web客户端HTTPS证书安装.docx', 76)).equals('Web客户端HTTPS证书安装.docx');
            });

            it('限制长度等于转义后的，返回整个字符串', () => {
                expect(substrByEncodedLength('Web客户端HTTPS证书安装.docx', 77)).equals('Web客户端HTTPS证书安装.docx');
            });
        })
    })
})