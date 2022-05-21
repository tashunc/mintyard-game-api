
import {router} from './routes/gateway';
import mongoose from 'mongoose';
import initializeMoralis from "./services/moralis-services";
const express = require('express')
const cors = require('cors');


// const index = require('../routes/gateway');
// const schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);


// const options = {
//     server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
//     replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}}
//
// };
initializeMoralis().subscribe((data: any) => {console.log(data)})
const mongodbUri = 'mongodb+srv://test:test123@cluster0.rqpga.mongodb.net/ScoreDatabase?retryWrites=true&w=majority';

mongoose.connect(mongodbUri).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
//mongoose.connect('mongodb://127.0.0.1:27017/restaurant-management');

const conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function () {
    // Wait for the database connection to establish, then start the app.
    console.log('Connecting to port ' + process.env.Port)
    const app = express();
    // const PORT = 3000

    app.use(express.json())
    app.use((req: any, res:any, next:any) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "append,delete,entries,foreach,get,has,keys,set,values,Authorization");
        next();
    });
    app.use(cors());
    app.use('/', router);
// app.use('/graphql', graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true,
// }));
// app.listen(process.env.PORT || 5000)
    app.listen(process.env.PORT || 5000,
        () => console.log('listens to '.concat(process.env.PORT + ' or ' +  5000) ));
});


