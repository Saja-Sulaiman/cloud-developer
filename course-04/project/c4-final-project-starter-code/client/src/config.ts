// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'kr8w3tt5vg'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-iuvzn7az.auth0.com',            // Auth0 domain
  clientId: 'FiIxYaij2gp2mf7B8syZKEt0qwY8dm0x',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
