import React from 'react';
import {history, isStudent, isTeacher} from "../utils";
import {Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import {NavigationBar} from "./Navbar";
import {USER} from "../constants";
import {LOGIN} from "../routes";
import {api} from "../api/app";

class Students extends React.Component {
    constructor(props) {
        super(props);

        let userData = localStorage.getItem(USER) ? JSON.parse(localStorage.getItem(USER)) : null;
        this.state = {
            user: userData,
            username: userData ? userData.username : '',
            roles: userData ? userData.roles : ['STUDENT'],
            students: null
        }
    }

    componentWillMount() {
        if (!this.state.user) {
            history.replace(LOGIN);
        }

        api.getStudents()
            .then((response) => {
                this.setState({
                    students: response.data
                })
            });
    }

    render() {
        const {students} = this.state;
        return (
            <div>
                <NavigationBar/>
                <div className="screen-center">
                    {students && isTeacher() &&
                    <div>
                        <h5>Students</h5>
                        <Table>
                            <tbody>
                            {students.map(student => {
                                    if (student.roles.indexOf('STUDENT') !== -1)
                                        return <tr key={student.id}>
                                            <td>
                                                <Link to={'/student/' + student.username}>
                                                    {student.username}
                                                </Link>
                                            </td>
                                        </tr>
                                }
                            )}
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

export {Students}
