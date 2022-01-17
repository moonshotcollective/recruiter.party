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

export const BasicProfileSchema = {
  type: "object",
  title: "BasicProfile",
  $schema: "http://json-schema.org/draft-07/schema#",
  properties: {
    url: {
      type: "string",
      maxLength: 240
    },
    name: {
      type: "string",
      maxLength: 150
    },
    emoji: {
      type: "string",
      maxLength: 2
    },
    image: {
      $ref: "#/definitions/imageSources"
    },
    gender: {
      type: "string",
      maxLength: 42
    },
    birthDate: {
      type: "string",
      format: "date",
      maxLength: 10
    },
    background: {
      $ref: "#/definitions/imageSources"
    },
    description: {
      type: "string",
      maxLength: 420
    },
    affiliations: {
      type: "array",
      items: {
        type: "string",
        maxLength: 140
      }
    },
    homeLocation: {
      type: "string",
      maxLength: 140
    },
    nationalities: {
      type: "array",
      items: {
        type: "string",
        pattern: "^[A-Z]{2}$",
        maxItems: 5
      },
      minItems: 1
    },
    residenceCountry: {
      type: "string",
      pattern: "^[A-Z]{2}$",
      maxLength: 2
    }
  },
  definitions: {
    IPFSUrl: {
      type: "string",
      pattern: "^ipfs://.+",
      maxLength: 150
    },
    imageSources: {
      type: "object",
      required: [
        "original"
      ],
      properties: {
        original: {
          $ref: "#/definitions/imageMetadata"
        },
        alternatives: {
          type: "array",
          items: {
            $ref: "#/definitions/imageMetadata"
          }
        }
      }
    },
    imageMetadata: {
      type: "object",
      required: [
        "src",
        "mimeType",
        "width",
        "height"
      ],
      properties: {
        src: {
          $ref: "#/definitions/IPFSUrl"
        },
        size: {
          $ref: "#/definitions/positiveInteger"
        },
        width: {
          $ref: "#/definitions/positiveInteger"
        },
        height: {
          $ref: "#/definitions/positiveInteger"
        },
        mimeType: {
          type: "string",
          maxLength: 50
        }
      }
    },
    positiveInteger: {
      type: "integer",
      minimum: 1
    }
  }
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
