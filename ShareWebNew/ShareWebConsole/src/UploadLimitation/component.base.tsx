import * as React from 'react';
import { uniq } from 'lodash';
import WebComponent from '../webcomponent';
import { GetFileSuffixLimit, SetFileSuffixLimit } from '../../core/thrift/evfs/evfs';
import { isSuffix } from '../../util/validators/validators';
import { manageLog, Level, ManagementOps } from '../../core/log/log';   //  WARN SET
import __ from './locale';

enum ValidateState {
    /**
     * 正常状态
     */
    Ok,

    /**
     * 没有设默认权限
     */
    ErrLength,

    /**
     * 空值
     */
    ErrEmpty,

    /**
     * 特殊字符或输入扩展名的格式不符
     */
    ErrType
}

enum TypeName {
    /**
     * 文档类文件
     */
    Docs = 1,

    /**
     * 音视频类文件
     */
    Videos = 2,

    /**
     * 图片类文件
     */
    Images = 3,

    /**
     * 压缩类
     */
    Compression = 4,

    /**
     * 可疑类
     */
    Suspicion = 5,

    /**
     * 病毒类
     */
    Viruses = 6,

    /**
     * 其他文件
     */
    Others = 7,
}

export enum IndexOfConfigType {
    /**
     * 文档类文件索引
     */
    Docs = 0,

    /**
     * 音视频类文件索引
     */
    Videos = 1,

    /**
     * 图片类文件索引
     */
    Images = 2,

    /**
     * 压缩类索引
     */
    Compression = 3,

    /**
     * 可疑类索引
     */
    Suspicion = 4,

    /**
     * 病毒类索引
     */
    Viruses = 5,

    /**
     * 其他文件索引
     */
    Others = 6
}

export default class UploadLimitation extends WebComponent<Console.UploadLimitation.Props, Console.UploadLimitation.State> {
    // ValidateState状态
    static ValidateState = ValidateState;
    // 文档类型TypeName
    static TypeName = TypeName;
    // 初始状态
    defaultConfig = [];

    state = {
        config: [],
        visible: false,
        validateStatus: {
            [TypeName.Docs]: ValidateState.Ok,
            [TypeName.Videos]: ValidateState.Ok,
            [TypeName.Images]: ValidateState.Ok,
            [TypeName.Compression]: ValidateState.Ok,
            [TypeName.Suspicion]: ValidateState.Ok,
            [TypeName.Viruses]: ValidateState.Ok,
            [TypeName.Others]: ValidateState.Ok,
        }
    }

    async componentWillMount() {
        const defaultConfig = await GetFileSuffixLimit();
        this.defaultConfig = defaultConfig;
        this.setState({
            config: defaultConfig
        })
    }

    /**
     * 文档类型选中状态切换
     * @param fileType: 文档类型
     * @param checked: 文档类型选中状态
     */
    protected checkStatus(fileType, checked) {
        const { config } = this.state;
        let confNew = [];
        if (checked) {
            confNew = config.map(conf => {
                return conf.suffixType === fileType ?
                    { ...conf, denyFlag: checked }
                    : conf
            })
        } else {
            const defaultVal = this.defaultConfig[IndexOfConfigType[TypeName[fileType]]].suffixes
            confNew = config.map(conf => {
                return conf.suffixType === fileType ?
                    { ...conf, denyFlag: checked, suffixes: defaultVal }
                    : conf
            })
            this.setState({
                validateStatus: {
                    ...this.state.validateStatus,
                    [fileType]: ValidateState.Ok
                }
            })
        }

        this.setState({
            config: confNew,
            visible: true
        })
    }

    /**
     * 文档值改变
     * @param fileType: 文档类型
     * @param value: 新值
     */
    protected valueChanged(fileType, val) {
        const confNew = this.state.config.map(conf => {
            return conf.suffixType === fileType ?
                { ...conf, suffixes: val }
                : conf
        })
        if (this.state.validateStatus[fileType] !== ValidateState.Ok) {
            this.setState({
                validateStatus: {
                    ...this.state.validateStatus,
                    [fileType]: this.setValistates(val)
                }
            })
        }
        this.setState({
            config: confNew,
            visible: true
        })
    }

