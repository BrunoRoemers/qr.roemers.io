const aws = require('aws-sdk')
const awsConfig = require('../../helpers/aws-config')
const UrlPattern = require('url-pattern')
const redirectCurry = require('./ok-curry')
const logVisitCurry = require('./log-visit-curry')
const fs = require('fs')
const path = require('path')



// init url parser
const endpoint = new UrlPattern(process.env.QR_ENDPOINT)

// init db connection
const db = new aws.DynamoDB.DocumentClient(awsConfig())



exports.handler = async (event, ctx, cb) => {
  // TEMP
  let config = {}
  try {
    const configPath = path.join(__dirname, 'config.json')
    const rawConfig = fs.readFileSync(configPath)
    config = JSON.parse(rawConfig)
    console.log('config: ', config)
  } catch (error) {
    console.error(error)
  }

  console.log(config)


  // init helpers
  const logVisit = logVisitCurry(db, event)
  const redirect = redirectCurry(cb)


  // parse url
  const frags = endpoint.match(event.path)


  // uuid not provided
  if (!frags || !frags.uuid) {
    const location = 'https://roemers.io?ref=qr-no-id'
    logVisit(null, 'UuidNotProvided', location)
    redirect(location)
    return
  }


  // sanitize uuid
  const uuid = encodeURIComponent(frags.uuid)


  // get qr details
  const params = {
    TableName: process.env.QR_TABLE_DETAILS,
    Key: { uuid: uuid },
  }
  const { Item: details } = await db.get(params).promise()


  // uuid not found in db
  if (!details || !details.location) {
    const location = 'https://roemers.io?ref=qr-no-details'
    logVisit(uuid, 'DetailsNotFound', location)
    redirect(location)
    return
  }
  

  // redirect to final destination
  logVisit(uuid, 'Success', details.location)
  redirect(encodeURI(details.location))
}
