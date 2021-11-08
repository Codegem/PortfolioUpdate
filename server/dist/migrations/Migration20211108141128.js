"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20211108141128 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20211108141128 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" text not null, "name" text not null, "password" text not null, "type" text not null);');
        this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
        this.addSql('create table "project" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null);');
    }
}
exports.Migration20211108141128 = Migration20211108141128;
//# sourceMappingURL=Migration20211108141128.js.map