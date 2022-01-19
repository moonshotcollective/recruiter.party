const { updateProfiles } = require('../services/profiles')
const mongoose = require('mongoose')
const config = require('config')
const { dbUrl } = config.get('API_CONFIG.api')

const createNewProfiles = async () => {
  try {
    await mongoose.connect(dbUrl)
    await updateProfiles()
    mongoose.disconnect()
  } catch (err) {
    throw Error(err)
  }
}

(async () => {
  await createNewProfiles()
})()
