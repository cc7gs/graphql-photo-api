import {Db} from 'mongodb'
import {PubSub } from 'apollo-server-express'

type Context={
    currentUser:any;
    db:Db;
    pubsub:PubSub;
}
export type Fn=(parent:any,args:any,context:Context)=>any;