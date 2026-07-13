import { useEffect, useState } from 'react';
import api from '../../api';

const STATUSES = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    function loadOrders() {
        api.get('/admin/orders')
            .then((res) => setOrders(res.data))
            .catch(() => {});
    }

    useEffect(() => {
        loadOrders();
        // pick up new orders automatically
        const timer = setInterval(loadOrders, 5000);
        return () => clearInterval(timer);
    }, []);

    async function changeStatus(id, status) {
        await api.put(`/admin/orders/${id}/status`, { status });
        loadOrders();
    }

    return (
        <div>
            <h1 className="section-title">Manage Orders</h1>

            {orders.length === 0 && <p className="card">No orders yet.</p>}

            {orders.map((order) => (
                <div className="card order-card" key={order._id}>
                    <div className="order-top">
                        <h3>{order.customerName} — {order.base} Pizza (₹{order.price})</h3>
                        <span className="badge badge-blue">{order.status}</span>
                    </div>
                    <p><strong>Sauce:</strong> {order.sauce} | <strong>Cheese:</strong> {order.cheese}</p>
                    <p><strong>Veggies:</strong> {order.veggies.length ? order.veggies.join(', ') : 'None'}</p>
                    <p><strong>Meat:</strong> {order.meat.length ? order.meat.join(', ') : 'None'}</p>

                    <label>Update Status: </label>
                    <select value={order.status} onChange={(e) => changeStatus(order._id, e.target.value)}>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
}
