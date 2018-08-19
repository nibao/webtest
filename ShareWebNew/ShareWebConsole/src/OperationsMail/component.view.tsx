import * as React from 'react';
import { mailAndLenth } from '../../util/validators/validators';
import { getErrorMessage } from '../../core/exception/exception'
import { CheckBox, ComboArea, Button, LinkChip, Dialog2 as Dialog, Panel, MessageDialog, FlexBox, SuccessDialog } from '../../ui/ui.desktop';
import OperationsMailBase from './component.base';
import __ from './locale';
import * as styles from './style.view.css'

export default class OperationsMail extends OperationsMailBase {
    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['mail-tip']}>
                    {
                        __('运维邮箱地址')
                    }
                </div>
                <FlexBox>
                    <FlexBox.Item align="top">
                        <ComboArea
                            minHeight={50}
                            width={900}
                            value={this.state.mails}
                            onChange={this.changeMails}
                            placeholder={__('请填写接收运维数据的邮箱地址，多个邮箱之间用空格隔开')}
                            validator={value => mailAndLenth(value, 2, 100)}
                            spliter={[';', ',', ' ']}
                        />
                    </FlexBox.Item>
                    <FlexBox.Item align="top">
                        <div className={styles['test-btn']}>
                            <Button
                                disabled={!this.state.mails.length}
                                onClick={this.testMail.bind(this)}
                            >
                                {
                                    __('测试')
                                }
                            </Button>
                        </div>
                    </FlexBox.Item>
                </FlexBox>
                <div className={styles['message']}>
                    {
                        __('将自动向您填写的邮箱发送系统运维数据，包括：系统运行异常情况和系统月度运维数据')
                    }
                </div>
                {
                    this.state.isMailsChanged ? (
                        <div>
                            <Button onClick={this.saveMails.bind(this)}>
                                {
                                    __('保存')
                                }
                            </Button>
                            <Button
                                className={styles['test-btn']}
                                onClick={this.cancelMails.bind(this)}
                            >
                                {
                                    __('取消')
                                }
                            </Button>
                        </div>
                    ) :
                        null
                }
                <div className={styles['operation-check']}>
                    <div className={styles['operation-message']}>
                        <CheckBox
                            value={this.state.operationsHelperStatus}
                            checked={this.state.operationsHelperStatus}
                            onChange={this.setOperationsStatus.bind(this)}
                            id="operationsSwitch"
                        />
                    </div>
                    <label htmlFor="operationsSwitch" className={styles['text']}>
                        {
                            __('已阅读')
                        }
                    </label>
                    <div className={styles['operation-btn']}>
                        <LinkChip onClick={this.showOperationsProtocol.bind(this)}>
                            <span className={styles['link']}>
                                {
                                    __('AnyShare运维助手服务条款')
                                }
                            </span>
                        </LinkChip>
                    </div>
                    <label className={styles['operation-message']} htmlFor="operationsSwitch">
                        {
                            __('并同意开启AnyShare运维助手')
                        }
                    </label>
                </div>
                <div className={styles['message']}>
                    {
                        __('建议开启运维助手，系统会把运维和运营情况通过邮件反馈给服务团队，以便为您提供免费、及时和专业的服务支持')
                    }
                </div>

                {
                    this.state.showOperationsProtocol ?
                        this.getExceptionClause() :
                        null
                }
                {
                    this.state.isOperationsSwitchChanged ? (
                        <div>
                            <Button onClick={this.saveOperationConfig.bind(this)}>
                                {
                                    __('保存')
                                }
                            </Button>
                            <Button className={styles['test-btn']} onClick={this.cancelOperationsConfig.bind(this)}>
                                {
                                    __('取消')
                                }
                            </Button>
                        </div>
                    ) :
                        null
                }

                {
                    this.state.isMailTestedSuccess ?
                        (
                            <SuccessDialog onConfirm={this.closeisMailTestedSuccess.bind(this)}>
                                {
                                    __('测试邮件已成功发送，请您登录指定的邮箱地址查看。')
                                }
                            </SuccessDialog>
                        ) :
                        null
                }
                {
                    this.state.errorStatus ?
                        (
                            <MessageDialog onConfirm={this.closeErrorTip.bind(this)}>
                                {
                                    getErrorMessage(this.state.errorStatus)
                                }
                            </MessageDialog>
                        ) :
                        null
                }

                {
                    this.state.isSavedSuccess ?
                        (
                            <SuccessDialog onConfirm={this.closeisSavedSuccess.bind(this)}>
                                {
                                    __('保存成功')
                                }
                            </SuccessDialog>
                        ) :
                        null
                }

            </div>
        )
    }

    getExceptionClause() {
        return (
            <Dialog
                title={__('AnyShare运维助手服务条款')}
                onClose={this.closeOperations.bind(this)}
            >
                <div className={styles['operation-item']}>
                    <div className={styles['operation-content']}>

                        <h1 className={styles['title']}>
                            {
                                __('隐私政策及声明')
                            }
                        </h1>
                        <div className={styles['content']}>
                            {
                                __('AnyShare运维助手服务是爱数针对客户提供的一个免费运维辅助服务，用于辅助IT管理员即时告警和定期报告的方式，发现系统的警告、风险、潜在问题，以便爱数运维团队，通过专业的系统问题诊断、运维和运营优化建议，帮助您安全、有效的用好AnyShare。')
                            }
                        </div>
                        <div className={styles['content']}>
                            {
                                __('爱数AnyShare尊重并保护最终使用用户的个人隐私权，运维助手不会收集任何最终用户信息。爱数AnyShare将按照本隐私政策的规定获取使用和披露您的系统运维和运营信息，并将高度审慎对待这些信息。随着服务范围的扩大和调整，我们会不时更新我们的隐私权政策。以下是我们对您信息收集、使用和保护政策，请您认真阅读。')
                            }
                        </div>
                        <h2 className={styles['title-2']}>
                            {
                                __('信息收集的必要性')
                            }
                        </h2>
                        <div className={styles['content']}>
                            {
                                __('我们收集信息是为了向用户的IT管理员提供更好的服务，及时发现系统所存在的潜在风险，了解系统中空间的使用情况，了解自己公司的数据资产情况，了解当前系统在公司内的推广使用情况等，其中包括一些AnyShare日常运维的基本信息（例如节点离线，磁盘离线，月活用户数等），文件数量，用户活跃度，系统空间利用率等。')
                            }
                        </div>
                        <h2 className={styles['title-2']}>
                            {
                                __('信息收集的方式')
                            }
                        </h2>
                        <div className={styles['content']}>
                            {
                                __('在您授权同意的情况下，我们才会开启收集运维数据的功能，通过邮件正文的方式将运维数据发送给上海爱数信息技术股份有限公司。')
                            }
                        </div>
                        <div>
                            {
                                __('收集信息包括：')
                            }
                        </div>
                        <div className={styles['content']}>
                            {
                                __('•	系统日常的运维信息，包括但不限于副本健康度，负载均衡状态，节点离线次数，数据库同步异常次数等；')
                            }
                        </div>
                        <div className={styles['content']}>
                            {
                                __('•	系统的运营信息，包括但不限于月度和年度的活跃用户数量，系统中总的文件、存储及系统空间的使用情况等；')
                            }
                        </div>
                        <div className={styles['content']}>
                            {
                                __('收集的方式为邮件方式，收集行为均会记录日志信息，收集的频度包括即时告警邮件和月度报告邮件。')
                            }
                        </div>
                        <h2 className={styles['title-2']}>
                            {
                                __('信息的使用')
                            }
                        </h2>
                        <div className={styles['content']}>
                            {
                                __('我们会通过邮件收集到的信息来分析当前客户处系统存在的潜在风险，帮助客户优化AnyShare系统，协助客户做好运营推广，以便AnyShare可以更好的服务用户。')
                            }
                        </div>
                        <h2 className={styles['title-2']}>
                            {
                                __('信息的公开和共享')
                            }
                        </h2>
                        <div className={styles['content']}>
                            {
                                __('在未经您同意之前，爱数AnyShare不会向任何第三方提供、出售、出租、分享和交易您的系统运维和运营资料，但以下情形除外：')
                            }
                        </div>
                        <div className={styles['content']}>
                            {
                                __('1、	为遵守法律法规之要求，包括在国家有关机关或其授权的单位查询时，向其提供有关资料；')
                            }
                        </div>
                        <div className={styles['content']}>
                            {
                                __('2、	如您出现违反有关法律法规或者爱数AnyShare服务协议或者相关规则的情况，需要向第三方披露；如您是适格的知识产权投诉人并已提起投诉，应被投诉人要求，向被投诉人披露，以便双方处理可能的权利纠纷；')
                            }
                        </div>
                        <div className={styles['content']}>
                            {
                                __('3、其他爱数AnyShare根据法律法规或者政策认为合适的披露。')
                            }
                        </div>
                        <h2 className={styles['title-2']}>
                            {
                                __('信息安全')
                            }
                        </h2>
                        <div className={styles['content']}>
                            {
                                __('爱数AnyShare具有相应的技术和安全措施来确保我们掌握的信息不丢失，不被滥用和变造。这些安全措施包括向其他服务器备份数据和对用户密码加密。尽管有这些安全措施，但爱数不保证这些信息的绝对安全。因黑客攻击、电脑病毒侵入、政府管制亦或不可抗力而造成的信息丢失，属于我们服务免责的情形。')
                            }
                        </div>
                    </div>
                </div>
            </Dialog >
        )
    }
}