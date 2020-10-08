import React from 'react';
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {history, isStudent, isTeacher} from "../utils";
import * as axios from "axios";
import SockJsClient from "react-stomp";
import classroom from '../icons/classroom.svg';

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);

        let userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        this.state = {
            username: userData ? userData.username : '',
            isHandUp: userData ? userData.handUp : false,
        }
    }


    handAction = () => {
        axios.post('http://localhost:8080/handAction', {
            username: this.state.username
        })
            .then((response) => {
                this.setState({
                    isHandUp: !this.state.isHandUp
                })
                localStorage.setItem('user', JSON.stringify(response.data))
                this.sendMessage();
            });
    }

    signOut = () => {
        axios.post('http://localhost:8080/signOut', {
            username: this.state.username
        })
            .then(() => {
                this.sendMessage();
                localStorage.removeItem('user');
                history.replace('/login');
            });
    }

    sendMessage = () => {
        this.clientRef.sendMessage('/app/updateState');
    };

    render() {
        const {username, isHandUp} = this.state;
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
                                <NavDropdown.Item onClick={this.signOut}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <SockJsClient url='http://localhost:8080/classroom-ws/'
                              topics={['/topic/users']}
                              onConnect={() => {
                              }}
                              onDisconnect={() => {
                              }}
                              onMessage={() => {
                              }}
                              ref={(client) => {
                                  this.clientRef = client
                              }}/>
            </div>
        )
    }
}

export {NavigationBar}
