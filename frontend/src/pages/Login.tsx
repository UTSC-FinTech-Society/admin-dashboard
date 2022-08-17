import React, { useState } from 'react';
import Logo from "../assets/utsc-fts-logo.png";
import UTSCBackground from "../assets/utsc-background.jpeg";
import Loading from '../components/Loading';
import { FaUser, FaLock } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { loginAdmin } from '../features/admin/adminSlice';
import { AppDispatch, RootState } from '../store';

const Login = () => {

    const admin = useSelector((state: RootState) => state.admin);

    const dispatch = useDispatch<AppDispatch>();

    const [loginData, setLoginData] = useState({ username: '', password: '' });

    const { username, password } = loginData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData(previousData => ({ ...previousData, [e.target.name]: e.target.value }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (username === '' || password === '') {
            toast.error('Please fill in all necessary fields', { autoClose: 3000 });
            return;
        }

        dispatch(loginAdmin({ username, password }));
    }

    return (
        <div className="login-page-container" style={{backgroundImage: `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url(${UTSCBackground})`}} >
            <div className="login-form-container">
                <img src={Logo} alt="FTS Logo" className='logo' />
                <form onSubmit={onSubmit}>
                    <div className="input-container username">
                        <label htmlFor="username"><FaUser size='20px' color='#828282' /></label>
                        <input type="text" name="username" id="username" value={username} onChange={onChange} placeholder='Username' autoComplete='off' required/>
                    </div>
                    <div className="input-container password">
                        <label htmlFor="password"><FaLock size='20px' color='#828282' /></label>
                        <input type="password" name="password" id="password" value={password} onChange={onChange}  placeholder='Password' autoComplete='off' required/>
                    </div>
                    <button type="submit" className='login-btn'>{admin.isLoading ? <Loading border='2px' color='white' size='18px' /> : 'Login'}</button>
                </form>
            </div>
        </div>
    )
};

export default Login;