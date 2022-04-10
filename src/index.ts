import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import buildSchema from 'express';
import {router} from './routes/gateway';
import mongoose from 'mongoose';

// const index = require('../routes/gateway');
// const schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

const root = {hello: () => 'Hello world!'};

const options = {
    server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
    replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}}

};

const mongodbUri = 'mongodb+srv://test:test123@cluster0.rqpga.mongodb.net/ScoreDatabase?retryWrites=true&w=majority';

mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
//mongoose.connect('mongodb://127.0.0.1:27017/restaurant-management');

const conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function () {
    // Wait for the database connection to establish, then start the app.
    console.log('Connecting to port 3000')
    const app = express();
    const PORT = 3000

    app.use(express.json())

    app.use('/', router);
// app.use('/graphql', graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true,
// }));
    app.listen(PORT, () => console.log('Up in  localhost:3000'));
});


