import React from 'react';
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {history, isStudent, isTeacher} from "../utils";
import SockJsClient from "react-stomp";
import classroom from '../icons/classroom.svg';
import {API_URL, STOMP_ENDPOINT, TOKEN, USER, USERS_TOPIC, WEBSOCKET_PREFIX} from "../constants";
import {api} from "../api/app";
import {LOGIN} from "../routes";

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);

        let userData = localStorage.getItem(USER) ? JSON.parse(localStorage.getItem(USER)) : null;
        this.state = {
            user: userData,
            username: userData ? userData.username : '',
            isHandUp: userData ? userData.handUp : false,
        }
    }

    handAction = () => {
        api.updateHandState()
            .then((response) => {
                this.setState({
                    isHandUp: !this.state.isHandUp
                })
                localStorage.setItem(USER, JSON.stringify(response.data))
                this.sendMessage();
            })
            .catch(() => {
                this.logout();
            });
    }

    logout = () => {
        api.logout()
            .then(() => {
                this.sendMessage();
                localStorage.removeItem(USER);
                localStorage.removeItem(TOKEN);
                history.replace(LOGIN);
            })
            .catch(() => {
                localStorage.removeItem(USER);
                localStorage.removeItem(TOKEN);
                history.replace(LOGIN);
            });
    }

    sendMessage = () => {
        this.clientRef.sendMessage(WEBSOCKET_PREFIX);
    };

    render() {
        const {username, isHandUp, user} = this.state;
        return (
            <div>
                <Navbar bg="primary">
                    <Navbar.Brand href="/members">
                        <img
                            src={classroom}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="classroom"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <Nav className="mr-auto">
                            <NavDropdown title='Actions'>
                                {isStudent() &&
                                <NavDropdown.Item onClick={this.handAction}>
                                    Raise hand
                                    {isHandUp ? ' down' : ' up'}
                                </NavDropdown.Item>
                                }
                                {isTeacher() &&
                                <NavDropdown.Item href={'/students'}>
                                    Students list
                                </NavDropdown.Item>
                                }
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            <NavDropdown title={username}>
                                {isTeacher() &&
                                <NavDropdown.Item href={'/settings'}>Settings</NavDropdown.Item>
                                }
                                <NavDropdown.Item onClick={this.logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <SockJsClient url={API_URL + STOMP_ENDPOINT}
                              topics={[USERS_TOPIC]}
                              onConnect={() => {
                              }}
                              onDisconnect={() => {
                              }}
                              onMessage={(msg) => {
                                  let updatedUser = user ? msg.find(item => item.id === user.id) : null;

                                  if (updatedUser) {
                                      sessionStorage.setItem(USER, JSON.stringify(updatedUser));
                                      this.setState({
                                          isHandUp: updatedUser.handUp
                                      })
                                  }
                              }}
                              ref={(client) => {
                                  this.clientRef = client
                              }}/>
            </div>
        )
    }
}

export {NavigationBar}
