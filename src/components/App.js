import React from 'react';
import {Redirect, Route, Router, Switch} from "react-router";

import {history} from "../utils";
import {Login} from "./Login";
import {Members} from "./Members";
import {Students} from "./Students"
import {Student} from "./Student";
import {Settings} from "./Settings";
import {NotFound} from "./NotFound";
import {LOGIN, MEMBERS, SETTINGS, STUDENT, STUDENTS} from "../routes";

export default () => (
    <Router history={history}>
        <Switch>
            <Route exact path='/'>
                <Redirect to={MEMBERS}/>
            </Route>
            <Route exact path={LOGIN}>
                <Login/>
            </Route>
            <Route exact path={MEMBERS}>
                <Members/>
            </Route>
            <Route exact path={STUDENTS}>
                <Students/>
            </Route>
            <Route exact path={SETTINGS}>
                <Settings/>
            </Route>
            <Route path={`${STUDENT}/:username`} component={Student}/>
            <Route component={NotFound}/>
        </Switch>
    </Router>
);
