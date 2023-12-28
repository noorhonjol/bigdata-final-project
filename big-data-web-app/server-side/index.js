const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { MongoClient } = require('mongodb');
const { Kafka } = require('kafkajs');

const app = express();
app.use(express.json());
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173',
    }
});

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

// async function pollDatabase() {
//     try {
//         const database = client.db('status');
//         const collection = database.collection('tweetStats');
//         const data = await collection.find({}).toArray(); // Modify as needed to fetch the required data
//         io.emit('dbUpdate', data); // Emit the data to all connected clients
//     } catch (error) {
//         console.error("Error during database polling:", error);
//     }
// }

// async function run() {
//     try {
//         await client.connect();
//         console.log("Connected successfully to MongoDB");

//         // Set up polling every 15 seconds
//         setInterval(pollDatabase, 15000);

//         // Note: The connection will remain open. You can perform additional database operations as needed.

//     } catch (error) {
//         console.error("Error occurred:", error);
//     }
// }

// run();


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
    await consumer.subscribe({ topic: 't2'});

    // Consume messages
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
            });
            io.emit('dbUpdate', message.value.toString());
        },
    });
}
run().catch(console.error);


// Start the server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
