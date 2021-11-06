"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20211106184007 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20211106184007 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "project" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null);');
    }
}
exports.Migration20211106184007 = Migration20211106184007;
//# sourceMappingURL=Migration20211106184007.js.map