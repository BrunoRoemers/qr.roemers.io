const initPrompt = require('prompt-sync')

// return configured prompt
module.exports = initPrompt({
  sigint: true, // default behavior for ^C
})
