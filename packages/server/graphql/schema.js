const schema = `
type Query {
	profile(tokenId: ID!): Profile!
	profiles(limit: Int, skip: Int, name: String, residenceCountry: String, skills: [String]): [Profile]!
}
type Mutation {
	createProfile(data: CreateProfileInput!): Profile!
	updateProfile(data: CreateProfileInput!): Profile!
}
type Profile {
	tokenId: ID!
	name: String
	description: String
	birthDate: String
	gender: String
  	residenceCity: String
  	residenceCountry: String
  	nationalities: [String]
  	affiliations: [String]
  	education: [String]
  	skills: [String]
  	experience: [String]
}
input CreateProfileInput {
	tokenId: ID!
	name: String
	description: String
	birthDate: String
	gender: String
  	residenceCity: String
  	residenceCountry: String
  	nationalities: [String]
  	affiliations: [String]
  	education: [String]
  	skills: [String]
  	experience: [String]
}
`;

module.exports = { schema }