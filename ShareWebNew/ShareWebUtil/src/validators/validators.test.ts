import { expect } from 'chai';
import { number, natural, positive, positiveInteger, mail, clock, tweet, maxLength, range, validateColor, subNetMask, IP, positiveIntegerAndMaxLength, isURL, isDomain, isMac, mailAndLenth } from './validators';

describe('ShareWebUtil', () => {
    describe('validators', () => {
        describe('验证是否是数字#number', () => {
            it('传入数字或字符串数字，返回true', () => {
                /* 负数 */
                expect(number(-1)).to.be.true;
                expect(number(-1.1)).to.be.true;

                /* 0 */
                expect(number(-0)).to.be.true;
                expect(number(0)).to.be.true;
                expect(number(+0)).to.be.true;

                /* 正数 */
                expect(number(1)).to.be.true;
                expect(number(+1)).to.be.true;
                expect(number(1.1)).to.be.true;

                /* 字符串数字 */
                expect(number('-1.1')).to.be.true;
                expect(number('0')).to.be.true;
                expect(number('1.1')).to.be.true;

            });

            it('传入非合法数字字符串，返回false', () => {
                expect(number('')).to.be.false;
                expect(number('a')).to.be.false;
                expect(number('1.1.1')).to.be.false;
            });

            it('传入布尔值，返回false', () => {
                expect(number(true)).to.be.false;
                expect(number(false)).to.be.false;
            });

            it('传入对象，返回false', () => {
                expect(number({})).to.be.false;
                expect(number({ test: 'test' })).to.be.false;
            })

            it('传入数组，返回false', () => {
                expect(number([])).to.be.false;
                expect(number([1, 2, 3])).to.be.false;
            })

            it('传入null,undefined，返回false', () => {
                expect(number(null)).to.be.false;
                expect(number(undefined)).to.be.false;
            })

        });

        describe('验证自然数#natural', () => {
            it('传入自然数，返回true', () => {
                expect(natural(0)).to.be.true;
                expect(natural(1)).to.be.true;
                expect(natural(1)).to.be.true;
            });

            it('传入非自然数，返回false', () => {
                expect(natural(1.1)).to.be.false;
                expect(natural(-1)).to.be.false;
                expect(natural(-1.1)).to.be.false;
                expect(natural('a')).to.be.false;
                expect(natural('1.1.1')).to.be.false;
            });
        });

        describe('验证正数（包括0）#positive', () => {
            it('验证是正数', () => {
                expect(positive(0)).to.be.true;
                expect(positive(1)).to.be.true;
                expect(positive(1.1)).to.be.true;
            });

            it('验证不是正数', () => {
                expect(positive('')).to.be.false;
                expect(positive(-1)).to.be.false;
                expect(positive(-1.1)).to.be.false;
                expect(positive('a')).to.be.false;
                expect(positive('1.1.1')).to.be.false;
            });
        });


        describe('验证正整数#positiveInteger', () => {
            it('传入正整数，返回true', () => {
                expect(positiveInteger(1)).to.be.true
                expect(positiveInteger(10)).to.be.true
                expect(positiveInteger(100)).to.be.true
            });

            it('传入非正整数，返回false', () => {
                expect(positiveInteger('')).to.be.false
                expect(positiveInteger(-1.1)).to.be.false
                expect(positiveInteger(-1)).to.be.false
                expect(positiveInteger(0)).to.be.false
                expect(positiveInteger(1.1)).to.be.false
            });
        });

        describe('验证邮箱#mail', () => {
            it('传入邮箱字符串，返回true', () => {
                expect(mail('abc@123.com')).to.be.true;
                expect(mail('abc@123.com.cn')).to.be.true;
                expect(mail('a-b-c@123.com.cn')).to.be.true;
                expect(mail('a_b_c@123.com.cn')).to.be.true;
                expect(mail('a_b_c@123-4-5-6.com.cn')).to.be.true;
            });

            it('传入非邮箱字符串，返回true', () => {
                expect(mail('')).to.be.false;
                expect(mail('abc@')).to.be.false;
                expect(mail('@123.com')).to.be.false;
                expect(mail('abc@123')).to.be.false;
                expect(mail('123.com')).to.be.false;
            });
        });

        describe('#clock', () => {

            it('验证是时间', () => {
                expect(clock('0')).to.be.true;
                expect(clock(0)).to.be.true;
                expect(clock('59')).to.be.true;
                expect(clock(59)).to.be.true;
            });

            it('验证不是时间', () => {
                expect(clock('')).to.be.false;
                expect(clock('-1')).to.be.false;
                expect(clock(-1)).to.be.false;
                expect(clock('60')).to.be.false;
                expect(clock(60)).to.be.false;
                expect(clock('59.9')).to.be.false;
                expect(clock(59.9)).to.be.false;
                expect(clock(undefined)).to.be.false;
                expect(clock(null)).to.be.false;
            });
        })

        describe('验证是否超过字数限制140#tweet', () => {
            it('未超过限制，返回true', () => {
                let testString = '';
                for (let i = 0; i < 140; i++) {
                    testString += 'a'
                }
                expect(tweet('')).to.be.true
                expect(tweet(testString)).to.be.true
            });
            it('超过限制，返回false', () => {
                let testString = '';
                for (let i = 0; i <= 140; i++) {
                    testString += 'a'
                }
                expect(tweet(testString)).to.be.false
                testString += 'a'
                expect(tweet(testString)).to.be.false
            });
        });


        describe('限制输入最大长度#maxLength', () => {
            describe('不去掉首尾空格', () => {
                it('传入字符串小于或等于限制长度，返回true', () => {
                    expect(maxLength(10, false)('')).to.be.true
                    expect(maxLength(10, false)('0123456789')).to.be.true
                });
                it('传入字符串大于限制长度，返回false', () => {
                    expect(maxLength(10, false)('0123456789a')).to.be.false
                    expect(maxLength(10, false)(' 0123456789')).to.be.false
                    expect(maxLength(10, false)('0123456789 ')).to.be.false
                    expect(maxLength(10, false)(' 123456789 ')).to.be.false
                });
            });

            describe('去掉首尾空格后', () => {

                it('传入字符串小于或等于限制长度，返回true', () => {
                    expect(maxLength(10, true)('')).to.be.true
                    expect(maxLength(10, true)('0123456789')).to.be.true
                    expect(maxLength(10, true)('0123456789 ')).to.be.true
                    expect(maxLength(10, true)(' 0123456789')).to.be.true
                    expect(maxLength(10, true)(' 0123456789 ')).to.be.true
                });

                it('传入字符串大于限制长度，返回false', () => {
                    expect(maxLength(10, true)('0123456789a')).to.be.false
                    expect(maxLength(10, true)(' 0123456789a')).to.be.false
                    expect(maxLength(10, true)('0123456789a ')).to.be.false
                    expect(maxLength(10, true)(' 0123456789a ')).to.be.false
                });

                it('只传入长度，默认去掉空格后进行长度判断', () => {
                    expect(maxLength(10)('')).to.be.true
                    expect(maxLength(10)('0123456789')).to.be.true
                    expect(maxLength(10)('0123456789 ')).to.be.true
                    expect(maxLength(10)(' 0123456789')).to.be.true
                    expect(maxLength(10)(' 0123456789 ')).to.be.true

                    expect(maxLength(10)('0123456789a')).to.be.false
                    expect(maxLength(10)(' 0123456789a')).to.be.false
                    expect(maxLength(10)('0123456789a ')).to.be.false
                    expect(maxLength(10)(' 0123456789a ')).to.be.false
                });
            });
        });


        describe('限制输入范围(自然数)#range', () => {
            it('传入值在范围闭区间[from,to]内，返回true', () => {
                expect(range(0, 10)(0)).to.be.true;
                expect(range(0, 10)(5)).to.be.true;
                expect(range(0, 10)(10)).to.be.true;
            });

            it('传入值在范围闭区间[from,to]外，返回false', () => {
                expect(range(0, 10)(-1)).to.be.false;
                expect(range(0, 10)(11)).to.be.false;
            });

        });


        describe('验证颜色#validateColor', () => {
            it('是合法的#后6位颜色值，返回true', () => {
                expect(validateColor('#000000')).to.be.true
                expect(validateColor('#ffffff')).to.be.true
                expect(validateColor('#FFFFFF')).to.be.true
                expect(validateColor('#0a0a0a')).to.be.true
                expect(validateColor('#0A0A0A')).to.be.true
                expect(validateColor('#0a0A0a')).to.be.true

            });

            it('不合法的颜色值，返回false', () => {
                expect(validateColor('')).to.be.false
                expect(validateColor('#000')).to.be.false
                expect(validateColor('#fff')).to.be.false
                expect(validateColor('#gggggg')).to.be.false
                expect(validateColor('#1a1')).to.be.false
            });
        });


        describe('验证子网掩码#subNetMask', () => {
            it('输入为子网掩码，返回true', () => {
                expect(subNetMask('255.255.255.255')).to.be.true
                expect(subNetMask('128.0.0.0')).to.be.true
                expect(subNetMask('255.128.0.0')).to.be.true
            });

            it('输入不为子网掩码，返回false', () => {
                expect(subNetMask('')).to.be.false
                expect(subNetMask('126.125.124.122')).to.be.false
                expect(subNetMask('255.126.0.0')).to.be.false
            });
        });

        describe('验证ip#IP', () => {
            it('输入为ip地址，返回true', () => {
                expect(IP('192.168.138.30')).to.be.true
            });

            it('输入不为ip地址，返回false', () => {
                expect(IP('')).to.be.false
                expect(IP('192.168.138')).to.be.false
                expect(IP('192.168.999')).to.be.false
                expect(IP('0.0.0.0.0')).to.be.false
            });
        });


        describe('验证正整数并且有位数限制#positiveIntegerAndMaxLength', () => {
            it('为正整数，满足位数限制，返回true', () => {
                expect(positiveIntegerAndMaxLength(3)(99)).to.be.true
                expect(positiveIntegerAndMaxLength(3)(100)).to.be.true
                expect(positiveIntegerAndMaxLength(3)(999)).to.be.true
            });

            it('不为正整数，不满足位数限制，返回false', () => {
                expect(positiveIntegerAndMaxLength(3)(-1001)).to.be.false
                expect(positiveIntegerAndMaxLength(3)('aaaa')).to.be.false
                expect(positiveIntegerAndMaxLength(3)('0000')).to.be.false
            });

            it('为正整数，不满足位数限制，返回false', () => {
                expect(positiveIntegerAndMaxLength(3)(1000)).to.be.false
                expect(positiveIntegerAndMaxLength(3)(1001)).to.be.false
            });

            it('不为正整数，满足位数限制，返回false', () => {
                expect(positiveIntegerAndMaxLength(3)('aaa')).to.be.false
                expect(positiveIntegerAndMaxLength(3)('-1234')).to.be.false
            });
        });


        describe('验证邮箱格式并且有长度限制mailAndLenth', () => {
            // 邮箱验证规则和#mail一致，不再进行覆盖，只覆盖长度限制。
            it('超出长度限制开区间（minLength,maxLength），返回false', () => {
                expect(mailAndLenth('q@qq.com', 8, 12)).to.be.false
                expect(mailAndLenth('q1234@qq.com', 8, 12)).to.be.false
            });

            it('不超过长度限制开区间（minLength,maxLength），返回true', () => {
                expect(mailAndLenth('q1@qq.com', 8, 12)).to.be.true
                expect(mailAndLenth('q123@qq.com', 8, 12)).to.be.true
            });
        });

        describe('验证是否是URL#isURL', () => {
            it('是合法url，返回true', () => {
                expect(isURL('http://www.anyshare.com')).to.be.true
                expect(isURL('https://anyshare.com')).to.be.true
                expect(isURL('ftp://anyshare.com')).to.be.true
                expect(isURL('http://192.168.138.30')).to.be.true
            });

            it('不是合法url，返回false', () => {
                expect(isURL('')).to.be.false
                expect(isURL('192.168.138')).to.be.false
                expect(isURL('http://a.')).to.be.false
            });
        });

        describe('匹配域名isDomain', () => {
            it('输入为域名，返回true', () => {
                expect(isDomain('anyshare.com')).to.be.true
                expect(isDomain('anyshare.cn')).to.be.true
                expect(isDomain('home.anyshare.com')).to.be.true
                expect(isDomain('1.anyshare.com')).to.be.true
                expect(isDomain('1.any-share.com')).to.be.true
                expect(isDomain('www.anyshare.com')).to.be.true
            });

            it('输入不为域名，返回false', () => {
                expect(isDomain('')).to.be.false
                expect(isDomain('http://anyshare.com')).to.be.false
                expect(isDomain('ftp://anyshare.com')).to.be.false
            });
        });

        describe('验证Mac地址#isMac', () => {
            it('是mac地址，返回true', () => {
                expect(isMac('00-00-00-00-00-00')).to.be.true
                expect(isMac('FF-FF-FF-FF-FF-FF')).to.be.true
                expect(isMac('1A-2B-3C-4D-5e-6f')).to.be.true
            });

            it('不是mac地址，返回false', () => {
                expect(isMac('123-00-00-00-00-00')).to.be.false
                expect(isMac('00-00-0g-00-00-00')).to.be.false
                expect(isMac('00-00-00-00-00')).to.be.false
            });
        });

        describe('是否是后缀#isSuffix', () => {
            it('是后缀，返回true');
            it('不是后缀，返回false');
        });

    });
})