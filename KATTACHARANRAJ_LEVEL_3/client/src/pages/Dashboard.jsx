import { Link } from 'react-router-dom';

// A few ready-made pizza varieties to show on the dashboard
const varieties = [
    { emoji: '🍅', name: 'Margherita', desc: 'Classic tomato, mozzarella and basil' },
    { emoji: '🌶️', name: 'Spicy BBQ Chicken', desc: 'BBQ sauce, chicken and onions' },
    { emoji: '🧀', name: 'Cheese Burst', desc: 'Loaded with extra mozzarella and cheddar' },
    { emoji: '🥦', name: 'Veggie Delight', desc: 'Capsicum, mushroom, corn and olives' },
    { emoji: '🍖', name: 'Pepperoni Feast', desc: 'Pepperoni with a rich tomato base' },
    { emoji: '🌿', name: 'Pesto Garden', desc: 'Fresh pesto sauce with garden veggies' }
];

export default function Dashboard() {
    return (
        <div>
            <div className="card banner">
                <h1>🍕 Welcome to Pizza App</h1>
                <p>Pick a favourite below or build your very own pizza!</p>
                <Link to="/build"><button className="btn btn-green">Build Your Own Pizza</button></Link>
            </div>

            <h2 className="section-title">Available Pizza Varieties</h2>
            <div className="grid">
                {varieties.map((pizza) => (
                    <div className="card variety-card" key={pizza.name}>
                        <div className="variety-emoji">{pizza.emoji}</div>
                        <h3>{pizza.name}</h3>
                        <p>{pizza.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
