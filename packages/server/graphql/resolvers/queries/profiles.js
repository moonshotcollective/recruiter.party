const { Profile } = require('../../../models/profile')
const fastify = require('fastify')({ logger: true })

const QueryProfiles = {
	profiles: async (_, obj) => {
		const { limit, skip, name, residenceCountry, skills } = obj;
		fastify.log.info("Profiles Query")
		let filters = {}
		if (name) {
			filters["name"] = new RegExp(name, 'i')
		}
		if (residenceCountry) {
			filters["residenceCountry"] = residenceCountry
		}
		if (skills) {
			filters["skills"] = { $all: skills }
		}
		const options = { limit: limit, skip: skip }
		const profiles = await Profile.find(filters, null, options);
		return profiles;
	},

	profile: async (_, obj) => {
		const { tokenId } = obj;
		const profile = await Profile.findOne({ tokenId: tokenId});
		return profile;
	}
}

module.exports = { QueryProfiles }