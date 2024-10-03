"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validateEnv = () => {
    (0, envalid_1.cleanEnv)(process.env, {
        NODE_ENV: (0, envalid_1.str)(),
        PORT: (0, envalid_1.port)(),
        DB_HOST: (0, envalid_1.str)(),
        DB_USER: (0, envalid_1.str)(),
        DB_PASSWORD: (0, envalid_1.str)(),
        DB_NAME: (0, envalid_1.str)(),
        DB_CONNECTION_LIMIT: (0, envalid_1.str)(),
        JWT_SECRET: (0, envalid_1.str)(),
        REFRESH_TOKEN_SECRET: (0, envalid_1.str)()
    });
};
exports.default = validateEnv;
//# sourceMappingURL=validate_env.js.map