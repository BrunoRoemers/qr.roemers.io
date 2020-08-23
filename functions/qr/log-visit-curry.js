module.exports = (db, event) => (uuid, status, location) => {
  let requestedUuid = null

  // handle errors
  if (status === 'UuidNotProvided') uuid = status
  if (status === 'DetailsNotFound') {
    requestedUuid = uuid
    uuid = status
  }

  // sourceEnv
  let sourceEnv = process.env.NETLIFY ? 'netlify_' : 'local'
  sourceEnv += process.env.BRANCH || ''

  const params = {
    TableName: process.env.QR_TABLE_VISITS,
    Item: {
      uuid: uuid, // partition key
      createdAt: new Date().toISOString(), // sort key
      requestedUuid: requestedUuid,
      location: location,
      sourceEnv: sourceEnv,
      headerClientIp: event.headers['client-ip'],
      headerDnt: event.headers['dnt'],
      headerAcceptEncoding: event.headers['accept-encoding'],
      headerAcceptLanguage: event.headers['accept-language'],
      headerAccept: event.headers['accept'],
      headerUserAgent: event.headers['user-agent'],
    },
    ReturnConsumedCapacity: 'TOTAL',
  }

  console.log(params)
  console.log(event)

  db.put(params, (err, { ConsumedCapacity: cc }) => {
    if (err) return console.error(err)

    console.log(`hit stored! (${cc.TableName}: ${cc.CapacityUnits} cu)`)
  })
}
