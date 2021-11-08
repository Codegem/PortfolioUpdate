import { __prod__ } from './constants';
import {MikroORM} from '@mikro-orm/core'
import mikroOrmConfig from './mikro-orm.config';
import express from 'express'
import {ApolloServer} from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ProjectResolver } from './graphql/resolvers/Project';
import { UserResolver } from './graphql/resolvers/User';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis'
import { MyContext } from './types';

const main = async () => {
  
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();
    
    const app = express();

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    // session will be used inside apolo
    app.use(session({
        name: 'eweb',
        store: new RedisStore({
            //request to redis to persist session / refresh time if set
            client: redisClient,
            disableTouch: true,
        }),
        cookie:{
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            // only work on https
            sameSite: 'lax',
            secure:  __prod__,
        },            
        // should be in env
        saveUninitialized: false,
        secret: "randomstring",
        resave: false,
    }))

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [ProjectResolver, UserResolver],
            validate: false,
        }),
        context: ({req, res}): MyContext => ({em: orm.em, req, res}),
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
