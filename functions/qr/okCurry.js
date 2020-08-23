module.exports = (cb) => (body) => cb(null, {
  statusCode: 200,
  body: body,
})
