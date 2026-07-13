import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await api.post(`/auth/reset-password/${token}`, { password });
            setMessage(res.data.message);
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    }

    return (
        <div className="card small-card">
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <label>New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a new password" />
                <button type="submit" className="btn btn-green">Update Password</button>
            </form>

            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}

            <p className="link-text"><Link to="/">Back to Login</Link></p>
        </div>
    );
}
