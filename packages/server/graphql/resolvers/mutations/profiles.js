const { Profile } = require('../../../models/profile')

const MutationProfiles = {
  createProfile: async (_, { data }) => {
    const newProfile = new Profile(data)
    const profile = await newProfile.save()
    return profile
  },

  updateProfile: async (_, { data }) => {
    const profile = await Profile.findOneAndUpdate({ tokenId: data.tokenId }, data, { new: true })
    return profile
  }
}

module.exports = { MutationProfiles }
