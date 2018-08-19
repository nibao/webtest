import * as React from 'react';
import * as classnames from 'classnames';
import * as styles from './styles.desktop.css';

export default class ScrollBar extends React.Component<UI.ScrollView.ScrollBar.Props, any>{
    render() {
        const { className, onDrag, length, offsetValue, axis } = this.props;
        return (
            <div
                ref="scroll"
                className={classnames(className, styles['scroll'])}
                style={{
                    width: axis === 'x' ? `100%` : '15px',
                    height: axis === 'y' ? `100%` : '15px',
                }}
            >
                <div
                    ref="scrollbar"
                    className={styles['scrollbar']}
                    style={{
                        width: axis === 'x' ? `${length}px` : '15px',
                        height: axis === 'y' ? `${length}px` : '15px',
                        left: axis === 'x' ? `${offsetValue}px` : 0,
                        top: axis === 'y' ? `${offsetValue}px` : 0,
                    }}
                    onMouseDown={onDrag}
                ></div>
            </div>
        )
    }
}