const aws = require('aws-sdk')
const dotenv = require('dotenv')


module.exports = () => {
  // load .env file into process.env
  dotenv.config()

  // credentials are automatically picked up from process.env
  // see: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html
  return new aws.Config({
    region: 'us-east-1',
  })
}
