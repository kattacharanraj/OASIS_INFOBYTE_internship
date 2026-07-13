import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage('');
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Something went wrong');
        }
    }

    return (
        <div className="card small-card">
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                <button type="submit" className="btn btn-green">Send Reset Link</button>
            </form>

            {message && <p className="message success">{message}</p>}

            <p className="link-text"><Link to="/">Back to Login</Link></p>
        </div>
    );
}
