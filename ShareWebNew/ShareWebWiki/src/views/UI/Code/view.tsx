import * as React from 'react';
import UIView from '../../UI/view';
import Code from '../../../../ui/Code/ui.desktop';

const code = `// HelloWorld
function helloWorld() {
    return 'Hello World';
}
`;

export default function CodeView() {
    return (
        <UIView
            name={ '<Code />' }
            description={ '代码块' }
            api={ [
                {
                    name: 'className',
                    type: String,
                    required: false,
                    note: 'className'
                },
                {
                    name: 'language',
                    type: String,
                    required: false,
                    note: '语言，如果不指定highlight.js会进行猜测'
                },
            ] }>
            <Code>
                {
                    code
                }
            </Code>
        </UIView>
    )
}