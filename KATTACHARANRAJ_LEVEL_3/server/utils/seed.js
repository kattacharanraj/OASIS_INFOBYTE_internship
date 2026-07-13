const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

// Runs once when the server starts:
// 1) make sure an admin account exists
// 2) fill the inventory with starter ingredients if it is empty
async function seedData() {
    // ---- admin account ----
    const adminEmail = process.env.ADMIN_EMAIL;
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
        const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        await User.create({
            name: 'Admin',
            email: adminEmail,
            password: hashed,
            role: 'admin',
            isVerified: true
        });
        console.log(`Admin account created -> ${adminEmail} / ${process.env.ADMIN_PASSWORD}`);
    }

    // ---- a ready-to-use test user (already verified, so you can log in right away) ----
    const testEmail = 'test@gmail.com';
    const existingUser = await User.findOne({ email: testEmail });

    if (!existingUser) {
        const hashed = await bcrypt.hash('test123', 10);
        await User.create({
            name: 'Test User',
            email: testEmail,
            password: hashed,
            role: 'user',
            isVerified: true
        });
        console.log(`Test user created -> ${testEmail} / test123`);
    }

    // ---- starter inventory ----
    const count = await Inventory.countDocuments();
    if (count === 0) {
        const starter = [
            // 3 pizza bases
            { name: 'Thin Crust', category: 'base', stock: 50, threshold: 20 },
            { name: 'Thick Crust', category: 'base', stock: 50, threshold: 20 },
            { name: 'Cheese Burst', category: 'base', stock: 50, threshold: 20 },
            // 3 sauces
            { name: 'Tomato', category: 'sauce', stock: 50, threshold: 20 },
            { name: 'Pesto', category: 'sauce', stock: 50, threshold: 20 },
            { name: 'BBQ', category: 'sauce', stock: 50, threshold: 20 },
            // cheese types
            { name: 'Mozzarella', category: 'cheese', stock: 50, threshold: 20 },
            { name: 'Cheddar', category: 'cheese', stock: 50, threshold: 20 },
            // veggies
            { name: 'Onion', category: 'veggie', stock: 50, threshold: 20 },
            { name: 'Capsicum', category: 'veggie', stock: 50, threshold: 20 },
            { name: 'Mushroom', category: 'veggie', stock: 50, threshold: 20 },
            { name: 'Tomato Slices', category: 'veggie', stock: 50, threshold: 20 },
            { name: 'Corn', category: 'veggie', stock: 50, threshold: 20 },
            { name: 'Olives', category: 'veggie', stock: 50, threshold: 20 },
            // meat
            { name: 'Chicken', category: 'meat', stock: 50, threshold: 20 },
            { name: 'Pepperoni', category: 'meat', stock: 50, threshold: 20 }
        ];
        await Inventory.insertMany(starter);
        console.log('Starter inventory added.');
    }
}

module.exports = seedData;
