export const PrivateProfileSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "PrivateProfile",
  type: "object",
  properties: {
    tokenId: {
      type: "integer",
      title: "tokenId",
    },
    tokenURI: {
      type: "string",
      title: "tokenURI",
    },
    encrypted: {
      type: "string",
      title: "encrypted",
    },
  },
};

export const PublicProfileSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "PublicProfile",
  type: "object",
  properties: {
    skillTags: {
      title: "SkillTagsList",
      type: "array",
      items: {
        type: "object",
        properties: {
          company: {
            type: "string",
            maxLength: 150
          },
          title: {
            type: "string",
            maxLength: 150
          },
          description: {
            type: "string"
          },
          startDate: {
            type: "string",
            format: "date",
            maxLength: 10
          },
          endDate: {
            type: "string",
            format: "date",
            maxLength: 10
          }
        }
      }
    },
    experiences: {
      title: "ExperienceList",
      type: "array",
      items: {
        type: "object",
        properties: {
          company: {
            type: "string",
            maxLength: 150
          },
          title: {
            type: "string",
            maxLength: 150
          },
          description: {
            type: "string"
          },
          startDate: {
            type: "string",
            format: "date",
            maxLength: 10
          },
          endDate: {
            type: "string",
            format: "date",
            maxLength: 10
          }
        }
      }
    }
  }
};
