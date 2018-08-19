import * as React from 'react';


export default class CardBase extends React.Component<UI.Card.Props, UI.Card.State> {

    static defaultProps = {
        width: '100%',
        height: '100%'
    }

    state = {
        width: this.props.width,
        height: this.props.height
    }

}