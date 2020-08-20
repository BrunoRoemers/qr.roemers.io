const locs = {
  'test': 'https://roemers.io',
}

// Entry point for /id/*
exports.handler = (event, context, callback) => {
  // sanitize id
  const id = encodeURIComponent(event.queryStringParameters.id)

  // fallback redirect
  if (!locs.hasOwnProperty(id)) {
    callback(null, {
      statusCode: 301,
      headers: {
        location: 'https://roemers.io?ref=qr-fallback',
      }
    })
  }

  // redirect
  callback(null, {
    statusCode: 301,
    headers: {
      location: locs[id],
    }
  })
}
