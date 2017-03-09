"use strict";
var config = {
    host: process.env.NODE_ENV === 'production' ? 'secret' : 'localhost',
    user: process.env.NODE_ENV === 'production' ? 'secret' : 'alexandmollytestuser',
    password: process.env.NODE_ENV === 'production' ? 'secret' : 'test1234',
    database: 'alexandmolly2017',
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = config;
//# sourceMappingURL=config.js.map