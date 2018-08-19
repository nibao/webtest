import { expect } from 'chai';
import { first, last } from 'lodash';
import * as sinon from 'sinon'
import { generateDaysOfMonth, generateWeeksOfMonth, generateWeekDays, getUTCTime, startOfDay, endOfDay, clock, today } from './date';

describe('ShareWebUtil', () => {
    describe('date', () => {

        describe('根据年／月构建当月所有日期的日期对象#generateDaysOfMonth', () => {
            it('返回的是日期对象构成的数组', () => {
                const sep = generateDaysOfMonth(2016, 9);
                expect(sep).to.be.an('array').that.have.lengthOf(30);
                expect(first(sep)).to.be.an.instanceOf(Date);
            });

            it('月份包含31天,正确构建日期对象', () => {
                const sep = generateDaysOfMonth(2016, 1);
                expect(first(sep).getFullYear()).to.equal(2016);
                expect(first(sep).getMonth()).to.equal(0);
                expect(first(sep).getDate()).equal(1);
                expect(last(sep).getDate()).equal(31);
            });

            it('月份包含30天,正确构建日期对象', () => {
                const sep = generateDaysOfMonth(2016, 9);
                expect(first(sep).getFullYear()).to.equal(2016);
                expect(first(sep).getMonth()).to.equal(8);
                expect(first(sep).getDate()).equal(1);
                expect(last(sep).getDate()).equal(30);
            });

            it('传入月份包含29天,正确构建日期对象', () => {
                const sep = generateDaysOfMonth(2000, 2);
                expect(first(sep).getFullYear()).to.equal(2000);
                expect(first(sep).getMonth()).to.equal(1);
                expect(first(sep).getDate()).equal(1);
                expect(last(sep).getDate()).equal(29);
            });

            it('传入月份包含28天,正确构建日期对象', () => {
                const sep = generateDaysOfMonth(2005, 2);
                expect(first(sep).getFullYear()).to.equal(2005);
                expect(first(sep).getMonth()).to.equal(1);
                expect(first(sep).getDate()).equal(1);
                expect(last(sep).getDate()).equal(28);
            });

        });


        describe('构造星期数组#generateWeekDays', () => {
            it('返回的数组长度为7', () => {
                expect(generateWeekDays()).to.be.an('array').that.have.lengthOf(7);
                expect(generateWeekDays(1)).to.be.an('array').that.have.lengthOf(7);
            })

            it('星期数组顺序正确', () => {
                expect(generateWeekDays()).deep.equal([0, 1, 2, 3, 4, 5, 6]);
                expect(generateWeekDays(1)).deep.equal([1, 2, 3, 4, 5, 6, 0]);
                expect(generateWeekDays(6)).deep.equal([6, 0, 1, 2, 3, 4, 5]);
            });

        });


        describe('构建日期Matrix#generateWeeksOfMonth', () => {
            it('获得按周分割的日期对象数组', () => {
                const matrix = generateWeeksOfMonth(2016, 9);
                expect(matrix).have.length(5);
                expect(matrix[0][4].getDate()).equal(1);
                expect(matrix[4][5].getDate()).equal(30);
            });

            it('支持设定任意天为一周首日', () => {
                const matrix = generateWeeksOfMonth(2016, 9, 1);
                expect(matrix).have.length(5);
                expect(matrix[0][3].getDate()).equal(1);
                expect(matrix[4][4].getDate()).equal(30);
            });

        });


        describe('#getUTCTime', () => {
            describe('非ISO 8601标准时间字符串', () => {

                it('传入 年-月-日 时:分:秒', () => {
                    expect(getUTCTime('2017-2-28 00:30:01')).equal(Date.UTC(2017, 1, 28, 0, 30, 1));
                });

                it('传入日期字符串不包含 时:分:秒,正确返回当天00:00:00的对应时间戳', () => {
                    expect(getUTCTime('10/20/2016')).equal(Date.UTC(2016, 9, 20, 0, 0, 0));
                    expect(getUTCTime('2012.08.04')).equal(Date.UTC(2012, 7, 4, 0, 0, 0));

                })

                it('传入日期字符串包含 时:分:秒,返回对应日期对应时间的时间戳', () => {
                    expect(getUTCTime('1/26/2016 11:30:00')).equal(Date.UTC(2016, 0, 26, 11, 30, 0));
                    expect(getUTCTime('2016.03.02 11:30:00')).equal(Date.UTC(2016, 2, 2, 11, 30, 0));
                })
            });

            describe('ISO 8601标准时间（例：2016-10-20 或 2017-2-28 00:30:01 或 2017-12-11T14:50:55+08:00）', () => {
                describe('简单日期字符串（不含时区信息）', () => {
                    it('传入 年-月-日', () => {
                        expect(getUTCTime('2016-10-20')).equal(Date.UTC(2016, 9, 20, 0, 0, 0));
                    });
                });

                describe('带日期偏移量的日期字符串', () => {
                    it('日期偏移量为+时，正确换算', () => {
                        expect(getUTCTime('2017-12-11T14:50:55+08:00')).equal(Date.UTC(2017, 11, 11, 14 - 8, 50, 55));
                    });

                    it('日期偏移量为-时，正确换算', () => {
                        expect(getUTCTime('2017-12-11T14:50:55-08:00')).equal(Date.UTC(2017, 11, 11, 14 + 8, 50, 55));
                    });
                });
            });

        })


        describe('获取某一天的00:00:00:000 #startOfDay', () => {
            describe('不指定日期(默认当前日期)', () => {
                it('使用UTC时间(默认)，返回当天的00:00:00:000 的UTC毫秒值', () => {
                    const clock = sinon.useFakeTimers(new Date(2016, 9, 10).getTime());
                    expect(startOfDay()).to.be.equal(Date.UTC(2016, 9, 10, 0, 0, 0, 0));
                    clock.restore();
                });
            });

            describe('使用指定日期', () => {
                it('使用UTC时间（默认），返回对应日期00：00：00:000 的UTC毫秒值', () => {
                    expect(startOfDay(new Date(2016, 9, 10))).to.be.equal(Date.UTC(2016, 9, 10, 0, 0, 0, 0));
                });
                it('使用GMT时间，返回对应日期00：00：00:000 的GMT毫秒值', () => {
                    expect(startOfDay(new Date(2016, 9, 10), { type: 'GMT' })).to.be.equal(new Date(2016, 9, 10, 0, 0, 0, 0).getTime());
                });
            });


        });


        describe('获取某一天的23:59:59:999 #endOfDay', () => {
            describe('不指定日期(默认当前日期)', () => {
                it('使用UTC时间（默认），返回当天的23:59:59:999 的UTC毫秒值', () => {
                    const clock = sinon.useFakeTimers(new Date(2016, 9, 10).getTime());
                    expect(endOfDay()).to.be.equal(Date.UTC(2016, 9, 10, 23, 59, 59, 999));
                    clock.restore();
                });
            });

            describe('指定日期', () => {
                it('使用UTC时间，返回对应日期23:59:59:999 的UTC毫秒值', () => {
                    expect(endOfDay(new Date(2016, 9, 10))).to.be.equal(Date.UTC(2016, 9, 10, 23, 59, 59, 999));
                });
                it('使用GMT时间，返回对应日期23:59:59:999 的GMT毫秒值', () => {
                    expect(endOfDay(new Date(2016, 9, 10), { type: 'GMT' })).to.be.equal(new Date(2016, 9, 10, 23, 59, 59, 999).getTime());
                });
            });
        });


        describe('根据秒数计算时分秒时钟#clock', () => {
            it('传入<60的秒数', () => {
                expect(clock(59)).to.deep.equal({ hours: 0, minutes: 0, seconds: 59 })
            });

            it('传入=60的秒数', () => {
                expect(clock(60)).to.deep.equal({ hours: 0, minutes: 1, seconds: 0 })
            });

            it('传入=3599的秒数', () => {
                expect(clock(3599)).to.deep.equal({ hours: 0, minutes: 59, seconds: 59 })
            });

            it('传入=3600的秒数', () => {
                expect(clock(3600)).to.deep.equal({ hours: 1, minutes: 0, seconds: 0 })
            });

            it('传入>3600的秒数', () => {
                expect(clock(3601)).to.deep.equal({ hours: 1, minutes: 0, seconds: 1 })
            });

        });


        describe('构建今天日期对象，设定为当天23:59:59#today', () => {
            it('返回当天23:59:59的日期对象', () => {
                const clock = sinon.useFakeTimers(new Date(2016, 9, 10).getTime())
                expect(today()).to.be.an.instanceOf(Date);
                expect(today()).to.deep.equal(new Date(2016, 9, 10, 23, 59, 59));
                clock.restore();
            });
        });


    })
})