const aws = require('aws-sdk')
const awsConfig = require('./helpers/aws-config')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const initPrompt = require('prompt-sync')


// strings
const affirmative = ['yes', 'y', 'true', 'ok']


// config prompt
const prompt = initPrompt({
  sigint: true, // default behavior for ^C
})


// config paths
const root = path.dirname(__dirname)
const envPath = path.join(root, ".env")


// question formatter
const q = (message) => chalk`{dim question} ${message}: `


// handle existing .env
if (fs.existsSync(envPath)) {
  const resp = prompt(q('.env already exists, remove? (no)'), 'no')
  if (affirmative.includes(resp)) {
    // remove .env
    fs.unlinkSync(envPath)
    console.log('.env successfully removed!')
  } else {
    // back out
    console.log('no worries, bye!')
    process.exit()
  }
}


// prompt AWS_ACCESS_KEY_ID
const accessKey = prompt(q('AWS_ACCESS_KEY_ID'))


// prompt AWS_SECRET_ACCESS_KEY
const secretAccessKey = prompt.hide(q('AWS_SECRET_ACCESS_KEY'))


// format .env body
const envBody =
`AWS_ACCESS_KEY_ID=${accessKey}
AWS_SECRET_ACCESS_KEY=${secretAccessKey}
`


// set up connection
// NOTE: override env vars (for current process only)
//       so that awsConfig can pick them up
process.env['AWS_ACCESS_KEY_ID'] = accessKey
process.env['AWS_SECRET_ACCESS_KEY'] = secretAccessKey
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
