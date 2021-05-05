const { makeExecutableSchema } = require('graphql-tools')
const merge = require('lodash.merge');

const accountSchema = require('./account')

// Multiple files to keep your project modularised
const schema = makeExecutableSchema({
    typeDefs: [
        accountSchema.typeDefs, // First defines the type Query
        // roleSchema.typeDefs, // Others extends type Query
    ],
    resolvers: merge(
        accountSchema.resolvers
    )
})

module.exports = schema