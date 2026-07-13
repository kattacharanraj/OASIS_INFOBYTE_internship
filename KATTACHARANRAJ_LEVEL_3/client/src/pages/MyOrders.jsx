import { useEffect, useState } from 'react';
import api from '../api';

// give each status a colour so it is easy to read
const statusClass = {
    'Order Received': 'badge-yellow',
    'In the Kitchen': 'badge-blue',
    'Sent to Delivery': 'badge-green',
    'Delivered': 'badge-gray'
};

export default function MyOrders() {
    const [orders, setOrders] = useState([]);

    function loadOrders() {
        api.get('/orders/mine')
            .then((res) => setOrders(res.data))
            .catch(() => {});
    }

    useEffect(() => {
        loadOrders();
        // check for status updates from the admin every 5 seconds
        const timer = setInterval(loadOrders, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div>
            <h1 className="section-title">My Orders</h1>

            {orders.length === 0 && <p className="card">You have no orders yet.</p>}

            {orders.map((order) => (
                <div className="card order-card" key={order._id}>
                    <div className="order-top">
                        <h3>{order.base} Pizza - ₹{order.price}</h3>
                        <span className={`badge ${statusClass[order.status]}`}>{order.status}</span>
                    </div>
                    <p><strong>Sauce:</strong> {order.sauce} | <strong>Cheese:</strong> {order.cheese}</p>
                    <p><strong>Veggies:</strong> {order.veggies.length ? order.veggies.join(', ') : 'None'}</p>
                    <p><strong>Meat:</strong> {order.meat.length ? order.meat.join(', ') : 'None'}</p>
                    <p className="order-date">Ordered on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}
