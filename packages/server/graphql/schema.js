const schema = `
type Query {
    profile(tokenId: ID!): Profile!
    profiles(limit: Int, skip: Int, name: String, residenceCountry: String, skills: [String], search: String): [Profile]!
}
type Mutation {
    createProfile(data: CreateProfileInput!): Profile!
    updateProfile(data: CreateProfileInput!): Profile!
}
type ImageMetadata {
    src: String
    size: Int
    width: Int
    height: Int
}
type Image {
    original: ImageMetadata
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
    url: String
    emoji: String
    image: Image
    background: Image
    homeLocation: String
}
input ImageMetadataInput {
    src: String
    size: Int
    width: Int
    height: Int
}
input ImageInput {
    original: ImageMetadataInput
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
    url: String
    emoji: String
    image: ImageInput
    homeLocation: String
}
`

module.exports = { schema }
