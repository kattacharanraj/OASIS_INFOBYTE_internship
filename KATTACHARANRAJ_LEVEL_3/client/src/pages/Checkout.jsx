import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Checkout() {
    const navigate = useNavigate();
    const pizza = JSON.parse(localStorage.getItem('pizza'));
    const [error, setError] = useState('');
    const [paying, setPaying] = useState(false);

    // if someone opens checkout without building a pizza
    if (!pizza) {
        return (
            <div className="card small-card">
                <h1>No pizza selected</h1>
                <button className="btn btn-green" onClick={() => navigate('/build')}>Build a Pizza</button>
            </div>
        );
    }

    async function payNow() {
        setError('');
        setPaying(true);
        try {
            // this is a dummy payment - we just place the order
            await api.post('/orders', {
                base: pizza.base,
                sauce: pizza.sauce,
                cheese: pizza.cheese,
                veggies: pizza.veggies,
                meat: pizza.meat
            });
            localStorage.removeItem('pizza');
            alert('Payment successful! Your order has been placed.');
            navigate('/orders');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not place order');
            setPaying(false);
        }
    }

    return (
        <div className="card small-card">
            <h1>💳 Checkout</h1>

            <div className="summary">
                <p><strong>Base:</strong> {pizza.base}</p>
                <p><strong>Sauce:</strong> {pizza.sauce}</p>
                <p><strong>Cheese:</strong> {pizza.cheese}</p>
                <p><strong>Veggies:</strong> {pizza.veggies.length ? pizza.veggies.join(', ') : 'None'}</p>
                <p><strong>Meat:</strong> {pizza.meat.length ? pizza.meat.join(', ') : 'None'}</p>
                <hr />
                <h2>Total: ₹{pizza.price}</h2>
            </div>

            <p className="hint">This is a dummy payment for the demo.</p>
            <button className="btn btn-green" onClick={payNow} disabled={paying}>
                {paying ? 'Processing...' : `Pay ₹${pizza.price} & Place Order`}
            </button>

            {error && <p className="message error">{error}</p>}
        </div>
    );
}
