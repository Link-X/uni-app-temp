const dotenv = require('dotenv')
const path = require('path')
dotenv.config({
  path: [
    path.join(__dirname, '..', '/env/.env'),
    path.join(__dirname, '..', '/env/.env.development'),
  ],
})

const updateZipText = require('./main')
updateZipText.main()