    /**
     * 保存
     */
    protected async handleSave() {
        const status = this.state.config.map(conf => {
            if (conf.denyFlag) {
                return this.setValistates(conf.suffixes)
            } else {
                return ValidateState.Ok
            }
        })
        const statu = this.arrToObj(status);

        const confNew = this.state.config.map(conf => {
            return { ...conf, suffixes: this.deduplication(conf.suffixes) }
        })

        if (this.statusPerfect(status)) {
            try {
                await SetFileSuffixLimit([confNew.map(conf => {
                    return {
                        'ncTLimitSuffixDoc': conf
                    }
                })]);
                this.loging();
                this.setState({
                    visible: false,
                    config: confNew
                })
                this.defaultConfig = this.state.config
            } catch (error) {

            }
        } else {
            this.setState({
                validateStatus: { ...statu }
            })
        }
    }
    /**
    * 取消
    */
    protected handleCancel() {
        this.setState({
            visible: false,
            config: this.defaultConfig,
            validateStatus: {
                [TypeName.Docs]: ValidateState.Ok,
                [TypeName.Videos]: ValidateState.Ok,
                [TypeName.Images]: ValidateState.Ok,
                [TypeName.Compression]: ValidateState.Ok,
                [TypeName.Suspicion]: ValidateState.Ok,
                [TypeName.Viruses]: ValidateState.Ok,
                [TypeName.Others]: ValidateState.Ok,
            }
        })
    }

    /**
    * 获取state里的falg的值
    * @param fileType: 文件类型
    */
    protected getFlag(fileType) {
        this.state.config.forEach(conf => {
            if (conf.suffixType === fileType) {
                return conf.denyFlag;
            }
        });
    }


    /**
    * 获取state里的Suffixes的值
    * @param fileType: 文件类型
    */
    protected getSuffixes(fileType) {
        this.state.config.forEach(conf => {
            if (conf.suffixType === fileType) {
                return conf.suffixes;
            }
        });
    }

    /**
     * 将对象转化为数组
     *  * @param arr: 原始数组
     */
    private arrToObj(arr) {
        let obj = {};
        arr.forEach((ele, keys) => {
            obj[keys + 1] = ele
        });
        return obj;
    }
    /**
     * 记录日志
     */
    private loging() {
        this.state.config.forEach((conf, index) => {
            if (conf.denyFlag !== this.defaultConfig[index].denyFlag || conf.suffixes !== this.defaultConfig[index].suffixes) {
                manageLog(
                    ManagementOps.SET,
                    __('${switch} 不允许 ${suffixType} 上传成功。', {
                        switch: conf.denyFlag ? __('启用') : __('取消'),
                        suffixType: this.getSuffixTypeName(IndexOfConfigType[index])
                    }),
                    null,
                    Level.WARN
                )
            }
        })
    }
    /**
   * 由键值到处汉字
   * @param key: 键值
   */
    private getSuffixTypeName(key) {
        switch (TypeName[key]) {
            case TypeName.Docs:
                return __('文档类');

            case TypeName.Videos:
                return __('音频/视频');

            case TypeName.Images:
                return __('图片');

            case TypeName.Compression:
                return __('压缩包');

            case TypeName.Suspicion:
                return __('可疑文件');

            case TypeName.Viruses:
                return __('病毒文件');

            case TypeName.Others:
                return __('其他');
        }
    }

    /**
     * 看是否所有状态是否都合法
     *  * @param status: 状态值
     */
    private statusPerfect(status) {
        return status.every((item) => item === ValidateState.Ok)
    }

    // 验证文件后缀名
    private setValistates(str) {
        // 是否为空字符串''
        if (str.trim() === '') {
            return ValidateState.ErrEmpty
        }
        const arr = str.match(/\S+/g);
        // 如果长度超过300或字符长度超过20
        if (!arr.every(ele => isSuffix(ele))) {
            return ValidateState.ErrType
        }
        // 如果长度超过300或字符长度超过20
        if (arr.length > 300 || arr.some(ele => ele.length >= 20)) {
            return ValidateState.ErrLength
        }
        // 正常
        return ValidateState.Ok
    }

    /**
     * 字符串去重
     */
    private deduplication(str) {
        const arr = str.match(/\S+/g);
        return uniq(arr).join(' ')
    }
}
