import React from 'react';
import {NavigationBar} from "./Navbar";
import {isAuthorized} from "../utils";

class NotFound extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {isAuthorized() &&
                <NavigationBar/>
                }
                <div className="screen-center">
                    <h2>Not found 404</h2>
                </div>
            </div>
        )
    }
}

export {NotFound}
