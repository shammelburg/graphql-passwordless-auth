const express = require('express')
const { graphqlHTTP } = require('express-graphql')

const app = express()
const schema = require('./src/schema')

app.get('/', (req, res) => res.send('GraphQL Server is running'))

const PORT = process.env.PORT

// If no context is created here, the request object is passed instead
app.use('/graphql', graphqlHTTP(req => ({
    schema,
    graphiql: {
        headerEditorEnabled: true
    }
})))

const server = app.listen(PORT, () => {
    const sAddress = server.address()
    console.log(`[${process.env.NODE_ENV}] GraphQL Server running on http://${sAddress.address}:${sAddress.port}/graphql`)
});