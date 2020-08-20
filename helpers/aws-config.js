const aws = require('aws-sdk')
const dotenv = require('dotenv')
const path = require('path')

const root = path.dirname(__dirname)
const envPath = path.join(root, '.env')

module.exports = () => {
  // load .env file into process.env
  dotenv.config({path: envPath})

  // alias vars
  process.env['AWS_ACCESS_KEY_ID'] = process.env['AWS_ACCESS_KEY_ID'] || process.env['QR_AWS_ACCESS_KEY_ID']
  process.env['AWS_SECRET_ACCESS_KEY'] = process.env['AWS_SECRET_ACCESS_KEY'] || process.env['QR_AWS_SECRET_ACCESS_KEY']

  // credentials are automatically picked up from process.env
  // see: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html
  return new aws.Config({
    region: 'us-east-1',
  })
}
