import React from 'react';
import {Table} from "react-bootstrap";
import SockJsClient from 'react-stomp';
import {history} from "../utils";
import * as axios from "axios";
import hand from '../hand.svg';
import {NavigationBar} from "./Navbar";

class Members extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null,
        }
    }

    componentWillMount() {
        if (!localStorage.getItem('user')) {
            history.replace('/login');
        }

        axios.get('http://localhost:8080/users')
            .then((response) => {
                this.setState({
                    users: response.data
                })
            });
    }

    render() {
        const {users} = this.state;
        return (
            <div>
                <NavigationBar/>

                <div className="members">

                    {users &&
                    <div>
                        <h5>Class members</h5>
                        <Table>
                            <tbody>
                            {users.map(user => {
                                    if (user.roles.indexOf('STUDENT') !== -1)
                                        return <tr key={user.id}>
                                            <td>{user.username}</td>
                                            <td>{user.handUp && <img src={hand} alt='hand'/>}</td>
                                        </tr>
                                }
                            )}
                            </tbody>
                        </Table>
                    </div>
                    }

                </div>

                <SockJsClient url='http://localhost:8080/classroom-ws/'
                              topics={['/topic/users']}
                              onConnect={() => {
                              }}
                              onDisconnect={() => {
                              }}
                              onMessage={(msg) => {
                                  this.setState({
                                      users: msg,
                                  })
                              }}
                              ref={(client) => {
                                  this.clientRef = client
                              }}/>
            </div>
        )
    }
}

export {Members}
