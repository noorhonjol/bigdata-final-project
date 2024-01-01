const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Kafka } = require('kafkajs');
const {HandleQuery} = require('./HandleQuery');
const mongoose = require('mongoose');
const cors = require('cors');
const Tweet = require('./tweetSchema');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/big-data')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));


const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173',
    }
});
async function run() {
    // Create a Kafka client
    const kafka = new Kafka({
        clientId: '2',
        brokers: ['localhost:9092']
    });

    // Create a consumer
    const consumer = kafka.consumer({ groupId: '1' });

    // Connect the consumer
    await consumer.connect();

    // Subscribe to a topic
    await consumer.subscribe({ topic: 'top-users-tweets-topic'});

    // Consume messages
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            // send it to the client via socket.io
            io.emit('dbUpdate', message.value.toString());
        },
    });
}
run().catch(console.error);


// Start the server
const PORT = process.env.PORT || 3000;

app.post("/query",HandleQuery)


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});