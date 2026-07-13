import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { saveAuth } from '../auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            saveAuth(res.data.token, res.data.user);

            // send admins to the admin area, users to their dashboard
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    }

    return (
        <div className="card small-card">
            <h1>🔐 Login</h1>
            <form onSubmit={handleLogin}>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />

                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />

                <button type="submit" className="btn btn-green">Login</button>
            </form>

            {error && <p className="message error">{error}</p>}

            <p className="link-text"><Link to="/forgot">Forgot password?</Link></p>
            <p className="link-text">No account? <Link to="/register">Register here</Link></p>
        </div>
    );
}
