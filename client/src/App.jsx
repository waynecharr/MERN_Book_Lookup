import React from 'react';
import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Outlet />
        </>
      </Router>
    </ApolloProvider>
  );
}

// function App() {
//   return (
//     <>
//       <Navbar />
//       <Outlet />
//     </>
//   );
// }


export default App;
