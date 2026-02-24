const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('error', (err) => console.log('ERROR connect to MongoDB', err.message));
mongoose.connection.on('connected', () => console.log('Connected to database', mongoose.connection.name));

