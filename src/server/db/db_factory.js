"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tiny = require("tinypg");
var config_1 = require("../config");
exports.DbFactory = {
    create: function () { return new Tiny.TinyPg({
        root_dir: [config_1.default.DB_ROOT_DIR],
        connection_string: config_1.default.DATABASE_URL,
    }); }
};
//# sourceMappingURL=db_factory.js.map