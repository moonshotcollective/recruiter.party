/* eslint-disable */ // WIP
const { dRecruitContract } = require('../helpers/contract')
const { Profile } = require('../models')
const { getDidFromTokenURI, selfIdCore } = require('../helpers/ceramic')
const DEBUG = process.env.DEBUG

const updateProfiles = async () => {
  const lastProfile = await Profile.findOne({}, { _id: 0, tokenId: 1 }, { sort: { tokenId: -1 } })
  let lastTokenIdDb = 0;
  if (lastProfile) {
    lastTokenIdDb = lastProfile.tokenId
  }
  if (DEBUG) console.log("lastTokenIdDb: ", lastTokenIdDb);
  const lastTokenId = await dRecruitContract.tokenId()
  if (DEBUG) console.log("lastTokenId: ", lastTokenId.toNumber());
  for (let i = lastTokenIdDb + 1; i < lastTokenId.toNumber(); i++) {
    if (DEBUG) console.log("Processing token: ", i)
    const tokenUri = await dRecruitContract.uri(i)
    if (DEBUG) console.log("tokenUri: ", tokenUri)
    const { did } = getDidFromTokenURI(tokenUri)
    const basicProfile = await selfIdCore.get('basicProfile', did)
    if (DEBUG) console.log("basicProfile: ", basicProfile)
    const publicProfile = await selfIdCore.get('publicProfile', did)
    if (DEBUG) console.log("publicProfile: ", publicProfile)
    const profile = await Profile.create({
      tokenId: i,
      did: did,
      basicProfile: basicProfile,
      publicProfile: publicProfile
    })
    if (DEBUG) console.log("profile: ", profile)
  }
  if (DEBUG) console.log("End updateProfiles")
}

module.exports = { updateProfiles }
