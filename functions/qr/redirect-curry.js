module.exports = (cb) => (location) => cb(null, {
  statusCode: 301,
  headers: { location },
})
