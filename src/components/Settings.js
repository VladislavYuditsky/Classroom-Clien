import React from 'react';
import {history} from "../utils";
import * as axios from "axios";
import {Button, Form} from "react-bootstrap";

class Settings extends React.Component {
    constructor(props) {
        super(props);

        let userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        this.state = {
            user: userData,
            username: userData ? userData.username : '',
            email: userData ? userData.email : ''
        }
    }

    componentWillMount() {
        if (!this.state.user) {
            history.replace('/login');
        }
    }

    handleChange = field => e => {
        this.setState({[field]: e.target.value});
    };

    handleSubmit = e => {
        e.preventDefault();

        axios.post('http://localhost:8080/user/update', {
            username: this.state.username,
            email: this.state.email
        })
            .then((response) => {
                localStorage.setItem('user', JSON.stringify(response.data));
                this.setState({
                    user: response.date
                })
            })
    }

    render() {
        const {email} = this.state;
        return (
            <div>
                <div className="members">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Control
                                type="email"
                                placeholder="email"
                                value={email}
                                onChange={this.handleChange('email')}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" block className="form-btn">
                            Change
                        </Button>
                    </Form>
                </div>
            </div>
        )
    }
}

export {Settings}
