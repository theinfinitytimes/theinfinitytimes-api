const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const {typeDefs, resolvers} = require('./server');
const routes = require('./server/routes/routes');
dotenv.config();

const url = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'localhost';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => req,
    debug: process.env.NODE_ENV === 'development',
    introspection: true,
    playground: (process.env.NODE_ENV === 'development')
});


const app = express();
app.use(morgan('dev', {
    stream: {
        write: msg => console.log(msg)
    }
}));
app.use(helmet());
app.use(cors({
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/api', routes);

server.applyMiddleware({ app });


const connection = mongoose.connect(url, {
    autoIndex: true,
    bufferMaxEntries: 0,
    keepAlive: 120,
    poolSize: 50,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

mongoose.set('useCreateIndex', true);

connection
    .then(app.listen({port: process.env.PORT}, () => {
            if (process.env.NODE_ENV === 'development') {
                console.log(
                    `Server ready at ${process.env.SERVER}:${process.env.PORT}`,
                    `NODE_ENV=${process.env.NODE_ENV}`
                )
            }
        }
    ))
    .catch(err => {
        console.log(err)
    });
