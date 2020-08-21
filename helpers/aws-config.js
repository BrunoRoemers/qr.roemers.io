const aws = require('aws-sdk')
const dotenv = require('dotenv')
const path = require('path')

const root = path.dirname(__dirname)
const envPath = path.join(root, '.env')

module.exports = () => {
  // load .env file into process.env
  dotenv.config({path: envPath})

  return new aws.Config({
    region: process.env.QR_AWS_REGION,
    endpoint: process.env.QR_AWS_ENDPOINT,
    accessKeyId: process.env.QR_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.QR_AWS_SECRET_ACCESS_KEY,
  })
}
