"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV === 'development') {
    process.env.DATABASE_URL = 'postgres://alex@localhost:5433/alexandmolly2017?sslmode=disable';
    process.env.RSVP_BASIC_AUTH_PASSWORD = 'test';
}
var config = __assign({}, process.env, { DB_ROOT_DIR: __dirname + "/db/sql" });
exports.default = config;
//# sourceMappingURL=config.js.map