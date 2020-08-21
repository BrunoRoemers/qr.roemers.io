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
const defAccessKey = process.env['AWS_ACCESS_KEY_ID'] || process.env['QR_AWS_ACCESS_KEY_ID']
const defAccessKeyStr = defAccessKey ? ' (from env)' : ''
const accessKey = prompt(
  q(`AWS_ACCESS_KEY_ID${defAccessKeyStr}`),
  defAccessKey
)


// prompt AWS_SECRET_ACCESS_KEY
const defSecretAccessKey = process.env['AWS_SECRET_ACCESS_KEY'] || process.env['QR_AWS_SECRET_ACCESS_KEY']
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
QR_TABLE_DETAILS=qr-details
QR_LINK_PATTERN=https://qr.roemers.io/id/:uuid
`


// set up connection
// NOTE: override env vars (for current process only)
//       so that awsConfig can pick them up
process.env['QR_AWS_ACCESS_KEY_ID'] = accessKey
process.env['QR_AWS_SECRET_ACCESS_KEY'] = secretAccessKey
const db = new aws.DynamoDB(awsConfig())

// test connection
db.listTables({}, (err, data) => {
  // aws error
  if (err) throw err

  // connection works!
  console.log('connection established!')
  console.log('available tables: ', data.TableNames)

  fs.writeFileSync(envPath, envBody)
  console.log('stored credentials in .env!')
})
