import React, { useState } from 'react';
import { submitLogin } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Global.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const credentials = { 
                
                username: email, 
                password: password };
            const response = await submitLogin(credentials);
            if(response){
                localStorage.setItem('token', response.token);
                navigate('/dashboard'); 

            }
            console.log('Login successful:', response.data);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-page">
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
        </div>
    );
};

export default LoginForm;
