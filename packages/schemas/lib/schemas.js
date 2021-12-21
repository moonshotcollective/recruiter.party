"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
const profiles_schema_1 = require("./profiles/profiles-schema");
exports.schemas = {
    dapp: {
        PrivateProfile: profiles_schema_1.PrivateProfileSchema,
        PublicProfile: profiles_schema_1.PublicProfileSchema,
    },
};
//# sourceMappingURL=schemas.js.map