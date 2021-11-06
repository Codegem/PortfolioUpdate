import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Project } from "./entities/Project";
import path from 'path';

export default {
        migrations: {
                path: path.join(__dirname, "./migrations"),
                pattern: /^[\w-]+\d+\.[tj]s$/,
        },
        entities: [Project],
        dbName: 'Portfolio',
        user: 'postgres',
        port: 5433,
        password: 'evaldas',
        type: 'postgresql',
        debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];