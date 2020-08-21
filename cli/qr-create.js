const aws = require('aws-sdk')
const awsConfig = require('../helpers/aws-config')
const { v4: uuidv4 } = require('uuid')
const formatURI = require('../helpers/format-uri')
const prompt = require('../helpers/prompt')
const q = require('../helpers/question-formatter')
const chalk = require('chalk')
const affirmative = require('../helpers/affirmative')
const qrLink = require('../helpers/qr-link')


const main = async () => {
  console.log('')

  // prompt label
  const label = encodeURIComponent(prompt(q('label')))

  // prompt location
  const location = formatURI(prompt(q('location')))

  // generate random uuid
  const id = uuidv4()

  // generate timestamp
  const now = Date.now()

  // preview
  console.log('')
  console.log(chalk`{dim label}\t\t{bold ${label}}`)
  console.log(chalk`{dim location}\t{bold ${location}}`)
  console.log(chalk`{dim uuid\t\t${id}}`)
  console.log(chalk`{dim timestamp\t${now}}`)
  console.log('')

  // prompt confirmation
  const confirm = prompt(q('submit QR code? (yes)'), 'yes')
  console.log('')
  if (!affirmative(confirm)) {
    console.log('aborted!\n')
    process.exit()
  }

  
  // setup connection
  const db = new aws.DynamoDB.DocumentClient(awsConfig())
  
  // store qr details in db
  console.log('Saving to database...')
  const params = {
    // NOTE: awsConfig has loaded .env file
    TableName: process.env.QR_TABLE_DETAILS,
    Item: {
      uuid: id,
      label: label,
      location: location,
      createdAt: Date.now(),
    },
    ReturnConsumedCapacity: 'TOTAL',
  }
  const { ConsumedCapacity: res } = await db.put(params).promise()

  // report success
  console.log(chalk`Saved to ${res.TableName}!`)
  console.log(chalk`{dim used ${res.CapacityUnits} CU}`)

  // report qr link
  console.log(chalk`\nlink for QR code: {bold ${qrLink(id)}}\n`)
}

// start script
main().catch((err) => console.error(err))
