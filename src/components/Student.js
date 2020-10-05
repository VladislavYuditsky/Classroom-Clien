import React from 'react';
import {history} from "../utils";
import * as axios from "axios";
import {Button, ButtonGroup, Form, Table, ToggleButton} from "react-bootstrap";

class Student extends React.Component {
    constructor(props) {
        super(props);

        let userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        this.state = {
            user: userData,
            username: '',
            studentActions: null,
            actionType: '',
            searchParam: '',
            dateFrom: '',
            dateTo: '',
        }
    }

    componentWillMount() {
        if (!this.state.user) {
            history.replace('/login');
        }

        const username = this.props.match.params.username

        this.setState({
            username: username
        })

        axios.get(`http://localhost:8080/student/${username}?search=`)
            .then((response) => {
                this.setState({
                    studentActions: response.data
                })
            });
    }

    setActionType(name) {
        this.setState({
            actionType: name
        })

        console.log('setActionType')
        this.parseSearchParam()
    }

    parseSearchParam() {
        let searchParam = ''
        console.log('parse')
        if (this.state.actionType) {
            console.log('action')
            searchParam = searchParam + 'action:' + this.state.actionType + ','
        }
        if (this.state.dateFrom) {
            console.log('>')
            searchParam = searchParam + 'dateTime>' + this.state.dateFrom + ','
        }
        if (this.state.dateTo) {
            console.log('<')
            searchParam = searchParam + 'dateTime<' + this.state.dateTo + ','
        }

        this.setState({
            searchParam: searchParam
        })
    }

    handleSubmit = e => {
        e.preventDefault();

        axios.get(`http://localhost:8080/student/${this.state.username}?search=${this.state.searchParam}`)
            .then((response) => {
                this.setState({
                    studentActions: response.data
                })
            });
    }

    handleChange = field => e => {
        this.setState({[field]: e.target.value});

        console.log('handleChange')
        this.parseSearchParam()
    };

    render() {
        const {studentActions, dateFrom, dateTo} = this.state;
        const radios = [
            {name: 'ALL', value: ''},
            {name: 'HAND UP', value: 'HAND_UP'},
            {name: 'HAND DOWN', value: 'HAND_DOWN'},
            {name: 'LOG IN', value: 'LOG_IN'},
            {name: 'LOG OUT', value: 'LOG_OUT'}
        ];
        return (
            <div>
                <div className="members">
                    {studentActions &&
                    <div>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="From"
                                value={dateFrom}
                                onChange={this.handleChange('dateFrom')}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="To"
                                value={dateTo}
                                onChange={this.handleChange('dateTo')}
                            />
                        </Form.Group>
                        <ButtonGroup toggle>
                            {radios.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    type="radio"
                                    variant="primary"
                                    name={radio.name}
                                    onClick={() => this.setActionType(radio.value)}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                        <Button variant="primary" type="submit" block className="form-btn" onClick={this.handleSubmit}>
                            Search
                        </Button>
                        <Table>
                            <tbody>
                            {studentActions.map(action => {
                                return <tr key={action.id}>
                                    <td>{action.username}</td>
                                    <td>{action.action}</td>
                                    <td>{action.dateTime}</td>
                                </tr>
                            })}
                            </tbody>
                        </Table>
                    </div>
                    }
                </div>
            </div>
        )
    }
}

export {Student}
