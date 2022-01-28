const { dRecruitContract } = require('../helpers/contract')
const { Profile } = require('../models')
const { getDidFromTokenURI, selfIdCore } = require('../helpers/ceramic')
const DEBUG = process.env.DEBUG

const createProfiles = async () => {
  const lastProfile = await Profile.findOne({}, { _id: 0, tokenId: 1 }, { sort: { tokenId: -1 } })
  const lastTokenIdDb = lastProfile?.tokenId ?? 0
  if (DEBUG) console.log('lastTokenIdDb: ', lastTokenIdDb)
  const lastTokenId = await dRecruitContract.tokenId()
  if (DEBUG) console.log('lastTokenId: ', lastTokenId.toNumber())
  for (let i = lastTokenIdDb + 1; i < lastTokenId.toNumber(); i++) {
    await updateProfile(i)
  }
  if (DEBUG) console.log('End createProfiles')
}

const updateProfile = async (tokenId) => {
  if (DEBUG) console.log('Updating token: ', tokenId)
  const tokenUri = await dRecruitContract.uri(tokenId)
  if (DEBUG) console.log('tokenUri: ', tokenUri)
  const { did } = getDidFromTokenURI(tokenUri)
  const basicProfile = await selfIdCore.get('basicProfile', did)
  if (DEBUG) console.log('basicProfile: ', basicProfile)
  const publicProfile = await selfIdCore.get('publicProfile', did)
  if (DEBUG) console.log('publicProfile: ', publicProfile)
  try {
    const profile = await Profile.findOneAndUpdate({ tokenId: tokenId }, {
      tokenId: tokenId,
      did: did,
      basicProfile: basicProfile,
      publicProfile: publicProfile
    }, { new: true, upsert: true, overwrite: true })
    if (DEBUG) console.log('profile: ', profile)
    return profile
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports = { createProfiles, updateProfile }
