import {
  PrivateProfileSchema,
  PublicProfileSchema,
} from "./profiles/profiles-schema";

export const schemas = {
  dapp: {
    PrivateProfile: PrivateProfileSchema,
    PublicProfile: PublicProfileSchema,
  },
};
