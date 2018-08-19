import { noop } from 'lodash'
import WebComponent from '../../../webcomponent';
import { buildDocFromMsg } from '../helper';

export default class CheckMsgsBase extends WebComponent<Components.Message2.RenderMsgs.CheckMsgs.Props, Components.Message2.RenderMsgs.CheckMsgs.State> {
    static defaultProps = {
        msgs: [],
        csfSysId: '',
        csfTextArray: [],
        resultMessage: {},
        onRead: noop,
        showResultDialog: noop,
        closeResultDialog: noop,
        doPreview: noop,
        doCheck: noop,
        doRedirect: noop,
    }

    state = {
        msgsDoc: [],
    }

    async componentWillMount() {
        const msgsDoc = buildDocFromMsg(this.props.msgs);
        this.setState({
            msgsDoc
        })
    }
}