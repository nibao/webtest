import __ from './locale';

/** 
 * 类型
*/
export enum Type {
    /**
     * 基本件
     */
    Base = 'base',

    /**
     * 用户代理
     */
    UserAgent = 'user-agent',

    /**
     * 节点代理
     */
    NodeAgent = 'node-agent',

    /**
     * 升级代理
     */
    UpgrateAgent = 'upgrade-agent',

    /**
     * 选件
     */
    Opition = 'option',

    /**
     * 第三方选件
     */
    ThirdpartyOpition = 'thirdpartyoption',

    /**
     * 测试授权码
     */
    Test = 'test',

    /**
     * 在线表格用户代理
     */
    ExcelUserAgent = 'excel-user-agent'
}

export const ModelOpitions = {
    //基本件
    '@anyshare/S6020': __('S6020主模块'),
    '@anyshare/RX4020-T1': __('RX4020-T1主模块'),
    '@anyshare/RX4020-T2': __('RX4020-T2主模块'),
    '@anyshare/ASE-Professional': __('ASE-Professional主模块 '),
    '@anyshare/ASE-S': __('ASE-S主模块'),
    '@anyshare/MX8020-T1': __('MX8020-T1主模块'),
    '@anyshare/MX8020-T2': __('MX8020-T2主模块'),
    '@anyshare/ASU-CM': __('ASU-CM主模块'),
    '@anyshare/AS5-Upgrade': __('AnyShare大版本升级模块'),

    //节点代理
    '@anyshare/RX4020-T1-Node': __('RX4020-T1节点模块'),
    '@anyshare/RX4020-T2-Node': __('RX4020-T2节点模块'),
    '@anyshare/ASE-S-Node': __('ASE-S节点模块'),
    '@anyshare/MX8020-T1-Node': __('MX8020-T1节点模块'),
    '@anyshare/MX8020-T2-Node': __('MX8020-T2节点模块'),
    '@anyshare/ASU-S-Node': __('ASU-S节点模块'),

    //升级代理
    '@anyshare/S6020-Upgrade': __('S6020升级模块'),
    '@anyshare/RX4020-T1-Upgrade': __('RX4020-T1升级模块'),
    '@anyshare/RX4020-T2-Upgrade': __('RX4020-T2升级模块'),
    '@anyshare/ASE-Professional-Upgrade': __('ASE-Professional升级模块'),
    '@anyshare/ASE-S-Upgrade': __('ASE-S升级模块'),

    //用户代理
    '@anyshare/S-100-User': __('S-100用户授权包'),
    '@anyshare/S-1000-User': __('S-1000用户授权包'),
    '@anyshare/RX-100-User': __('RX-100用户授权包'),
    '@anyshare/RX-1000-User': __('RX-1000用户授权包'),
    '@anyshare/RX-10000-User': __('RX-10000用户授权包'),
    '@anyshare/RX-Site-User': __('RX用户场地授权包'),
    '@anyshare/ASE-100-User': __('ASE-100用户授权包  '),
    '@anyshare/ASE-1000-User': __('ASE-1000用户授权包'),
    '@anyshare/ASE-10000-User': __('ASE-10000用户授权包'),
    '@anyshare/ASE-Site-User': __('ASE用户场地授权包'),
    '@anyshare/MX-100-User': __('MX-100用户授权包'),
    '@anyshare/MX-1000-User': __('MX-1000用户授权包'),
    '@anyshare/MX-10000-User': __('MX-10000用户授权包'),
    '@anyshare/MX-Site-User': __('MX用户场地授权包'),
    '@anyshare/ASU-100-User': __('ASU-100用户授权包'),
    '@anyshare/ASU-1000-User': __('ASU-1000用户授权包'),
    '@anyshare/ASU-10000-User': __('ASU-10000用户授权包'),
    '@anyshare/ASU-Site-User': __('ASU用户场地授权包'),

    //测试授权码
    '@anyshare/AS-30-Test': __('AnyShare 30天测试授权码'),
    '@anyshare/AS-90-Test': __('AnyShare 90天测试授权码'),
    '@anyshare/AS-180-Test': __('AnyShare 180天测试授权码'),
    '@anyshare/AS-360-Test': __('AnyShare 360天测试授权码'),

    //选件
    '@anyshare/NAS-Option': __('云盘NAS网关选件'),
    '@anyshare/Remote-Disaster-Recovery-Option': __('异地容灾选件'),
    '@anyshare/Take-Over-Disaster-Recovery-Option': __('容灾接管选件'),
    '@anyshare/OSS-Disaster-Recovery-Option': __('对象存储容灾选件'),

    //第三方选件
    'summary.user': __('文档摘要提取正式选件'),
    'keyExtract.user': __('文档关键词提取正式选件'),
    'deepclassifier.user': __('文档智能分类正式选件'),
    'summary.user.test': __('文档摘要提取试用选件'),
    'keyExtract.user.test': __('文档关键词提取试用选件'),
    'deepclassifier.user.test': __('文档智能分类试用选件'),
    'summary.user.invalid': __('文档摘要提取未授权选件'),
    'keyExtract.user.invalid': __('文档关键词提取未授权选件'),
    'deepclassifier.user.invalid': __('文档智能分类未授权选件'),

    //涉密版
    '@anyshare/S6020-ND1': __('S6020-ND1主模块'),
    '@anyshare/RX4020-ND1': __('RX4020-ND1主模块'),
    '@anyshare/NDE-S/base/1/0/-1/-1': __('NDE-S主模块'),

    '@anyshare/RX4020-ND1-Node': __('RX4020-ND1节点模块'),
    '@anyshare/NDE-S-Node': __('NDE-S节点模块'),

    '@anyshare/S6020-ND1-Upgrade': __('S6020-ND1升级模块'),

    '@anyshare/NDS-100-User': __('NDS-100用户授权包 '),
    '@anyshare/NDR-100-User': __('NDR-100用户授权包 '),
    '@anyshare/NDR-1000-User': __('NDR-1000用户授权包'),
    '@anyshare/NDR-10000-User': __('NDR-10000用户授权包'),
    '@anyshare/NDR-Site-User': __('NDR用户场地授权包'),
    '@anyshare/NDE-100-User': __('NDE-100用户授权包'),
    '@anyshare/NDE-1000-User': __('NDE-1000用户授权包'),
    '@anyshare/NDE-10000-User': __('NDE-10000用户授权包'),
    '@anyshare/NDE-Site-User': __('NDE用户场地授权包'),

    //ASC
    '@anyshare/ASC-Standard': __('AnyShare Cloud 标准版云服务授权码'),
    '@anyshare/ASC-Custom': __('AnyShare Cloud 定制版云服务授权码'),

    //在线表格
    '@anyshare/AS-Excel': __('AnyShare在线表格主模块'),
    '@anyshare/Excel-50-User': __('在线表格50用户授权包'),
    '@anyshare/Excel-100-User': __('在线表格100用户授权包'),
    '@anyshare/Excel-200-User': __('在线表格200用户授权包'),
    '@anyshare/Excel-500-User': __('在线表格500用户授权包'),
    '@anyshare/Excel-1000-User': __('在线表格1000用户授权包'),
    '@anyshare/Excel-2000-User': __('在线表格2000用户授权包'),
    '@anyshare/Excel-5000-User': __('在线表格5000用户授权包'),
}