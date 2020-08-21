const aws = require('aws-sdk')
const awsConfig = require('../../helpers/aws-config')
const UrlPattern = require('url-pattern')

const endpoint = new UrlPattern(process.env['QR_ENDPOINT'])

// Fallback redirect
const fallback = (ref, cb) => cb(null, {
  statusCode: 301,
  headers: {
    location: `https://roemers.io?ref=${ref}`,
  },
})

exports.handler = async (event, ctx, cb) => {
  const frags = endpoint.match(event.path)

  // uuid not provided
  if (!frags || !frags.uuid) return fallback('qr-no-id', cb)

  // sanitize uuid
  const uuid = encodeURIComponent(frags.uuid)

  // setup connection
  const db = new aws.DynamoDB.DocumentClient(awsConfig())

  // get qr details
  const params = {
    TableName: process.env['QR_TABLE_DETAILS'],
    Key: { 'qr-uuid': uuid, },
    ReturnConsumedCapacity: 'TOTAL',
  }
  const res = await db.get(params).promise()
  const cu = res.ConsumedCapacity.CapacityUnits
  const details = res.Item

  // uuid not found in db
  if (!details || !details['qr-location']) fallback('qr-no-details', cb)
  
  // redirect to final destination
  cb(null, {
    statusCode: 301,
    headers: {
      location: encodeURI(details['qr-location'])
    }
  })

  // console.log('=== EVENT')
  // console.log(event)
  // console.log('=== CONTEXT')
  // console.log(ctx)
}
