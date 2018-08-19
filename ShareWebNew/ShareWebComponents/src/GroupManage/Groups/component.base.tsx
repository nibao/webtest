import * as React from 'react';

export default class GroupsBase extends React.Component<any, any>{
    srcollToIndex(index) {
        this.refs.groupView.refs.list.scrollTop = index * 33;
    }
}