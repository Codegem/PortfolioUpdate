import {MikroORM} from '@mikro-orm/core'
import { __prod__ } from './constants';
import mikroOrmConfig from './mikro-orm.config';
import express from 'express'
import {ApolloServer} from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ProjectResolver } from './graphql/resolvers/Project';
import { UserResolver } from './graphql/resolvers/User';

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();
    
    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [ProjectResolver, UserResolver],
            validate: false,
        }),
        context: () => ({em: orm.em}),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground
        ]
    })
    
    await apolloServer.start();

    apolloServer.applyMiddleware({app});

    app.listen(4000, () => {
        console.log('\x1b[35m', '🚀 Server is running on http://localhost:4000/graphql', '\x1b[33m');
    })
}
main().catch((error) => {console.error(error)});
