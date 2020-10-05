import React from 'react';
import {Redirect, Route, Router} from "react-router";

import {history} from "../utils";
import {Login} from "./Login";
import {Members} from "./Members";
import {Students} from "./Students"
import {Student} from "./Student";

export default () => (
    <Router history={history}>
        <Route exact path='/'>
            <Redirect to='/members'/>
        </Route>
        <Route exact path='/login'>
            <Login/>
        </Route>
        <Route exact path='/members'>
            <Members/>
        </Route>
        <Route exact path='/students'>
            <Students/>
        </Route>
        <Route path={'/student/:username'} component={Student}/>
    </Router>
);
