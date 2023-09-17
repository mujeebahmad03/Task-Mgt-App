import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const userService = axios.create({
    baseURL: BASE_URL,
});

export const signUp = (userData) => userService.post('/users', userData);
export const login = (username, password) => userService.get(`/users?username=${username}&password=${password}`);
export const updateProfileService = (userId, updatedData) => {
    // Assuming there is an endpoint like /users/:userId for updating profiles
    return userService.put(`/users/${userId}`, updatedData);
};
