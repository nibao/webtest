import * as React from 'react'
import TextBox from '../TextBox/ui.desktop'

export default function ColorBox(props) {
    return (
        <TextBox {...props} validator={input => /^#?[0-9A-Fa-f]{0,6}$/.test(String(input))} />
    )
}