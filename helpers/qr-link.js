const dotenv = require('dotenv')
const path = require('path')
const UrlPattern = require('url-pattern')

const root = path.dirname(__dirname)
const envPath = path.join(root, '.env')

module.exports = (uuid) => {
  // load .env file into process.env
  dotenv.config({path: envPath})

  // env vars
  const domain = process.env['QR_DOMAIN'] || ''
  const endpoint = new UrlPattern(process.env['QR_ENDPOINT'])

  // QR link
  return domain + endpoint.stringify({
    uuid: encodeURIComponent(uuid),
  })
}
