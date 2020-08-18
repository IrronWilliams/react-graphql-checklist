import React from 'react' 
import ReactDOM from 'react-dom' 
import App from './App' 
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

/*Setting up Apollo. uri copied from the GrahpiQL endpoint  */
const client = new ApolloClient({
  uri: 'https://react-todo-graphqliw.herokuapp.com/v1/graphql' 
})

/*Passing ApolloClient throughout the entire application. Apollo will be passing the json data returned from the GraphiQL queries.
Wrapping ApolloProvider around App to pass the client throughout the entire app. There is a special prop for the client and setting the
prop equal to the instantiated client.*/
ReactDOM.render(
<ApolloProvider client={client}>
  <App />
</ApolloProvider>,
document.getElementById('root')) 

