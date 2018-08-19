import * as React from 'react';
import { noop } from 'lodash';
import { PureComponent } from '../../../ui/decorators';
import WebComponent from '../../webcomponent';
import __ from './locale';

interface Props {
    //访问权限
    value: number;
    //支持所有者
    owner: boolean;
    //显示所有者
    showOwner: boolean;
    //禁用选项
    disabledOptions?: Array<number>;
    onPermChange: noop;
    onOwnerChange: noop;

}

interface State {
    permvalue: number;
}

interface Base {
    props: Props;
    state: State;
}

const DEFAULT_PERMVALUE = 71;

@PureComponent
export default class PermissionsBase extends WebComponent<Props, any> implements Base {

    static defaultProps = {
        // 权限
        value: DEFAULT_PERMVALUE,
        disabledOptions: [],
        owner: true,
    }

    state = {
        // 权限
        permvalue: DEFAULT_PERMVALUE,
        //所有者
        isowner: true,
    }

    componentDidMount() {
        this.setPermissions(this.props.value);
        this.setOwner(this.props.owner);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setPermissions(nextProps.value);
        }
        if (this.props.owner !== nextProps.owner) {
            this.setOwner(nextProps.owner);
        }
    }

    changeAllowPermValue(checked: boolean, permission: number) {
        this.props.onPermChange(checked, permission);
    }


    changeOwnerValue(checked: boolean) {
        this.props.onOwnerChange(checked);
    }


    /**
    * 设置访问权限的值
    */
    setPermissions(value: number) {
        this.setState({
            permvalue: value
        })
    }

    /**
      * 设置所有者
      */
    setOwner(owner: boolean) {
        this.setState({
            isowner: owner
        })
    }

    /**        
     * 通知访问权限被改变
     */
    fireChangeEvent(value: number, owner: boolean) {
        this.props.onOwnerChange(value, owner);
    }

}