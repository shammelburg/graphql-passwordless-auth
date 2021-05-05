const gql = require('graphql-tag')

const typeDefs = gql`
    type Query {
        request(emailAddress: String!): Boolean!
        verify(token: String!): String!
    }
   
`

module.exports = typeDefs