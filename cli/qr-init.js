const aws = require('aws-sdk')
const awsConfig = require('../helpers/aws-config')
const path = require('path')
const fs = require('fs')
const prompt = require('../helpers/prompt')
const q = require('../helpers/question-formatter')
const affirmative = require('../helpers/affirmative')
const dotenv = require('dotenv')


// config paths
const root = path.dirname(__dirname)
const envPath = path.join(root, '.env')


// handle existing .env
if (fs.existsSync(envPath)) {
  const resp = prompt(q('.env already exists, overwrite? (no)'), 'no')

  if (!affirmative(resp)) {
    // back out
    console.log('no worries, bye!')
    process.exit()
  }

  // load .env such that values can be used as defaults
  dotenv.config({ path: envPath })

  // remove .env
  fs.unlinkSync(envPath)
}


// prompt AWS_ACCESS_KEY_ID
const defAccessKey = process.env.QR_AWS_ACCESS_KEY_ID
const defAccessKeyStr = defAccessKey ? ' (from env)' : ''
const accessKey = prompt(
  q(`AWS_ACCESS_KEY_ID${defAccessKeyStr}`),
  defAccessKey
)


// prompt AWS_SECRET_ACCESS_KEY
const defSecretAccessKey = process.env.QR_AWS_SECRET_ACCESS_KEY
const defSecretAccessKeyStr = defAccessKey ? ' (from env)' : ''
const secretAccessKey = prompt(
  q(`AWS_SECRET_ACCESS_KEY${defSecretAccessKeyStr}`),
  defSecretAccessKey,
  {echo: ''} // hide input
)


// format .env body
const envBody =
`QR_AWS_ACCESS_KEY_ID=${accessKey}
QR_AWS_SECRET_ACCESS_KEY=${secretAccessKey}
QR_AWS_REGION=us-east-1
QR_AWS_ENDPOINT=dynamodb.us-east-1.amazonaws.com
QR_TABLE_DETAILS=qrDetails
QR_TABLE_VISITS=qrVisits
QR_DOMAIN=https://qr.roemers.io
QR_ENDPOINT=/id(/:uuid)
QR_SOURCE_ENV=local
`

// write out .env
fs.writeFileSync(envPath, envBody)
console.log('stored credentials in .env!')


// test connection
// NOTE: awsConfig picks up new .env file
const db = new aws.DynamoDB(awsConfig())
db.listTables({}, (err, data) => {
  // aws error
  if (err) throw err

  // connection works!
  console.log('connection established!')
  console.log('available tables: ', data.TableNames)
})
