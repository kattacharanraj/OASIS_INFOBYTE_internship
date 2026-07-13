const mongoose = require('mongoose');

// Connect to MongoDB.
// 1) Try the real database from the .env file (MONGO_URI).
// 2) If that is not available, start a built-in in-memory MongoDB automatically
//    so the demo still works with no setup. (In-memory data resets on restart.)
async function connectDB() {
    const uri = process.env.MONGO_URI;

    try {
        // fail fast (3s) if no real MongoDB is running
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        console.log('MongoDB connected!');
        return;
    } catch (err) {
        console.log('No MongoDB found at', uri);
        console.log('Starting a built-in in-memory database instead...');
        console.log('(This works with no setup. Data resets each time the server stops.)');
    }

    try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mem = await MongoMemoryServer.create();
        await mongoose.connect(mem.getUri());
        console.log('In-memory MongoDB ready!');
    } catch (memErr) {
        console.log('Could not start the in-memory database:', memErr.message);
        process.exit(1);
    }
}

module.exports = connectDB;
