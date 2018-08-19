import * as React from 'react';
import { Link } from 'react-router';
import { post } from '../../../util/http/http';
import Form from '../../../ui/Form/ui.desktop';
import Select from '../../../ui/Select/ui.desktop';
import TextBox from '../../../ui/TextBox/ui.desktop';
import TextArea from '../../../ui/TextArea/ui.desktop';
import Button from '../../../ui/Button/ui.desktop';
import * as styles from './styles.css';

const Methods = {
    9998: {
        auth1: ['getnew']
    },
    9123: {
        dir: ['list']
    }
}

export default class OpenAPIView extends React.Component<any, any> {
    state = {
        host: '192.168.138.33',
    }

    render() {
        return (
            <div className={ styles['container'] }>
                <div className={ styles['config'] }>
                    <div className={ styles['options'] }>
                        <Form>
                            <Form.Row>
                                <Form.Label>服务器地址</Form.Label>
                                <Form.Field>
                                    <TextBox value={ this.state.host } onChange={ host => this.setState({ host }) } />
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>协议</Form.Label>
                                <Form.Field>
                                    <Select
                                        value={ this.state.port }
                                        onChange={ port => this.setState({ port }) }
                                    >
                                        <Select.Option value={ 9998 }>访问控制协议</Select.Option>
                                        <Select.Option value={ 9123 }>文档访问协议</Select.Option>
                                    </Select>
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>资源</Form.Label>
                                <Form.Field>
                                    <Select onChange={ resource => this.setState({ resource }) }>
                                        {
                                            this.state.port ?
                                                Object.keys(Methods[this.state.port]).map((resource, index) => (
                                                    <Select.Option
                                                        selected={ index === 0 }
                                                        value={ resource }
                                                    >
                                                        { resource }
                                                    </Select.Option>
                                                )) :
                                                []
                                        }
                                    </Select>
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>方法</Form.Label>
                                <Form.Field>
                                    <Select onChange={ method => this.setState({ method }) }>
                                        {
                                            this.state.resource ?
                                                Methods[this.state.port][this.state.resource].map((method, index) => (
                                                    <Select.Option
                                                        selected={ index === 0 }
                                                        value={ method }
                                                    >
                                                        { method }
                                                    </Select.Option>
                                                )) :
                                                []
                                        }
                                    </Select>
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>userid</Form.Label>
                                <Form.Field>
                                    <TextBox onChange={ userid => this.setState({ userid }) } />
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>tokenid</Form.Label>
                                <Form.Field>
                                    <TextBox onChange={ tokenid => this.setState({ tokenid }) } />
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>请求体</Form.Label>
                                <Form.Field>
                                    <TextArea
                                        height={ 200 }
                                        value={ this.state.body }
                                        onChange={ body => this.setState({ body }) }
                                    />
                                </Form.Field>
                            </Form.Row>

                        </Form>
                    </div>
                    <div className={ styles['actions'] }>
                        <Button onClick={ this.send.bind(this) }>发送</Button>
                    </div>
                </div>
                <div className={ styles['preview'] }>
                    <Form>
                        <Form.Row>
                            <Form.Label>
                                POST
                            </Form.Label>
                            <Form.Field>
                                <div>
                                    {
                                        this.state.url
                                    }
                                </div>
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>
                                请求
                            </Form.Label>
                            <Form.Field>
                                <div>
                                    <TextArea height={ 150 } readOnly={ true } value={ this.state.body } />
                                </div>
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>
                                响应
                            </Form.Label>
                            <Form.Field>
                                <div>
                                    <TextArea height={ 150 } readOnly={ true } value={ this.state.responseBody } />
                                </div>
                            </Form.Field>
                        </Form.Row>
                    </Form>
                </div>
            </div>
        )
    }

    async send() {
        const { http, host, port, protocol, resource, method, body, userid, tokenid } = this.state;
        const baseUrl = `http://${host}:${port}/v1/${resource}?method=${method}`;
        const query = (userid && tokenid) ? Object.entries({ userid, tokenid }).map(([key, value]) => `${key}=${value}`).join('&') : '';
        const url = query ? [baseUrl, query].join('&') : baseUrl;


        this.setState({ url, body }, async () => {
            const { response: responseBody } = await post(url, body, { sendAs: 'text', });
            this.setState({ responseBody })
        });
    }
}