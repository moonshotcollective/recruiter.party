const mongoose = require('mongoose')

const imageSources = {
  original: {
    src: {
      type: String
    },
    size: {
      type: Number
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    mimeType: {
      type: String
    }
  }
}

const experienceSchema = new mongoose.Schema({
  company: {
    type: String
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
})

const educationSchema = new mongoose.Schema({
  institution: {
    type: String
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
})

const basicProfile = new mongoose.Schema({
  url: {
    type: String
  },
  name: {
    type: String
  },
  emoji: {
    type: String
  },
  image: imageSources,
  gender: {
    type: String
  },
  birthDate: {
    type: String
  },
  background: {
    type: imageSources
  },
  description: {
    type: String
  },
  affiliations: {
    type: [String]
  },
  homeLocation: {
    type: String
  },
  nationalities: {
    type: [String]
  },
  residenceCountry: {
    type: String
  }
})

const publicProfile = new mongoose.Schema({
  skillTags: {
    type: [String]
  },
  experiences: {
    type: [experienceSchema]
  },
  education: {
    type: [educationSchema]
  }
})

const profileSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    unique: true,
    required: true
  },
  did: {
    type: String,
    unique: true,
    required: true
  },
  basicProfile: {
    type: basicProfile
  },
  publicProfile: {
    type: publicProfile
  }
})

profileSchema.index({ '$**': 'text' })

const Profile = mongoose.model('Profile', profileSchema)

module.exports = { Profile }
