const dotenv = require('dotenv')
const path = require('path')

const root = path.dirname(__dirname)
const envPath = path.join(root, '.env')

module.exports = (uuid) => {
  // load .env file into process.env
  dotenv.config({path: envPath})

  // pattern
  const pattern = process.env['QR_LINK_PATTERN']

  // QR link
  return pattern.replace(':uuid', encodeURIComponent(uuid))
}
