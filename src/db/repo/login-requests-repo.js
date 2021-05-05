let { loginRequests } = require('../data/db')

module.exports = {
    getLoginRequests: () => loginRequests,
    addLoginRequestId: (emailAddress, tokenId) => {
        const hasLoginEntry = loginRequests.find(l => l.emailAddress === emailAddress)

        // replace if an entry already exists
        if (hasLoginEntry) { hasLoginEntry.tokenId = tokenId }
        
        !hasLoginEntry && loginRequests.push({ emailAddress, tokenId })
    },
    getLoginRequest: (tokenId) => loginRequests.find(l => l.tokenId === tokenId),
    clearLoginRequest: (tokenId) => {
        loginRequests = loginRequests.filter(l => l.tokenId !== tokenId)
    }
}