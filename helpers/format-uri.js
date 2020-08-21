module.exports = (str) => {
  // sanitize
  str = encodeURI(str)

  // protocol already specified
  if (RegExp('^https?://').test(str)) return str

  return `https://${str}`
}
