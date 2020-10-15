import React from 'react';
import {Table} from "react-bootstrap";
import SockJsClient from 'react-stomp';
import {history} from "../utils";
import hand from '../icons/hand.svg';
import {NavigationBar} from "./Navbar";
import {API_URL, STOMP_ENDPOINT, USER, USERS_TOPIC} from "../constants";
import {LOGIN} from "../routes";
import {api} from "../api/app";

class Members extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null,
        }
    }

    componentWillMount() {
        if (!localStorage.getItem(USER)) {
            history.replace(LOGIN);
        }

        api.getAuthorizedUsers()
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

                <div className="screen-center">

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

                <SockJsClient url={API_URL + STOMP_ENDPOINT}
                              topics={[USERS_TOPIC]}
                              onConnect={() => {
                              }}
                              onDisconnect={() => {
                              }}
                              onMessage={(msg) => {
                                  if (!localStorage.getItem(USER)) {
                                      history.replace(LOGIN);
                                  }

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
