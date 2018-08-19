import * as React from 'react';
import { noop } from 'lodash';
import TextArea from '../TextArea/ui.desktop';
import { tweet } from '../../util/validators/validators';
import __ from './locale';

export default function TweetBox({placeholder = __('最多可输入140字'), onChange = noop, style, value}) {
    return (
        <TextArea
            placeholder={placeholder}
            onChange={onChange}
            validator={tweet}
            style={style}
            value={value}
        />
    )

}