import  Query from './Query'
import Mutation from './Mutation'
import Subscription from './Subscription'
import * as type from './Type'

const resolvers={
    Query,
    Mutation,
    Subscription,
    ...type
}

export default resolvers