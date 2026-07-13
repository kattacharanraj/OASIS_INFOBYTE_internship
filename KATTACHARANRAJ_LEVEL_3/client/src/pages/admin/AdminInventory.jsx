import { useEffect, useState } from 'react';
import api from '../../api';

export default function AdminInventory() {
    const [items, setItems] = useState([]);
    // form for adding a new ingredient
    const [newItem, setNewItem] = useState({ name: '', category: 'base', stock: 50, threshold: 20 });

    function loadItems() {
        api.get('/admin/inventory')
            .then((res) => setItems(res.data))
            .catch(() => {});
    }

    useEffect(() => {
        loadItems();
    }, []);

    // change the stock/threshold value in the table (before saving)
    function editValue(id, field, value) {
        setItems(items.map((it) => (it._id === id ? { ...it, [field]: Number(value) } : it)));
    }

    async function saveItem(item) {
        await api.put(`/admin/inventory/${item._id}`, { stock: item.stock, threshold: item.threshold });
        alert(`${item.name} updated`);
        loadItems();
    }

    async function deleteItem(id) {
        if (!window.confirm('Delete this ingredient?')) return;
        await api.delete(`/admin/inventory/${id}`);
        loadItems();
    }

    async function addItem(e) {
        e.preventDefault();
        if (!newItem.name) {
            alert('Please enter a name');
            return;
        }
        await api.post('/admin/inventory', newItem);
        setNewItem({ name: '', category: 'base', stock: 50, threshold: 20 });
        loadItems();
    }

    return (
        <div>
            <h1 className="section-title">Inventory Management</h1>

            {/* add new ingredient */}
            <div className="card">
                <h2>Add Ingredient</h2>
                <form onSubmit={addItem} className="inline-form">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                    <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
                        <option value="base">Base</option>
                        <option value="sauce">Sauce</option>
                        <option value="cheese">Cheese</option>
                        <option value="veggie">Veggie</option>
                        <option value="meat">Meat</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Stock"
                        value={newItem.stock}
                        onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="Threshold"
                        value={newItem.threshold}
                        onChange={(e) => setNewItem({ ...newItem, threshold: Number(e.target.value) })}
                    />
                    <button type="submit" className="btn btn-green">Add</button>
                </form>
            </div>

            {/* inventory table */}
            <div className="card">
                <h2>All Ingredients</h2>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Threshold</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item._id} className={item.stock < item.threshold ? 'low-row' : ''}>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.stock}
                                            onChange={(e) => editValue(item._id, 'stock', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.threshold}
                                            onChange={(e) => editValue(item._id, 'threshold', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <button className="btn btn-blue small" onClick={() => saveItem(item)}>Save</button>{' '}
                                        <button className="btn btn-red small" onClick={() => deleteItem(item._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
