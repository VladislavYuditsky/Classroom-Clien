import React from 'react';
import {Nav, Navbar, NavDropdown, Table} from "react-bootstrap";
import SockJsClient from 'react-stomp';
import {history} from "../utils";
import * as axios from "axios";
import hand from '../hand.svg';

class Members extends React.Component {
    constructor(props) {
        super(props);

        this.handleTabClose = this.handleTabClose.bind(this);

        let userData = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
        this.state = {
            username: userData ? userData.username : '',
            user: userData,
            isHandUp: userData ? userData.handUp : false,
            users: null
        }
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleTabClose);
    }

    componentWillMount() {
        if (!this.state.user || !this.state.user.authorized) {
            history.replace('/login');
        }

        axios.get('http://localhost:8080/users')
            .then((response) => {
                this.setState({
                    users: response.data
                })
            });
    }

    handleTabClose() {
        this.signOut()
    }

    sendMessage = () => {
        this.clientRef.sendMessage('/app/updateState');
    };

    handAction = () => {
        axios.post('http://localhost:8080/handAction', {
            username: this.state.username
        })
            .then(() => {
                this.sendMessage();
            });
    }

    signOut = () => {
        axios.post('http://localhost:8080/signOut', {
            username: this.state.username
        })
            .then(() => {
                this.sendMessage();
                sessionStorage.removeItem('user');
                history.replace('/login');
            });
    }

    render() {
        const {username, users, isHandUp, user} = this.state;
        return (
            <div>
                <Navbar bg="primary">
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <Nav className="mr-auto">
                            <NavDropdown title='Actions'>
                                <NavDropdown.Item onClick={this.handAction}>
                                    Raise hand
                                    {isHandUp ? ' down' : ' up'}
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            <NavDropdown title={username}>
                                <NavDropdown.Item onClick={this.signOut}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <div className="members">

                    {users &&
                    <div>
                        <h5>Class members</h5>
                        <Table>
                            <tbody>
                            {users.map(user =>
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.handUp && <img src={hand} alt='hand'/>}</td>
                                </tr>
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
                                  let updatedUser = user ? msg.find(item => item.id === user.id) : null;

                                  if (updatedUser) {
                                      sessionStorage.setItem('user', JSON.stringify(updatedUser));
                                      this.setState({
                                          isHandUp: updatedUser.handUp
                                      })
                                  }

                                  this.setState({
                                      users: msg
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
