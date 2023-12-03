const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Implements the Apollo Server and applies it to the Express server as Middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Add your authentication logic here if needed
    // For example, you can extract user information from req.headers and pass it to the context
    const user = req.user || null;
    return { user };
  },
});

// Apply Apollo Server as middleware to Express
server.applyMiddleware({ app, path: '/graphql' });

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
