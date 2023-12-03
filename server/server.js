const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth')
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./schemas/resolvers');

const app = express();
const PORT = process.env.PORT || 3033;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Implements the Apollo Server and applies it to the Express server as Middleware
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await server.start();

  // Apply Apollo Server as middleware to Express
  server.applyMiddleware({ app, path: '/graphql' });

  // If we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
};

// Call the async function to start the server
startServer().catch((error) => {
  console.error('Error starting the server:', error);
});