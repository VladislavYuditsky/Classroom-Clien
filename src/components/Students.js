import React from 'react';
import {history} from "../utils";
import * as axios from "axios";
import {Table} from "react-bootstrap";
import {Link} from "react-router-dom";

class Students extends React.Component {
    constructor(props) {
        super(props);

        let userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        this.state = {
            user: userData,
            username: userData ? userData.username : '',
            roles: userData ? userData.roles : ['STUDENT'],
            students: null
        }
    }

    componentWillMount() {
        if (!this.state.user) {
            history.replace('/login');
        }

        axios.get('http://localhost:8080/students')
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
                <div className="members">
                    {students &&
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
                </div>
            </div>
        )
    }
}

export {Students}
