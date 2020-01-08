import * as express from 'express'
import { ApolloServer,PubSub } from 'apollo-server-express'
import expressPlayground from 'graphql-playground-middleware-express'
import * as mongoose from 'mongoose'
import {Db} from 'mongodb'
import  {createServer} from 'http'
import * as path from 'path'
import resolvers from './resolvers'
import { readFileSync } from 'fs'
import {DB_HOST} from './utils/config'
const typeDefs = readFileSync(path.resolve(__dirname, './schema/typeDefs.graphql'), 'UTF-8');

async function start() {
    const app = express();
    let db:Db;
console.log(DB_HOST,'host')
    try {
       const client= await mongoose.connect(DB_HOST!,
            { useNewUrlParser: true }
        )
        
       db=client.connection.db
    } catch (error) {
        console.log(`
    
        Mongo DB Host not found!
        please add DB_HOST environment variable to .env file
        exiting...
         
      `)
        process.exit(1)
    }
    const pubsub=new PubSub();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
          const githubToken = req.headers.authorization;
          
          const currentUser = await db.collection('users').findOne({ githubToken })
          return { db, currentUser,pubsub }
        }
      })
    const httpServer=createServer(app);
    // server.applyMiddleware({ app });
    server.installSubscriptionHandlers(httpServer)
    
    app.get('/', (req, res) => {
        res.send('Welcome to the PhotoShare API');
    })

    app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

    httpServer.listen({ port: 5000 }, () => {
        console.log(`GraphQL server running @ http://localhost:5000${server.graphqlPath}`)
    })

}

start()


