/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Container, Wave, FormCon, IconCon, Button, ImgContainer, InputCon, StyledLink } from '../component/styles/signup-loginStyles';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import toast from "react-hot-toast"
import {MdLock} from 'react-icons/md'
import {BiSolidUser} from 'react-icons/bi';


export default function Login({ onLogin }) {
    const [isLoginUsernameFocused, setIsLoginUsernameFocused] = useState(false);
    const [isLoginPasswordFocused, setIsLoginPasswordFocused] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);

    const [loginData, setLoginData] = useState({ username: '', password: '' });

    const handleLogin = (e) => {
        e.preventDefault();

        // Dispatch the loginUser action
        dispatch(loginUser(loginData));

        const savedUserData = JSON.parse(localStorage.getItem('users'));

        if (savedUserData) {

            const matchingUser = savedUserData
                .find(user => user.username === loginData.username 
                    && user.password === loginData.password);

            // User data exists in local storage, check if it matches login data
            if (matchingUser) {
                // User data matches, perform the login action
                toast.success('Login successful');

                // Call the callback function passed from the parent component
                onLogin();
                // After successful login or signup
                localStorage.setItem('loggedInUser', JSON.stringify(matchingUser));
                navigate('/dashboard');

                // Clear the login form
            } else {
                // User data exists but doesn't match login data
                toast.error('Login failed. Please check your username and password.');
            }
        } else {
            // User data does not exist in local storage, prompt the user to sign up
            toast.error('User does not exist. Please sign up.');
        }
        setLoginData({ username: '', password: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUsernameFocus = () => {
        setIsLoginUsernameFocused(true);
    };

    const handleUsernameBlur = (e) => {
        if (e.target.value === "") {
            setIsLoginUsernameFocused(false);
        }
    };

    const handlePasswordFocus = () => {
        setIsLoginPasswordFocused(true);
    };

    const handlePasswordBlur = (e) => {
        if (e.target.value === "") {
            setIsLoginPasswordFocused(false);
        }
    };

    return (
        <>
            <Wave src="/wave.png" />
            <Container>
                <ImgContainer>
                    <img src="/welcome.svg" />
                </ImgContainer>
                <FormCon>
                    <form onSubmit={handleLogin} method="POST">
                        <img src="/avatar.svg" />
                        <h2>Welcome</h2>
                        <InputCon className={isLoginUsernameFocused ? 'focus' : ''}>
                            <IconCon>
                            <BiSolidUser/>
                            </IconCon>
                            <div>
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={loginData.username}
                                    onChange={handleChange}
                                    onFocus={handleUsernameFocus}
                                    onBlur={handleUsernameBlur}
                                    required
                                />
                            </div>
                        </InputCon>
                        <InputCon className={isLoginPasswordFocused ? 'focus' : ''}>
                            <IconCon>
                                <MdLock/>
                            </IconCon>
                            <div>
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    onFocus={handlePasswordFocus}
                                    onBlur={handlePasswordBlur}
                                    required
                                />
                            </div>
                        </InputCon>
                        <StyledLink>Do not have an account? <Link to='/'>Sign up</Link></StyledLink>
                        <Button>Login</Button>
                    </form>
                </FormCon>
            </Container>
        </>
    )
}
