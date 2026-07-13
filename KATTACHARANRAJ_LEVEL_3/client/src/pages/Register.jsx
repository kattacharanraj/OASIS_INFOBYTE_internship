import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function handleRegister(e) {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await api.post('/auth/register', { name, email, password });
            setMessage(res.data.message);
            setName('');
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    }

    return (
        <div className="card small-card">
            <h1>📝 Register</h1>
            <form onSubmit={handleRegister}>
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />

                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" />

                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" />

                <button type="submit" className="btn btn-green">Register</button>
            </form>

            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}

            <p className="link-text">Already have an account? <Link to="/">Login here</Link></p>
        </div>
    );
}
