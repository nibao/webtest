import * as React from 'react';
import * as styles from './styles.css';
import session from '../../../util/session/session';
import { setup as setupHost } from '../../../core/openapi/openapi';
import { login, OS_TYPE } from '../../../core/auth/auth';
import Form from '../../../ui/Form/ui.desktop';
import TextBox from '../../../ui/TextBox/ui.desktop';
import Button from '../../../ui/Button/ui.desktop';

export default class Config extends React.Component<any, any> {
    state = {}

    render() {
        return (
            <div className={ styles['container'] }>
                <div className={ styles['panel'] }>
                    <Form onSubmit={ this.submit.bind(this) }>
                        <Form.Row>
                            <Form.Label>服务器地址：</Form.Label>
                            <Form.Field>
                                <TextBox value={ this.state.host } onChange={ host => this.setState({ host }) } />
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>帐号：</Form.Label>
                            <Form.Field>
                                <TextBox value={ this.state.account } onChange={ account => this.setState({ account }) } />
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>密码：</Form.Label>
                            <Form.Field>
                                <TextBox value={ this.state.password } type="password" onChange={ password => this.setState({ password }) } />
                            </Form.Field>
                        </Form.Row>
                    </Form>
                    <div className={ styles['actions'] }>
                        <Button type="submit" onClick={ this.submit.bind(this) }>确定</Button>
                    </div>

                </div>
            </div>
        )
    }

    async submit(event) {
        setupHost({
            host: this.state.host,
            EACPPort: this.state.host.startsWith('https') ? 9999 : 9998,
            EFSPPort: this.state.host.startsWith('https') ? 9124 : 9123,
            userid: () => session.get('userid'),
            tokenid: () => session.get('tokenid'),
        })

        const { userid, tokenid, ...user } = await login(this.state.account, this.state.password, OS_TYPE.WEB);

        session.set('userid', userid)
        session.set('tokenid', tokenid)
        session.set('user', user);

        this.props.history.push({ pathname: '/components' });

        event.preventDefault();
    }
}