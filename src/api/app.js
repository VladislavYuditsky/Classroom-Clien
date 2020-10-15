import {
    API_URL,
    AUTHORIZED_USERS,
    HEADER,
    LOGIN,
    LOGOUT,
    REPORT,
    SEARCH,
    STUDENT,
    STUDENTS,
    UPDATE_EMAIL,
    UPDATE_HAND_STATE
} from "../constants";
import axios from 'axios';
import {getToken} from "../utils";

axios.defaults.baseURL = API_URL;

axios.interceptors.request.use(config => {
    getToken() && (config.headers[HEADER] = getToken());
    return config;
});

//auth
const login = data => axios.post(LOGIN, data);
const logout = () => axios.post(LOGOUT)
//user
const getAuthorizedUsers = () => axios.get(AUTHORIZED_USERS);
const updateHandState = () => axios.patch(UPDATE_HAND_STATE);
const updateEmail = (email) => axios.patch(UPDATE_EMAIL, email);
const getStudentActions = (username, searchParams) => axios.get(`${STUDENT}/${username}?${SEARCH}=${searchParams}`);
const getStudents = () => axios.get(STUDENTS);
//report
const getReport = () => axios.get(REPORT);
const updateReport = (data) => axios.put(REPORT, data);
const deleteReport = (id) => axios.delete(REPORT, id);
const saveReport = (data) => axios.post(REPORT, data);

export const api = {
    login,
    logout,
    getAuthorizedUsers,
    updateHandState,
    updateEmail,
    getStudentActions,
    getStudents,
    getReport,
    updateReport,
    deleteReport,
    saveReport
};
