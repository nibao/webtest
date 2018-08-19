import { expect } from 'chai';
import * as sinon from 'sinon';
import { formatTime, secToHHmmss, transformBytes, formatSize, formatRate, matchTemplate, shrinkText, formatColor, decorateText, formatTimeRelative } from './formatters';
import __ from './locale'

describe('ShareWebUtil', () => {
    describe('formatters', () => {

        describe('格式化日期#formatTime', () => {
            it('参数缺失时返回空字符串', () => {
                expect(formatTime()).equals('');
            })

            it('接受日期对象或毫秒数', () => {
                expect(formatTime(new Date('2016/08/10 08:00:00'))).equals('2016/08/10 08:00:00');
                expect(formatTime(1470787200000)).equals('2016/08/10 08:00:00');
            });

            it('返回自定义格式日期', () => {
                expect(formatTime(new Date('2016/08/10 08:00:00'), 'yyyy-MM-dd HH:mm:ss')).equals('2016-08-10 08:00:00');
            })
        });


        describe('格式化时分秒#secToHHmmss', () => {
            it('传入<60的秒数', () => {
                expect(secToHHmmss(59)).to.deep.equal('0:00:59')
            });

            it('传入=60的秒数', () => {
                expect(secToHHmmss(60)).to.deep.equal('0:01:00')
            });

            it('传入=3599的秒数', () => {
                expect(secToHHmmss(3599)).to.deep.equal('0:59:59')
            });

            it('传入=3600的秒数', () => {
                expect(secToHHmmss(3600)).to.deep.equal('1:00:00')
            });

            it('传入>3600的秒数', () => {
                expect(secToHHmmss(3601)).to.deep.equal('1:00:01')
            });

        });


        describe('转换字节数#transformBytes', () => {
            it('传入小于最小单位的字节数', () => {
                expect(transformBytes(1023, { minUnit: 'B' })).to.deep.equal([1023, 'B'])
            });

            it('传入等于最小单位的字节数', () => {
                expect(transformBytes(1024, { minUnit: 'B' })).to.deep.equal([1, 'KB'])
            });

            it('传入大于最小单位的字节数', () => {
                expect(transformBytes(Math.pow(1024, 2), { minUnit: 'KB' })).to.deep.equal([1, 'MB'])
            });

        });


        describe('大小格式化#formatSize', () => {
            it('返回进位后的大小', () => {
                expect(formatSize(0)).equals('0B');
                expect(formatSize(1024)).equals('1.00KB');
                expect(formatSize(Math.pow(1024, 2))).equals('1.00MB');
                expect(formatSize(Math.pow(1024, 3))).equals('1.00GB');
                expect(formatSize(Math.pow(1024, 4))).equals('1.00TB');
                expect(formatSize(Math.pow(1024, 5))).equals('1.00PB');
                expect(formatSize(Math.pow(1024, 3) * 0.01, 2, { minUnit: 'GB' })).equals('0.01GB');
                expect(formatSize(Math.pow(1024, 2), 2, { minUnit: 'GB' })).equals('0.00GB');
                expect(formatSize(Math.pow(1024, 3), 2, { minUnit: 'GB' })).equals('1.00GB');
                expect(formatSize(Math.pow(1024, 4), 2, { minUnit: 'GB' })).equals('1.00TB');
            });


            it('指定保留位数', () => {
                expect(formatSize(0, 0)).equals('0B');
                expect(formatSize(1024, 1)).equals('1.0KB');
            })
        });


        describe('速率格式化#formatRate', () => {
            it('默认保留位数', () => {
                expect(formatRate(1024)).to.equal('1.00KB/s')
            })
            it('保留指定位数', () => {
                expect(formatRate(1024, 0)).to.equal('1KB/s')
                expect(formatRate(1024, 2)).to.equal('1.00KB/s')
            });
        });


        describe('根据字符串模板从字符串中提取键值对#matchTemplate', () => {
            it('模板中有单个捕获', () => {
                expect(matchTemplate('Hello, World', 'Hello, ${name}')).to.deep.equal({ name: 'World' })
            })

            it('模板中有多个捕获', () => {
                expect(matchTemplate('Hello, World, hello, 20', 'Hello, ${name}, hello, ${number}')).to.deep.equal({ name: 'World', number: '20' })
            });
        });


        describe('裁切字符串长度#shrinkText', () => {
            it('截取纯英文字符串', () => {
                expect(shrinkText('The quick brown fox jumps over the lazy dog', { limit: 10 })).equal('The qui...');
            });

            it('截取的字符数大于文本长度', () => {
                expect(shrinkText('敏捷的棕毛狐狸从懒狗身上跃过', { limit: 30 })).equal('敏捷的棕毛狐狸从懒狗身上跃过');
            });

            it('截取纯中文字符串', () => {
                expect(shrinkText('敏捷的棕毛狐狸从懒狗身上跃过', { limit: 10 })).equal('敏捷的...');
            });

            it('截取中英文混合字符串', () => {
                expect(shrinkText('敏捷的棕毛狐狸 jumps over the lazy dog', { limit: 20 })).equal('敏捷的棕毛狐狸 ju...');
            });

            it('指定省略符号', () => {
                expect(shrinkText('敏捷的棕毛狐狸 jumps over the lazy dog', { limit: 20, indicator: '---' })).equal('敏捷的棕毛狐狸 ju---');
            });
        })


        describe('格式化颜色，色值加 #', () => {
            it('颜色值包含#', () => {
                expect(formatColor('#000000')).to.be.equal('#000000');
            });
            it('颜色值不包含#', () => {
                expect(formatColor('000000')).to.be.equal('#000000');
            });
        });


        describe('裁剪文件名(省略中间的字符串)，除英文字符外的字符认为长度为2#decorateText', () => {
            it('只包含英文', () => {
                expect(decorateText('this is a test', { limit: 10 })).to.equal('this ... test')
                expect(decorateText('this is a test', { limit: 30 })).to.equal('this is a test')
            });

            it('只包含中文');

            it('混合中英文');

        });

        describe('格式化日期,按照今天，昨天和其他时间的方式显示#formatTimeRelative', () => {
            it('传入今天的时间戳', () => {
                const clock = sinon.useFakeTimers(new Date(2016, 9, 10).getTime());
                expect(formatTimeRelative(new Date(2016, 9, 10, 0, 0, 0).getTime())).to.equal(__('今天') + ' 00:00:00')
                expect(formatTimeRelative(new Date(2016, 9, 10, 10, 20, 5).getTime())).to.equal(__('今天') + ' 10:20:05')
                expect(formatTimeRelative(new Date(2016, 9, 10, 23, 59, 59).getTime())).to.equal(__('今天') + ' 23:59:59')
                clock.restore();
            });

            it('传入昨天的时间戳', () => {
                const clock = sinon.useFakeTimers(new Date(2016, 9, 10).getTime());
                expect(formatTimeRelative(new Date(2016, 9, 9, 0, 0, 0).getTime())).to.equal(__('昨天') + ' 00:00:00')
                expect(formatTimeRelative(new Date(2016, 9, 9, 12, 5, 3).getTime())).to.equal(__('昨天') + ' 12:05:03')
                expect(formatTimeRelative(new Date(2016, 9, 9, 23, 59, 59).getTime())).to.equal(__('昨天') + ' 23:59:59')
                clock.restore();
            });

            it('传入今天和昨天之外的其他时间戳', () => {
                const clock = sinon.useFakeTimers(new Date(2016, 9, 10).getTime());
                expect(formatTimeRelative(new Date(2016, 9, 8, 23, 59, 59).getTime())).to.equal('2016/10/08 23:59:59')
                expect(formatTimeRelative(new Date(2016, 9, 11, 0, 0, 0).getTime())).to.equal('2016/10/11 00:00:00');
                clock.restore()
            })
        });


    });
})