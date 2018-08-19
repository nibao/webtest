import { ESearchMgnt } from '../thrift';


/**
 * 卸载全文检索业务
 * 在卸载出错，或已卸载的情况下，均支持再次卸载
 * @param isDelete: 是否清除原有数据,True为清除 否则不清除
 */
export const unInstall: Core.ESearchMgnt.Uninstall = function([isDelete]) {
    return ESearchMgnt('Uninstall', [isDelete]);
}