const schema = `
type Query {
    profile(tokenId: ID, did: String): Profile!
    profiles(limit: Int, skip: Int, name: String, residenceCountry: String, homeLocation: String, educationInstitution: String, educationTitle: String, experienceCompany: String, experienceTitle: String, skills: [String], search: String): [Profile]!
}
type Mutation {
    createProfile(data: CreateProfileInput!): Profile!
    updateProfile(data: CreateProfileInput!): Profile!
}
type ImageData {
    src: String
    size: Int
    width: Int
    height: Int
    mimeType: String
}
type ImageSources {
    original: ImageData
}
type BasicProfile {
    url: String
    name: String
    emoji: String
    image: ImageSources,
    gender: String
    birthDate: String
    background: ImageSources
    description: String
    affiliations: [String]
    homeLocation: String
    nationalities: [String]
    residenceCountry: String
}
type ExperienceSchema {
    company: String
    title: String
    description: String
    startDate: String
    endDate: String
}
type EducationSchema {
    institution: String
    title: String
    description: String
    startDate: String
    endDate: String
}
type PublicProfile {
    skillTags: [String]
    experiences: [ExperienceSchema]
    education: [EducationSchema]
}
type Profile {
    tokenId: ID!
    did: String
    basicProfile: BasicProfile
    publicProfile: PublicProfile
}
input CreateProfileInput {
    tokenId: ID!
    did: String
}
`

module.exports = { schema }
