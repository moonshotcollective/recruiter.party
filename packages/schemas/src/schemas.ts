import {
  PrivateProfileSchema,
  BasicProfileSchema,
  PublicProfileSchema,
} from "./profiles/profiles-schema";

export const schemas = {
  dapp: {
    PrivateProfile: PrivateProfileSchema,
    BasicProfile: BasicProfileSchema,
    PublicProfile: PublicProfileSchema,
  },
};
