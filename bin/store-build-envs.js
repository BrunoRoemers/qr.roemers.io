const fs = require('fs').promises
const path = require('path')

const rootPath = path.dirname(__dirname)
const jsonPath = path.join(rootPath, 'build-envs.json')

const main = async () => {
  // grab env vars
  // NOTE: netlify injects env vars from UI and .env into process.env
  const json = { ...process.env }


  // remove sensitive vars
  json.QR_AWS_SECRET_ACCESS_KEY = undefined


  // store env vars
  // NOTE: replace file if exists
    await fs.writeFile(jsonPath, JSON.stringify(json, null, 2))
}

// run main
main().catch((e) => console.error(e))
