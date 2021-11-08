"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const apollo_server_core_1 = require("apollo-server-core");
const Project_1 = require("./graphql/resolvers/Project");
const User_1 = require("./graphql/resolvers/User");
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    const app = (0, express_1.default)();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [Project_1.ProjectResolver, User_1.UserResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em }),
        plugins: [
            apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground
        ]
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log('\x1b[35m', '🚀 Server is running on http://localhost:4000/graphql', '\x1b[33m');
    });
};
main().catch((error) => { console.error(error); });
//# sourceMappingURL=index.js.map