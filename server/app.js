const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('../schema/schema');
const cors = require('cors');

const app = express();
const PORT = 3005;

mongoose.connect('mongodb+srv://admin:7a!_V%40V4bQysXXe@cluster0.yaym8iw.mongodb.net/graphql?retryWrites=true&w=majority');

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

const dbConnection = mongoose.connection;
dbConnection.on('error', (err) => console.error(`Connection error: ${err}`));
dbConnection.once('open', () => console.error('Connected to DB.'));

app.listen(PORT, (err) => {
  err ? console.error(err) : console.log('Server started on port ' + PORT);
});