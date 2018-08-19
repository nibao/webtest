import * as React from 'react';
import { appeal } from '../../core/apis/efshttp/quarantine/quarantine';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import { maxLength } from '../../util/validators/validators';
import WebComponent from '../webcomponent';
import { AppealedCode } from '../IsolationZone/helper';

export default class AppealDialogBase extends WebComponent<Components.AppealDialog.Props, any> {

    static defaultProps = {

    }

    state: Components.AppealDialog.State = {
        appealReason: '',
        overAppealWords: false
    }

    /**
     * 监听申诉文本框
     * @param reason 申诉理由
     */
    protected handleTextAreaChange(value) {
        this.setState({
            appealReason: value,
            overAppealWords: !maxLength(800)(value)
        });
    }

    /**
     * 提交申诉内容
     * @param doc 申诉的文档对象
     * @param reason 申诉理由
     */
    protected async handleAppealFile(doc, reason) {
        try {
            await appeal({ docid: doc['docid'], reason });
            this.props.onCloseDialog(AppealedCode.OK);

        } catch (error) {
            switch (error.errcode) {
                case ErrorCode.ParametersIllegal:
                    this.props.onCloseDialog(ErrorCode.ParametersIllegal);
                    break;
                case ErrorCode.GNSInaccessible:
                    this.props.onCloseDialog(ErrorCode.GNSInaccessible);
                    break;
                case ErrorCode.ObjectTypeError:
                    this.props.onCloseDialog(ErrorCode.ObjectTypeError);
                    break;
                default:
                    this.props.onCloseDialog(ErrorCode.ObjectTypeError);
                    break;
            }
        }

    }

}