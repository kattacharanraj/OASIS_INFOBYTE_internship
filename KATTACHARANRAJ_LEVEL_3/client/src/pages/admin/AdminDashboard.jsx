import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalOrders: 0, lowStock: [] });

    useEffect(() => {
        api.get('/admin/stats')
            .then((res) => setStats(res.data))
            .catch(() => {});
    }, []);

    return (
        <div>
            <h1 className="section-title">Admin Dashboard</h1>

            <div className="grid">
                <div className="card stat-card">
                    <h2>{stats.totalOrders}</h2>
                    <p>Total Orders</p>
                </div>
                <div className="card stat-card">
                    <h2>{stats.lowStock.length}</h2>
                    <p>Low Stock Items</p>
                </div>
            </div>

            <div className="card">
                <h2>⚠️ Low Stock Alerts</h2>
                {stats.lowStock.length === 0 ? (
                    <p>All ingredients are well stocked.</p>
                ) : (
                    <ul className="alert-list">
                        {stats.lowStock.map((item) => (
                            <li key={item._id}>
                                <strong>{item.name}</strong> ({item.category}) — only {item.stock} left
                                (threshold {item.threshold})
                            </li>
                        ))}
                    </ul>
                )}
                <p className="hint">The admin also gets an email when an item drops below its threshold.</p>
            </div>

            <div className="card">
                <h2>Quick Links</h2>
                <Link to="/admin/inventory"><button className="btn btn-blue">Manage Inventory</button></Link>{' '}
                <Link to="/admin/orders"><button className="btn btn-blue">Manage Orders</button></Link>
            </div>
        </div>
    );
}
