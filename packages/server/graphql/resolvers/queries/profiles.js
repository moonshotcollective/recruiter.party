const { Profile } = require('../../../models/profile')

const QueryProfiles = {
  profiles: async (_, obj) => {
    const { limit, skip, name, residenceCountry, skills, search } = obj
    const filters = {}
    const sort = {}
    const options = { limit, skip }
    if (name) {
      filters.basicProfile.name = new RegExp(name, 'i')
    }
    if (residenceCountry) {
      filters.basicProfile.residenceCountry = residenceCountry
    }
    if (skills) {
      filters.publicProfile.skillTags = { $all: skills }
    }
    if (search) {
      filters.$text = { $search: search }
      filters.score = { $meta: 'textScore' }
      sort.score = { $meta: 'textScore' }
    }

    const profiles = await Profile.find(filters, sort, options).lean()
    return profiles
  },

  profile: async (_, obj) => {
    const { tokenId } = obj
    const profile = await Profile.findOne({ tokenId: tokenId }).lean()
    return profile
  }
}

module.exports = { QueryProfiles }
