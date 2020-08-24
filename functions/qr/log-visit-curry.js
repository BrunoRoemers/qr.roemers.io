module.exports = (db, event) => (uuid, status, location) => {
  let requestedUuid = null

  // handle errors
  if (status === 'UuidNotProvided') uuid = status
  if (status === 'DetailsNotFound') {
    requestedUuid = uuid
    uuid = status
  }

  const params = {
    TableName: process.env.QR_TABLE_VISITS,
    Item: {
      uuid: uuid, // partition key
      createdAt: new Date().toISOString(), // sort key
      requestedUuid: requestedUuid,
      location: location,
      sourceEnv: process.env.QR_SOURCE_ENV,
      headerClientIp: encodeURI(event.headers['client-ip']),
      headerDnt: event.headers['dnt'],
      headerAcceptEncoding: event.headers['accept-encoding'],
      headerAcceptLanguage: event.headers['accept-language'],
      headerAccept: event.headers['accept'],
      headerUserAgent: event.headers['user-agent'],
      headerXCountry: event.headers['x-country'],
    },
    ReturnConsumedCapacity: 'TOTAL',
  }

  db.put(params, (err, { ConsumedCapacity: cc }) => {
    if (err) return console.error(err)

    console.log(`hit stored! (${cc.TableName}: ${cc.CapacityUnits} cu)`)
  })
}
