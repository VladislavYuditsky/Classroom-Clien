import React from 'react';
import {history, isStudent, isTeacher} from "../utils";
import {Button, ButtonGroup, Table, ToggleButton} from "react-bootstrap";
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import formatDate from "dateformat"
import {NavigationBar} from "./Navbar";
import {ACTION_EQUALS, DATE_FROM, DATE_PATTERN, DATE_TO, USER} from "../constants";
import {LOGIN} from "../routes";
import {api} from "../api/app";

class Student extends React.Component {
    constructor(props) {
        super(props);

        let userData = localStorage.getItem(USER) ? JSON.parse(localStorage.getItem(USER)) : null;
        const date = new Date();
        this.state = {
            user: userData,
            username: '',
            studentActions: null,
            actionType: '',
            searchParam: '',
            dateFrom: date,
            dateTo: date,
        }
    }

    componentWillMount() {
        if (!this.state.user) {
            history.replace(LOGIN);
        }

        const username = this.props.match.params.username

        this.setState({
            username: username
        })

        api.getStudentActions(username, '')
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
        this.parseSearchParam()
    }

    parseSearchParam() {
        let searchParam = ''
        if (this.state.actionType) {
            searchParam = searchParam + ACTION_EQUALS + this.state.actionType + ','
        }
        if (this.state.dateFrom !== this.state.dateTo) {
            searchParam = searchParam + DATE_FROM + this.timeFromCurrentUTC(this.state.dateFrom) + ','
            searchParam = searchParam + DATE_TO + this.timeFromCurrentUTC(this.state.dateTo) + ','
        }

        this.setState({
            searchParam: searchParam
        })
    }

    handleSubmit = e => {
        e.preventDefault();

        api.getStudentActions(this.state.username, this.state.searchParam)
            .then((response) => {
                this.setState({
                    studentActions: response.data
                })
            });
    }

    handleDateChange = dates => {
        if (dates) {
            this.setState({
                dateFrom: dates[0],
                dateTo: dates[1]
            }, () => this.parseSearchParam())
        } else {
            const date = new Date();
            this.setState({
                dateFrom: date,
                dateTo: date
            }, () => this.parseSearchParam())
        }
    }

    //Calculate the time relative to the server that contains the time in the UTC-0
    timeToCurrentUTC(dateTime) {
        const serverDate = new Date(dateTime);
        const clientTimezoneOffset = new Date().getTimezoneOffset();
        return formatDate(serverDate.setMinutes(serverDate.getMinutes() - clientTimezoneOffset), DATE_PATTERN)
    }

    timeFromCurrentUTC(dateTime) {
        const clientDate = new Date(dateTime);
        const clientTimezoneOffset = new Date().getTimezoneOffset();
        return formatDate(clientDate.setMinutes(clientDate.getMinutes() + clientTimezoneOffset), DATE_PATTERN)
    }

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
                <NavigationBar/>
                <div className="studentLogs row">
                    {studentActions && isTeacher() &&
                    <div>
                        <div className="ml-5">
                            <DateTimeRangePicker value={[dateFrom, dateTo]} onChange={this.handleDateChange}/>
                        </div>
                        <div className="mt-2">
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
                        </div>
                        <Button variant="primary" type="submit" block className="form-btn mt-2"
                                onClick={this.handleSubmit}>
                            Search
                        </Button>
                        <Table>
                            <tbody>
                            {studentActions.map(action => {
                                return <tr key={action.id}>
                                    <td>{action.username}</td>
                                    <td>{action.action}</td>
                                    <td>{this.timeToCurrentUTC(action.dateTime)}</td>
                                </tr>
                            })}
                            </tbody>
                        </Table>
                    </div>
                    }
                    {isStudent() &&
                    <h2>Access denied</h2>
                    }
                </div>
            </div>
        )
    }
}

export {Student}
