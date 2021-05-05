const { users } = require('../data/db')

module.exports = {
    getUser: async emailAddress => Promise.resolve(users.find(u => u.emailAddress === emailAddress))
}