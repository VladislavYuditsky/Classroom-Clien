import React from 'react';
import {history} from "../utils";
import * as axios from "axios";
import {Alert, Button, ButtonGroup, Form, ToggleButton} from "react-bootstrap";
import {NavigationBar} from "./Navbar";

class Settings extends React.Component {
    constructor(props) {
        super(props);

        let userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        this.state = {
            username: userData ? userData.username : '',
            enableReport: false,
            email: userData ? userData.email : '',
            newEmail: userData ? userData.email : '',
            generationFrequency: 1,
            reportId: null,
            error: ''
        }
    }

    componentWillMount() {
        if (!this.state.username) {
            history.replace('/login');
        }

        axios.get(`http://localhost:8080/report/${this.state.username}`)
            .then((response) => {
                this.setState({
                    reportId: response.data.id,
                    generationFrequency: response.data.generationFrequency,
                })
            })
    }

    handleChange = field => e => {
        this.setState({
            [field]: e.target.value,
            error: ''
        });
    };

    handleSubmit = e => {
        e.preventDefault();

        axios.post('http://localhost:8080/user/update', {
            username: this.state.username,
            email: this.state.newEmail
        })
            .then((response) => {
                localStorage.setItem('user', JSON.stringify(response.data));
                this.setState({
                    email: this.state.newEmail
                })
            })
    }

    setGenerationFrequency(value) {
        axios.post('http://localhost:8080/report/update', {
            id: this.state.reportId,
            generationFrequency: value
        })
            .then(() => {
                this.setState({
                    generationFrequency: value,
                })
            })
    }

    changeReportState = e => {
        e.preventDefault();

        if (this.state.reportId) {
            axios.post('http://localhost:8080/report/remove', {
                id: this.state.reportId
            })
                .then(() => {
                    this.setState({
                        generationFrequency: 1,
                        reportId: null
                    })
                })
        }

        if (!this.state.reportId) {
            if (!this.state.email) {
                this.setState({
                    error: 'You must specify the mail to receive the report'
                })
            } else {
                axios.post('http://localhost:8080/report', {
                    generationFrequency: this.state.generationFrequency,
                    recipientUsername: this.state.username
                })
                    .then((response) => {
                        this.setState({
                            reportId: response.data.id
                        })
                    })
            }
        }
    }

    render() {
        const {newEmail, generationFrequency, reportId, error} = this.state;

        const radios = [
            {name: 'Day', value: '1'},
            {name: 'Week', value: '7'},
        ];

        return (
            <div>
                <NavigationBar/>
                <div className="members">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            Email
                            <Form.Control
                                type="email"
                                placeholder="email"
                                value={newEmail}
                                onChange={this.handleChange('newEmail')}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" block className="form-btn">
                            Change
                        </Button>
                    </Form>
                    <div>
                        Report
                        <Button variant="primary" onClick={this.changeReportState}>
                            {reportId ? 'Disable' : 'Enable'}
                        </Button>
                        {reportId &&
                        <div>
                            Generation frequency
                            <ButtonGroup toggle>
                                {radios.map((radio, idx) => (
                                    <ToggleButton
                                        key={idx}
                                        type="radio"
                                        variant="secondary"
                                        name="radio"
                                        value={radio.value}
                                        checked={generationFrequency === radio.value}
                                        onChange={(e) => this.setGenerationFrequency(e.currentTarget.value)}
                                    >
                                        {radio.name}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>
                        </div>
                        }
                        {error && <Alert variant="danger">{error}</Alert>}
                    </div>
                </div>
            </div>
        )
    }
}

export {Settings}
