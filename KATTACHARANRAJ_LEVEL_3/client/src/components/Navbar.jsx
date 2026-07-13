import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../auth';

export default function Navbar() {
    const user = getUser();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
    }

    // don't show the navbar when nobody is logged in
    if (!user) return null;

    return (
        <nav className="navbar">
            <span className="navbar-brand">🍕 Pizza App</span>

            <div className="navbar-links">
                {user.role === 'admin' ? (
                    <>
                        <Link to="/admin">Dashboard</Link>
                        <Link to="/admin/inventory">Inventory</Link>
                        <Link to="/admin/orders">Orders</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard">Home</Link>
                        <Link to="/build">Build Pizza</Link>
                        <Link to="/orders">My Orders</Link>
                    </>
                )}
                <span className="navbar-user">Hi, {user.name}</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}
