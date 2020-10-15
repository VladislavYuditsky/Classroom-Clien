export const API_URL = 'http://localhost:8080/api/v2';

//endpoints
//auth
export const LOGIN = '/auth/login';
export const LOGOUT = '/auth/logout';
//user
export const AUTHORIZED_USERS = '/user/authorized';
export const UPDATE_HAND_STATE = '/user/update/hand-state';
export const UPDATE_EMAIL = '/user/update/email';
export const STUDENT = '/user/student';
export const STUDENTS = '/user/students';
//report
export const REPORT = '/report';

//path variable
export const SEARCH = 'search';

export const DATE_PATTERN = 'yyyy-mm-dd HH:MM:ss';

//search params
export const ACTION_EQUALS = 'action:';
export const DATE_FROM = 'dateTime>';
export const DATE_TO = 'dateTime<';

//Local Storage constants
export const USER = 'user';
export const TOKEN = 'token';

//JWT header
export const HEADER = 'Authorization';

//WebSocket destination prefix
export const WEBSOCKET_PREFIX = '/app/updateState';

//Stomp endpoint
export const STOMP_ENDPOINT = '/classroom-ws';

//Stomp topics
export const USERS_TOPIC = '/topic/users';
