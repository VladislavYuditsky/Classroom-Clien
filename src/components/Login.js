import React from 'react';
import {Form, Button, Alert} from "react-bootstrap";
import SockJsClient from 'react-stomp';
import {history} from "../utils";
import * as axios from "axios";

class Login extends React.Component {
    constructor(props) {
        super(props);

        let userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        this.state = {
            username: '',
            error: '',
            user: userData
        }
    }

    componentWillMount() {
        if (this.state.user)
            history.replace('/members');
    }


    handleChange = field => e => {
        this.setState({[field]: e.target.value});
        this.setState({error: ''})
    };

    handleSubmit = e => {
        e.preventDefault();

        axios.post('http://localhost:8080/signIn', {
            username: this.state.username
        })
            .then((response) => {
                localStorage.setItem('user', JSON.stringify(response.data));

                this.sendMessage();

                if (!this.state.error)
                    history.replace('/members')
            })
            .catch((err) => {
                this.setState({
                    error: err.response.data.message
                })
            });
    }

    sendMessage = () => {
        this.clientRef.sendMessage('/app/updateState');
    };

    render() {
        const {username, error} = this.state;
        return (
            <div className="login">
                Your name:
                <Form onSubmit={this.handleSubmit}>
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

                <SockJsClient url='http://localhost:8080/classroom-ws/'
                              topics={['/topic/users']}
                              onConnect={() => {
                              }}
                              onDisconnect={() => {
                              }}
                              onMessage={() => {
                                  if (localStorage.getItem('user')) {
                                      history.replace('/members')
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
