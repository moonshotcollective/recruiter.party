const { updateProfiles } = require('../services/profiles')
const mongoose = require('mongoose')
const config = require('config')
const { dbUrl } = config.get('API_CONFIG.api')

const createNewProfiles = async () => {
  await mongoose.connect(dbUrl)
  await updateProfiles()
  await mongoose.disconnect()
}

(async () => {
  await createNewProfiles()
})()
