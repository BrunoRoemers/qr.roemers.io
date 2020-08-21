const affirmatives = ['yes', 'y', 'true', 'ok', '1']

module.exports = (input) => affirmatives.includes(input.toString())
