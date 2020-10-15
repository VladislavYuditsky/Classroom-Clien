import React from 'react';
import {Alert, Button, Form, Nav} from "react-bootstrap";
import SockJsClient from 'react-stomp';
import {history} from "../utils";
import {API_URL, STOMP_ENDPOINT, TOKEN, USER, USERS_TOPIC, WEBSOCKET_PREFIX} from "../constants";
import {MEMBERS} from "../routes";
import {api} from "../api/app";

class Login extends React.Component {
    constructor(props) {
        super(props);

        let userData = localStorage.getItem(USER) ? JSON.parse(localStorage.getItem(USER)) : null;
        this.state = {
            username: '',
            error: '',
            user: userData,
            roles: ['STUDENT'],
        }
    }

    componentWillMount() {
        if (this.state.user)
            history.replace(MEMBERS);
    }


    handleChange = field => e => {
        this.setState({[field]: e.target.value});
        this.setState({error: ''})
    };

    handleSubmit = e => {
        e.preventDefault();

        api.login(
            {
                username: this.state.username,
                roles: this.state.roles,
            }
        )
            .then((response) => {
                localStorage.setItem(USER, JSON.stringify(response.data.user)); //мб не достану так, + достать токен
                localStorage.setItem(TOKEN, response.data.token);

                this.sendMessage();

                history.replace(MEMBERS)
            })
            .catch((err) => {
                this.setState({
                    error: err.response.data.message
                })
            });
    }

    sendMessage = () => {
        this.clientRef.sendMessage(WEBSOCKET_PREFIX);
    };

    render() {
        const {username, error} = this.state;
        return (
            <div className="screen-center">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group>
                        <Nav fill variant="pills" defaultActiveKey="STUDENT"
                             onSelect={eventKey => this.setState({roles: [eventKey]})}>
                            <Nav.Item>
                                <Nav.Link eventKey='STUDENT'>Student</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey='TEACHER'>Teacher</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={this.handleChange('username')}
                        />
                    </Form.Group>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Button variant="primary" type="submit" block className="form-btn">
                        Login
                    </Button>
                </Form>

                <SockJsClient url={API_URL + STOMP_ENDPOINT}
                              topics={[USERS_TOPIC]}
                              onConnect={() => {
                              }}
                              onDisconnect={() => {
                              }}
                              onMessage={() => {
                                  if (localStorage.getItem(USER)) {
                                      history.replace(MEMBERS);
                                  }
                              }}
                              ref={(client) => {
                                  this.clientRef = client
                              }}/>
            </div>
        )
    }
}

export {Login}
