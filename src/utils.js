import {createBrowserHistory} from "history";

export const history = createBrowserHistory();

export function isAuthorized() {
    return !!localStorage.getItem('user');
}

export function isTeacher() {
    if (isAuthorized()) {
        return JSON.parse(localStorage.getItem('user')).roles.indexOf('TEACHER') !== -1;
    } else {
        return false;
    }
}

export function isStudent() {
    if (isAuthorized()) {
        return JSON.parse(localStorage.getItem('user')).roles.indexOf('STUDENT') !== -1;
    } else {
        return false;
    }
}