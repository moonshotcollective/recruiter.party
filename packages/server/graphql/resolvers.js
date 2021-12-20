const { QueryProfiles } = require('./resolvers/queries/profiles')
const { MutationProfiles } = require('./resolvers/mutations/profiles')

const resolvers = {
	Query: {
		...QueryProfiles
	},

	Mutation: {
		...MutationProfiles
	}
};

module.exports = { resolvers }