import { expect } from 'chai';
import * as sinon from 'sinon';
import { sandboxStub } from '../../libs/test-helper'

import * as file from '../apis/efshttp/file/file';
import * as user from '../apis/eachttp/user/user';
import * as config from '../config/config';

import * as csf from './csf';

const sandbox = sinon.createSandbox();
describe('ShareWebCore', () => {
    describe('csf', () => {
        describe('查询用户对某个文件的密级是否足够#checkCsfLevel', () => {
            beforeEach('stub rsa模块下的rsaEncrypt函数', () => {
                sandboxStub(sandbox, [{ moduleObj: user, moduleProp: 'get' }, { moduleObj: file, moduleProp: 'attribute' }])
            })
            afterEach('restore stub', () => {
                sandbox.restore()
            })

            it('用户密级大于文件密级：返回true', () => {
                user.get.resolves({ csflevel: 5 });
                file.attribute.resolves({ csflevel: 4 });
                return csf.checkCsfLevel('gns://25708DD3FA0B43CD9DF3A91904F680A0/63A1279867364D888BED40AC655B78F8').then((res) => {
                    expect(res).to.be.true
                })
            })

            it('用户密级等于文件密级：返回true', () => {
                user.get.resolves({ csflevel: 5 });
                file.attribute.resolves({ csflevel: 5 });
                return csf.checkCsfLevel('gns://25708DD3FA0B43CD9DF3A91904F680A0/63A1279867364D888BED40AC655B78F8').then((res) => {
                    expect(res).to.be.true
                })
            })

            it('用户密级小于文件密级：返回false', (done) => {
                user.get.resolves({ csflevel: 4 });
                file.attribute.resolves({ csflevel: 5 });
                csf.checkCsfLevel('gns://25708DD3FA0B43CD9DF3A91904F680A0/63A1279867364D888BED40AC655B78F8').then((res) => {
                    expect(res).to.be.false
                    done();
                })
            });
        });

        describe('标密系统ID#CSFSYSID', () => {
            it('正确导出标密系统ID', () => {
                expect(csf.CSFSYSID).to.deep.equal(
                    {
                        // 时代亿信
                        SDYX: '7270a9fb-ce86-400f-8c0c-7d48b5790b1b',
                        // 706所
                        706: '04d468ec-972c-4c90-adfc-e7651de139d8',
                        // AS
                        ANYSHARE: 'b937b8e3-169c-4bee-85c5-865b03d8c29a'
                    }
                )
            });
        });


        describe('判断文件是否未定密#checkCsfIsNull', () => {
            beforeEach('stub rsa模块下的rsaEncrypt函数', () => {
                sandboxStub(sandbox, [{ moduleObj: config, moduleProp: 'getConfig' }, { moduleObj: file, moduleProp: 'getAppmetadata' }])

            })
            afterEach('restore stub', () => {
                sandbox.restore()
            })

            it('未开启第三方配置（未返回third_csfsys_config字段）：返回false', () => {
                config.getConfig.resolves({});
                return csf.checkCsfIsNull({ docid: 'gns://25708DD3FA0B43CD9DF3A91904F680A0/63A1279867364D888BED40AC655B78F8' }).then((res) => {
                    expect(file.getAppmetadata.called).to.be.false;
                    expect(res).to.be.false;
                })
            });

            it('对接中申办,应用元数据不存在：返回false', () => {
                config.getConfig.resolves({
                    id: csf.CSFSYSID.SDYX
                });
                file.getAppmetadata.resolves([])
                return csf.checkCsfIsNull({ docid: 'gns://25708DD3FA0B43CD9DF3A91904F680A0/63A1279867364D888BED40AC655B78F8' }).then((res) => {
                    expect(file.getAppmetadata.calledWith({ docid: 'gns://25708DD3FA0B43CD9DF3A91904F680A0/63A1279867364D888BED40AC655B78F8', appid: csf.CSFSYSID.SDYX })).to.be.true
                    expect(res).to.be.false;
                })
            });

            it('对接8511,应用元数据不存在：返回false', () => {
                config.getConfig.resolves({
                    id: csf.CSFSYSID['706']
                });
                file.getAppmetadata.resolves([])
                return csf.checkCsfIsNull({ docid: 'gns://25708DD3FA0B43CD9DF3A91904F680A0/63A1279867364D888BED40AC655B78F8' }).then((res) => {
                    expect(file.getAppmetadata.calledWith({ docid: 'gns://25708DD3FA0B43CD9DF3A91904F680A0/63A1279867364D888BED40AC655B78F8', appid: csf.CSFSYSID['706'] })).to.be.true
                    expect(res).to.be.false;
                })
            });

            it('未开启第三方配置，appmetadata.classification_info存在：返回false', () => {
                config.getConfig.resolves({
                    id: csf.CSFSYSID['706']
                });
                file.getAppmetadata.resolves([{ "appmetadata": '{ "classification_info": "aaa" }' }])
                return csf.checkCsfIsNull({ docid: 'gns://25708DD3FA0B43CD9DF3A91904F680A0/63A1279867364D888BED40AC655B78F8' }).then((res) => {
                    expect(file.getAppmetadata.calledWith({ docid: 'gns://25708DD3FA0B43CD9DF3A91904F680A0/63A1279867364D888BED40AC655B78F8', appid: csf.CSFSYSID['706'] })).to.be.true
                    expect(res).to.be.false;
                })
            })

            it('未开启第三方配置，appmetadata.classification_info不存在：返回true', () => {
                config.getConfig.resolves({
                    id: csf.CSFSYSID['706']
                });
                file.getAppmetadata.resolves([{ "appmetadata": '{}' }])
                return csf.checkCsfIsNull({ docid: 'gns://25708DD3FA0B43CD9DF3A91904F680A0/63A1279867364D888BED40AC655B78F8' }).then((res) => {
                    expect(file.getAppmetadata.calledWith({ docid: 'gns://25708DD3FA0B43CD9DF3A91904F680A0/63A1279867364D888BED40AC655B78F8', appid: csf.CSFSYSID['706'] })).to.be.true
                    expect(res).to.be.true;
                })
            })
        });

    });
})