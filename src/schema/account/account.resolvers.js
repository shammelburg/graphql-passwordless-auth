const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const { magicLinkEmail } = require('../../services/nodemailer')

const { getUser } = require('../../db/repo/user-repo')
const { addLoginRequestId, clearLoginRequest, getLoginRequest } = require('../../db/repo/login-requests-repo')

const resolvers = {
    Query: {
        request: async (parent, { emailAddress }, req, info) => {
            // Get user from database
            const user = await getUser(emailAddress)

            // if the user does not exist, return true anyway
            // any malicious users would be unaware of actual emails in the app
            if (!user) {
                return true
            }

            // create a random tokenId
            const tokenId = uuid.v4()

            // create email token containing token id and ip, signed with a unqiue key
            const token = jwt.sign(
                {
                    tid: tokenId,
                    ip: req.ip
                },
                process.env.JWT_MAGIC_LINK_KEY,
                {
                    expiresIn: process.env.JWT_MAGIC_LINK_DURATION, // 15 minutes lifespan
                    jwtid: uuid.v4()
                }
            )

            // email configuration object
            const emailConfig = {
                firstName: user.firstName,
                to: user.emailAddress,
                cc: null,
                subject: '🎉 Your Magic Link is here!',
                loginUrl: `${process.env.CLIENT_URL}${token}`, // the magic link for the email
                ip: req.ip
            }

            // store email address and token id
            addLoginRequestId(user.emailAddress, tokenId)

            // send email
            await magicLinkEmail(emailConfig)

            return true
        },
        verify: async (parent, { token }, req, info) => {
            let decoded

            try {
                // verify token validity and unwrap
                decoded = jwt.verify(token, process.env.JWT_MAGIC_LINK_KEY)
            } catch (error) {
                throw new Error(error)
            }

            // retrieve email from token id
            const login = getLoginRequest(decoded.tid)
            if (!login) {
                throw new Error('Sign In failed: Token rejected.')
            }

            // retrieve user object by email address
            const user = await getUser(login.emailAddress)

            // create access token containing user object, signed with another unqiue key
            const accessToken = jwt.sign(
                { ...user },
                process.env.JWT_ACCESS_KEY,
                {
                    expiresIn: process.env.JWT_ACCESS_DURATION,
                    jwtid: uuid.v4()
                }
            )

            // remove token id to prevent magic link to be used twice
            clearLoginRequest(decoded.tid)

            return accessToken
        }
    }
}

module.exports = resolvers