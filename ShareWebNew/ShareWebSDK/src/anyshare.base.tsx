import { assign, noop } from 'lodash';
import { setup as setupOpenAPI } from '../core/openapi/openapi';
import { buildLinkHref as buildLink } from '../core/linkconfig/linkconfig';
import { apply as applySkin } from '../core/skin/skin';
import { applyOEMImage } from '../core/oem/oem';
import { login, loginByParams as thirdLogin, extLogin } from '../core/auth/auth';
import *  as upload from '../core/upload/upload'
import * as download from '../core/download/download'
import i18nCore from '../core/i18n';
import i18nUI from '../ui/i18n';
import i18nComponents from '../components/i18n';
import { createStandaloneComponent } from './helper';

interface Settings {
    /**
     * 语言
     */
    locale?: string;

    /**
     * 访问地址
     */
    host?: string;

    /**
     * 权限控制服务端口
     */
    EACPPort?: number;

    /**
     * 文档访问服务端口
     */
    EFSPPort?: number;

    /**
     * 用户id
     */
    userid?: string | Function;

    /**
     * 会话token
     */
    tokenid?: string | Function;

    /**
     * 网络中断时触发
     */
    onNetworkError?: () => any;

    /**
     * token超时时触发
     */
    onTokenExpire?: () => any;

    /**
     * 用户被禁用
     */
    onUserDisabled?: () => any;

    /**
     * 设备被禁用时触发
     */
    onDeviceForbid?: () => any;

    /**
     * 设备绑定时触发
     */
    onDeviceBind?: () => any;

    /**
     * ip端绑定时触发
     */
    onIPSegment?: () => any;

    /**
     * 内外网切换触发
     */
    onNetWorkChange?: () => any;

    /**
     * 服务器资源不足
     */
    onResourcesNotEnough?: () => any;

    /**
     * Asc当前登录用户未实名认证
     */
    onUserRealNameRequired?: () => any;

    /**
     * Asc创建者未实名认证
     */
    onCreatorRealNameRequired?: () => any;
}

export default function AnyShareFactory({ Components = {}, OpenAPI = {} }) {
    const AnyShare = function ({ locale = 'en-us', host, EACPPort, EFSPPort, onNetworkError = noop, onTokenExpire = noop, onUserDisabled = noop, onDeviceForbid = noop, onDeviceBind = noop, onIPSegment = noop, onNetWorkChange = noop, onResourcesNotEnough = noop, onUserRealNameRequired = noop, onCreatorRealNameRequired = noop, userid, tokenid }: Settings = {}) {
        i18nUI.setup({ locale });
        i18nCore.setup({ locale });
        i18nComponents.setup({ locale });
        setupOpenAPI({ host, EACPPort, EFSPPort, onNetworkError, onTokenExpire, onUserDisabled, onDeviceForbid, onDeviceBind, onIPSegment, onNetWorkChange, onResourcesNotEnough, onUserRealNameRequired, onCreatorRealNameRequired, userid, tokenid });
        applySkin();
        applyOEMImage();

        return {
            Core: {
                login,
                thirdLogin,
                extLogin,
                buildLink,
                upload,
                download
            },
            OpenAPI,
            Components: assign({}, Components, (_objectValue, sourceComponent) => createStandaloneComponent(sourceComponent))
        }
    }

    return AnyShare;
}