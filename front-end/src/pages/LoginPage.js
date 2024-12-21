import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleAuth = async (e) => {
        e.preventDefault();
        const endpoint = isRegistering ? 'register' : 'login';
        try {
            const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                if (endpoint === "register") {
                    alert("Successfully registered user! Use your new username and password to log in.");
                }
                localStorage.setItem('token', data.token); // Store token
                navigate('/home'); // Redirect to the program's home page
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>{isRegistering ? 'Register' : 'Login'}</h1>
            <form onSubmit={handleAuth}>
                <div className="Login-form">
                    <input id = "user-auth"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input id = "user-auth"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" id="auth-button">{isRegistering ? 'Register' : 'Login'}</button>
            </form>
            <button id="auth-button" onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Already have an account? Log in' : 'Create an account'}
            </button>
        </div>
    );
};

export default LoginPage;
