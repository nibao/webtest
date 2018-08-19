/// <reference path="./index.d.ts" />

import * as React from 'react';
import * as styles from './styles.desktop.css';

const Badge: React.StatelessComponent<UI.Badge.Props> = function Badge({ dot, count, overflowCount, size, fontSize, backgroundColor, color }) {
    return (
        <div>
            {
                dot ?
                    <div
                        style={{
                            width: size,
                            height: size,
                            borderRadius: 0.5 * size,
                            backgroundColor: backgroundColor,
                        }}
                    >
                    </div>
                    :
                    <div
                        className={styles['wrapper']}
                        style={count >= 0 && count < 10 ?
                            {
                                width: size,
                                height: size,
                                lineHeight: `${size}px`,
                                borderRadius: 0.5 * size,
                                fontSize: fontSize,
                                backgroundColor: backgroundColor,
                                color: color
                            }
                            :
                            {
                                height: size,
                                lineHeight: `${size}px`,
                                borderRadius: 0.5 * size,
                                paddingLeft: 0.3 * size,
                                paddingRight: 0.3 * size,
                                fontSize: fontSize,
                                backgroundColor: backgroundColor,
                                color: color,
                            }}
                    >
                        {count > overflowCount ? `${overflowCount}+` : count}
                    </div>
            }
        </div>
    )
}

Badge.defaultProps = {
    dot: false,
    count: 0,
    overflowCount: 99,
    size: 16,
    fontSize: '12px',
    backgroundColor: '#d70000',
    color: '#fff',
}

export default Badge;