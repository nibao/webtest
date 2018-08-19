import { setup as setupThrift } from '../core/thrift/thrift';
import { setup as setupLog } from '../core/log/log';
import { apply as applySkin } from '../core/skin/skin';
import { applyOEMImage } from '../core/oem/oem';
import i18nCore from '../core/i18n';
import i18nUI from '../ui/i18n';
import i18nConsole from '../console/i18n';
import { createStandaloneComponent, createStandaloneUI } from './helper';
import ComboArea from '../ui/ComboArea/ui.desktop';
import OrgManager from '../console/OrgManager/component.desktop';
import ThirdConfig from '../console/ThirdConfig/component';
import SecurityIntegration from '../console/SecurityIntegration/component.view';
import DocWatermark from '../console/DocWatermark/component.view';
import LinkShareTemplate from '../console/LinkShareTemplate/component.view';
import ShareTemplate from '../console/ShareTemplate/component.desktop';
import DocTagConfig from '../console/DocTagConfig/component.view';
import DocLibAccess from '../console/DocLibAccess/component.view';
import BindingQuery from '../console/BindingQuery/component.view';
import EmailConfig from '../console/EmailConfig/component.desktop';
import DownloadLimit from '../console/DownloadLimit/component.desktop';
import DictManagement from '../console/DocSecurity.Dict/component.view';
import IllegalDocSeparation from '../console/DocSecurity.Separation/component.view';
import DeleteUser from '../console/DeleteUser/component.view';
import MoveUser from '../console/MoveUser/component.view';
import RemoveUser from '../console/RemoveUser/component.view';
import CMPConfig from '../console/CMPConfig/component.view';
import CsfCheck from '../console/CsfCheck/component.view';
import EnableUser from '../console/EnableUser/component.view';
import DisableUser from '../console/DisableUser/component.view';
import LinkShareRetain from '../console/LinkShareRetain/component.view';
import DeviceBind from '../console/DeviceBind/component.view';
import SetUsersFreezeStatus from '../console/SetUsersFreezeStatus/component.view';
import UserAgreementConfig from '../console/UserAgreementConfig/component.desktop';
import DocRetain from '../console/DocRetain/component.view';
import SharedVisibility from '../console/SharedVisibility/component.view';
import CaptchaConfig from '../console/CaptchaConfig/component.view';
import CaptchaBox from '../console/CaptchaBox/component.view';
import DocListSite from '../console/DocListSite/component.view';
import FileConflictConfig from '../console/FileConflictConfig/component.desktop';
import ExportLog from '../console/ExportLog/component.view';
import UploadLimitation from '../console/UploadLimitation/component.view';
import EditSystemManager from '../console/EditSystemManager/component.view';
import DocAccessSet from '../console/DocAccessSet/component.view';
import MessageSwitch from '../console/MessageSwitch/component.view';
import ChangePassword from '../console/ChangePassword/component.view';
import FileFlow from '../console/FileFlow/component.view';
import EnableDisk from '../console/EnableDisk/component.view';
import About from '../console/About/component.view';
import MSGConfig from '../console/MSGConfig/component.view';
import LimitRate from '../console/LimitRate/component.view';
import MonthActivity from '../console/MonthActivity/component.view';
import YearActivity from '../console/YearActivity/component.view';
import OperationsMail from '../console/OperationsMail/component.view';
import DisplayManager from '../console/DisplayManager/component.view'
import ImportOrganization from '../console/ImportOrganization/component.view';

interface Settings {

  locale?: string; // 语言

  proxyTemplate?: string; // 代理地址模板

  CSRFToken: () => string | string; // CSRFToken
}

module.exports = function ({ locale = 'en-us', proxyTemplate, CSRFToken }: Settings) {

  i18nCore.setup({ locale });
  i18nUI.setup({ locale });
  i18nConsole.setup({ locale });
  setupThrift({ proxyTemplate, CSRFToken });
  setupLog({ CSRFToken });
  applySkin();
  applyOEMImage();

  return {
    Components: {
      OrgManager: createStandaloneComponent(OrgManager),
      ThirdConfig: createStandaloneComponent(ThirdConfig),
      SecurityIntegration: createStandaloneComponent(SecurityIntegration),
      DocWatermark: createStandaloneComponent(DocWatermark),
      LinkShareTemplate: createStandaloneComponent(LinkShareTemplate),
      ShareTemplate: createStandaloneComponent(ShareTemplate),
      DocTagConfig: createStandaloneComponent(DocTagConfig),
      DocLibAccess: createStandaloneComponent(DocLibAccess),
      BindingQuery: createStandaloneComponent(BindingQuery),
      EmailConfig: createStandaloneComponent(EmailConfig),
      DownloadLimit: createStandaloneComponent(DownloadLimit),
      DictManagement: createStandaloneComponent(DictManagement),
      IllegalDocSeparation: createStandaloneComponent(IllegalDocSeparation),
      DeleteUser: createStandaloneComponent(DeleteUser),
      MoveUser: createStandaloneComponent(MoveUser),
      RemoveUser: createStandaloneComponent(RemoveUser),
      CMPConfig: createStandaloneComponent(CMPConfig),
      CsfCheck: createStandaloneComponent(CsfCheck),
      EnableUser: createStandaloneComponent(EnableUser),
      DisableUser: createStandaloneComponent(DisableUser),
      LinkShareRetain: createStandaloneComponent(LinkShareRetain),
      DeviceBind: createStandaloneComponent(DeviceBind),
      SetUsersFreezeStatus: createStandaloneComponent(SetUsersFreezeStatus),
      UserAgreementConfig: createStandaloneComponent(UserAgreementConfig),
      DocRetain: createStandaloneComponent(DocRetain),
      SharedVisibility: createStandaloneComponent(SharedVisibility),
      CaptchaConfig: createStandaloneComponent(CaptchaConfig),
      CaptchaBox: createStandaloneComponent(CaptchaBox),
      DocListSite: createStandaloneComponent(DocListSite),
      FileConflictConfig: createStandaloneComponent(FileConflictConfig),
      ExportLog: createStandaloneComponent(ExportLog),
      UploadLimitation: createStandaloneComponent(UploadLimitation),
      EditSystemManager: createStandaloneComponent(EditSystemManager),
      DocAccessSet: createStandaloneComponent(DocAccessSet),
      MessageSwitch: createStandaloneComponent(MessageSwitch),
      ChangePassword: createStandaloneComponent(ChangePassword),
      FileFlow: createStandaloneComponent(FileFlow),
      EnableDisk: createStandaloneComponent(EnableDisk),
      About: createStandaloneComponent(About),
      MSGConfig: createStandaloneComponent(MSGConfig),
      LimitRate: createStandaloneComponent(LimitRate),
      MonthActivity: createStandaloneComponent(MonthActivity),
      YearActivity: createStandaloneComponent(YearActivity),
      OperationsMail: createStandaloneComponent(OperationsMail),
      DisplayManager: createStandaloneComponent(DisplayManager),
      ImportOrganization: createStandaloneComponent(ImportOrganization),
    },
    UI: {
      ComboArea: createStandaloneUI(ComboArea)
    }
  }
}