## An example of passwordless authentication using GraphQL and SendGrid to send a magic link

First off, the code in the resolver can easily be moved to a RESTful solution, I use any excuse to play around with GraphQL.

## Getting Started

- You'll need a `SendGrid account` to send the magic link emails.
- Add your user object to `src/db/data/db.js`
- Rename `.env-example` to `.env` and add
  - SendGrid API Key
  - Email From
  - Client URL
- `graphiql-queries.gql` contains test queries and variables
- `npm i`
- `npm start` - navigate to http://localhost:4000/graphql

## How It Works

- User submits their email address.
  - If the user email address exists, a JWT is created which contains a random Id and 10 minute expiry time, the Id will also be stored in the `loginRequests` array. The token will then be emailed to the verified users email address and the query response will be `true`.
  - If the user does not exist, the query exits with a `true` repsonse, this is to throw people off if they're trying something dodgy.
- The user receives the email and clicks the magic link.
- The client app (or just copy and paste the JWT from the email into graphiql) receives the token and sends it back to be verified against the `loginRequests` array.

  - If the Id from the token exists in the array, the email address against it will be used to retrieve the user data to be store into a new JWT access token and return to the client app. The Id will be removed from the `loginRequests` array.
  - If the Id from the token does not exist or the magic link has expired, an error will be thrown and returned to the user.

## More Security

You can also,

- Use the initial request to store the user IP address (e.g. `loginRequests` array) and then verify along with the token Id.
  - This verifies the user is a the same location.
- Store the submitted email address in localStorage, when magic link is clicked check the email exists in localStorage against the JWT (you'll need to add the email address to the token).
  - This allows the user to only use the device they requested the magic link on.
- Use a refresh token (requires auth server)
