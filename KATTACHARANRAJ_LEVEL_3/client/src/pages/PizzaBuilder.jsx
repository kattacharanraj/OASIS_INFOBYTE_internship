import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

// prices must match the server (server always re-checks)
const PRICES = { base: 150, cheese: 40, veggie: 20, meat: 50 };

export default function PizzaBuilder() {
    const [options, setOptions] = useState({ base: [], sauce: [], cheese: [], veggie: [], meat: [] });
    const [base, setBase] = useState('');
    const [sauce, setSauce] = useState('');
    const [cheese, setCheese] = useState('');
    const [veggies, setVeggies] = useState([]);
    const [meat, setMeat] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // load the ingredients that are in stock
    useEffect(() => {
        api.get('/pizza/options')
            .then((res) => setOptions(res.data))
            .catch(() => setError('Could not load ingredients'));
    }, []);

    // add/remove a veggie or meat from its list
    function toggle(list, setList, value) {
        if (list.includes(value)) {
            setList(list.filter((item) => item !== value));
        } else {
            setList([...list, value]);
        }
    }

    const price = PRICES.base + PRICES.cheese + veggies.length * PRICES.veggie + meat.length * PRICES.meat;

    function goToCheckout() {
        setError('');
        if (!base || !sauce || !cheese) {
            setError('Please choose a base, a sauce and a cheese.');
            return;
        }
        // remember the pizza and move to payment
        const pizza = { base, sauce, cheese, veggies, meat, price };
        localStorage.setItem('pizza', JSON.stringify(pizza));
        navigate('/checkout');
    }

    return (
        <div>
            <h1 className="section-title">🍕 Build Your Pizza</h1>

            {/* Step 1: base */}
            <div className="card step">
                <h2>Step 1: Choose a Base</h2>
                <div className="options-row">
                    {options.base.map((item) => (
                        <label key={item} className="choice">
                            <input type="radio" name="base" checked={base === item} onChange={() => setBase(item)} />
                            {item}
                        </label>
                    ))}
                </div>
            </div>

            {/* Step 2: sauce */}
            <div className="card step">
                <h2>Step 2: Choose a Sauce</h2>
                <div className="options-row">
                    {options.sauce.map((item) => (
                        <label key={item} className="choice">
                            <input type="radio" name="sauce" checked={sauce === item} onChange={() => setSauce(item)} />
                            {item}
                        </label>
                    ))}
                </div>
            </div>

            {/* Step 3: cheese */}
            <div className="card step">
                <h2>Step 3: Choose a Cheese</h2>
                <div className="options-row">
                    {options.cheese.map((item) => (
                        <label key={item} className="choice">
                            <input type="radio" name="cheese" checked={cheese === item} onChange={() => setCheese(item)} />
                            {item}
                        </label>
                    ))}
                </div>
            </div>

            {/* Step 4: veggies */}
            <div className="card step">
                <h2>Step 4: Add Veggies</h2>
                <div className="options-row">
                    {options.veggie.map((item) => (
                        <label key={item} className="choice">
                            <input type="checkbox" checked={veggies.includes(item)} onChange={() => toggle(veggies, setVeggies, item)} />
                            {item}
                        </label>
                    ))}
                </div>
            </div>

            {/* Step 5: meat (optional) */}
            <div className="card step">
                <h2>Step 5: Add Meat (optional)</h2>
                <div className="options-row">
                    {options.meat.map((item) => (
                        <label key={item} className="choice">
                            <input type="checkbox" checked={meat.includes(item)} onChange={() => toggle(meat, setMeat, item)} />
                            {item}
                        </label>
                    ))}
                </div>
            </div>

            <div className="card total-card">
                <h2>Total: ₹{price}</h2>
                {error && <p className="message error">{error}</p>}
                <button className="btn btn-green" onClick={goToCheckout}>Proceed to Payment</button>
            </div>
        </div>
    );
}
