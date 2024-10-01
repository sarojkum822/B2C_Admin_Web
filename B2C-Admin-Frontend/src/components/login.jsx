import React from 'react';
import './login.css'; 
// Adjust the path accordingly

const Login = () => {
    return (
        <div className="login-container">
            <div className="box">
                <img src="/src/assets/logoimg.svg" alt="Your Icon" className="svg-icon" />

                <p className="login-text">B2C Website Admin Login</p>

                <form>
                    <p className='text-email'>Email:</p>
                    <input type="text" className="email-input" />
                    <p className='text-pass'>Password:</p>
                    <input type="password" className="password-input" />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
