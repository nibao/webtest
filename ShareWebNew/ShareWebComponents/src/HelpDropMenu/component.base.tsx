import WebComponent from '../webcomponent';

export default class HelpDropMenuBase extends WebComponent<any, any> {
    static defaultProps = {
        OEMHelper: '',
        OEMFAQ: ''
    }


    /**
     * 处理帮助页面
     */
    handleHelp(url) {
        window.open(url);
    }
}