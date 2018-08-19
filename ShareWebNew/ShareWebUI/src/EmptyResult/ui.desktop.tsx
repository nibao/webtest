import * as React from 'react'
import { Centered, UIIcon } from '../ui.desktop'
import * as styles from './styles.desktop'

const EmptyResult: React.StatelessComponent<UI.EmptyResult.Props> = function EmptyResult({
    code,
    picture,
    details,
    size,
    font,
    fontSize,
    color,
}) {
    return (
        <Centered>
            {
                code
                    ?
                    <UIIcon code={code} size={size} />
                    :
                    <img
                        src={picture}
                        className={styles['picture']}
                        style={{ width: size, height: size }}
                    />
            }

            <div
                className={styles['text']}
                style={{ fontFamily: font, fontSize, color }}
            >
                {details}
            </div>
        </Centered>
    )
}

export default EmptyResult

