import { expect } from 'chai';
import { noop } from 'lodash';
import session from '../../util/session/session';
import { useFakeXHR } from '../../libs/fake-server-factory';

import {
    setup,
    loginLog,
    OperationOps,
    Level,
    LogType,
    manageLog,
    operationLog
} from './log';
import { queryString } from '../../util/http/http';

describe('ShareWebCore', () => {
    describe('log', () => {
        before('mock session', () => {
            session.set('userid', '273280ba-d0b6-11e7-a79f-005056af1712');
            setup({ CSRFToken: 'CSRFToken' });
        });
        after('清除session,恢复配置', () => {
            session.clear();
            setup({ CSRFToken: noop });
        });

        describe('记录日志#log', () => {
            // 没有默认导出，使用loginLog测试
            it('默认参数调用', done => {
                useFakeXHR((request, restore) => {
                    loginLog(OperationOps.ALL);
                    expect(request[0].url).to.equal('/api/EACPLog/Log');
                    expect(request[0].requestBody).to.equal(
                        queryString({
                            logtype: LogType.NCT_LT_LOGIN,
                            optype: OperationOps.ALL,
                            msg: '',
                            exmsg: '',
                            loglevel: Level.INFO,
                            userid: '273280ba-d0b6-11e7-a79f-005056af1712'
                        })
                    );
                    expect(request[0].requestHeaders['X-CSRFToken']).to.equal(
                        'CSRFToken'
                    );
                    restore();
                    done();
                });
            });

            it('自定义参数调用', done => {
                useFakeXHR((request, restore) => {
                    loginLog(
                        OperationOps.ALL,
                        'msg',
                        'exmsg',
                        Level.WARN,
                        'userid'
                    );
                    expect(request[0].url).to.equal('/api/EACPLog/Log');
                    expect(request[0].requestBody).to.equal(
                        queryString({
                            logtype: LogType.NCT_LT_LOGIN,
                            optype: OperationOps.ALL,
                            msg: 'msg',
                            exmsg: 'exmsg',
                            loglevel: Level.WARN,
                            userid: 'userid'
                        })
                    );
                    expect(request[0].requestHeaders['X-CSRFToken']).to.equal(
                        'CSRFToken'
                    );
                    restore();
                    done();
                });
            });
        });

        it('登录日志#loginLog', done => {
            useFakeXHR((request, restore) => {
                loginLog(OperationOps.ALL, 'msg', 'exmsg', Level.ALL);
                expect(request[0].url).to.equal('/api/EACPLog/Log');
                expect(request[0].requestBody).to.equal(
                    queryString({
                        logtype: LogType.NCT_LT_LOGIN,
                        optype: OperationOps.ALL,
                        msg: 'msg',
                        exmsg: 'exmsg',
                        loglevel: Level.ALL,
                        userid: '273280ba-d0b6-11e7-a79f-005056af1712'
                    })
                );
                expect(request[0].requestHeaders['X-CSRFToken']).to.equal(
                    'CSRFToken'
                );
                restore();
                done();
            });
        });

        it('管理日志#manageLog', done => {
            useFakeXHR((request, restore) => {
                manageLog(OperationOps.ALL, 'msg', 'exmsg', Level.ALL);
                expect(request[0].url).to.equal('/api/EACPLog/Log');
                expect(request[0].requestBody).to.equal(
                    queryString({
                        logtype: LogType.NCT_LT_MANAGEMENT,
                        optype: OperationOps.ALL,
                        msg: 'msg',
                        exmsg: 'exmsg',
                        loglevel: Level.ALL,
                        userid: '273280ba-d0b6-11e7-a79f-005056af1712'
                    })
                );
                expect(request[0].requestHeaders['X-CSRFToken']).to.equal(
                    'CSRFToken'
                );

                restore();
                done();
            });
        });

        it('操作日志#operationLog', done => {
            useFakeXHR((request, restore) => {
                operationLog(OperationOps.ALL, 'msg', 'exmsg', Level.ALL);
                expect(request[0].url).to.equal('/api/EACPLog/Log');
                expect(request[0].requestBody).to.equal(
                    queryString({
                        logtype: LogType.NCT_LT_OPEARTION,
                        optype: OperationOps.ALL,
                        msg: 'msg',
                        exmsg: 'exmsg',
                        loglevel: Level.ALL,
                        userid: '273280ba-d0b6-11e7-a79f-005056af1712'
                    })
                );
                expect(request[0].requestHeaders['X-CSRFToken']).to.equal(
                    'CSRFToken'
                );
                restore();
                done();
            });
        });
    });
});
