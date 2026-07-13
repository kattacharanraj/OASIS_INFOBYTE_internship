import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function VerifyEmail() {
    const { token } = useParams();
    const [message, setMessage] = useState('Verifying your email...');
    const [ok, setOk] = useState(false);

    useEffect(() => {
        async function verify() {
            try {
                const res = await api.get(`/auth/verify/${token}`);
                setMessage(res.data.message);
                setOk(true);
            } catch (err) {
                setMessage(err.response?.data?.message || 'Verification failed');
                setOk(false);
            }
        }
        verify();
    }, [token]);

    return (
        <div className="card small-card">
            <h1>Email Verification</h1>
            <p className={ok ? 'message success' : 'message error'}>{message}</p>
            {ok && <p className="link-text"><Link to="/">Go to Login</Link></p>}
        </div>
    );
}
