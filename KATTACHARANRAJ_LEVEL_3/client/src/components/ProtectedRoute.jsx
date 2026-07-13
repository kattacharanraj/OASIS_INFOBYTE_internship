import { Navigate } from 'react-router-dom';
import { getUser } from '../auth';

// Wraps a page so only logged-in (or only admin) users can see it
export default function ProtectedRoute({ children, adminOnly }) {
    const user = getUser();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
