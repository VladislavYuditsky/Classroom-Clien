import {createBrowserHistory} from "history";
import {TOKEN, USER} from "./constants";

export const history = createBrowserHistory();

export function isAuthorized() {
    return !!localStorage.getItem(USER);
}

export function isTeacher() {
    if (isAuthorized()) {
        return JSON.parse(localStorage.getItem(USER)).roles.indexOf('TEACHER') !== -1;
    } else {
        return false;
    }
}

export function isStudent() {
    if (isAuthorized()) {
        return JSON.parse(localStorage.getItem(USER)).roles.indexOf('STUDENT') !== -1;
    } else {
        return false;
    }
}

export function getToken() {
    return localStorage.getItem(TOKEN);
}