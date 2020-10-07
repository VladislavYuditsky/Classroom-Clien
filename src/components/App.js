import React from 'react';
import {Redirect, Route, Router, Switch} from "react-router";

import {history} from "../utils";
import {Login} from "./Login";
import {Members} from "./Members";
import {Students} from "./Students"
import {Student} from "./Student";
import {Settings} from "./Settings";
import {NotFound} from "./NotFound";

export default () => (
    <Router history={history}>
        <Switch>
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
            <Route exact path='/settings'>
                <Settings/>
            </Route>
            <Route path={'/student/:username'} component={Student}/>
            <Route component={NotFound}/>
        </Switch>
    </Router>
);
