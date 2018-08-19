import GelleryBase from './ui.base';

export default class Gellery extends GelleryBase {
    render() {
        return (
            <img src={this.props.src} />
        )
    }
}