require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://babzchizzy27:G5CzW1GEtmb4gct6@nasabecluster.knl4s.mongodb.net/?retryWrites=true&w=majority&appName=NasaBEcluster';
mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true, //determines how mongoose parses the connection string copied into the mongo_url
        useUnifiedTopology: true, // with this, mongoose will use the updated way talking to cluster of mongo db
    })
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}