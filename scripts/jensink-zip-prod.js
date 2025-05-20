const dotenv = require('dotenv')
const path = require('path')
dotenv.config({
  path: [
    path.join(__dirname, '..', '/env/.env'),
    path.join(__dirname, '..', '/env/.env.production'),
  ],
})

const updateZipText = require('./main')
updateZipText.main()
