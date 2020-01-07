
module.exports = {
    newPhoto: {
        subscribe: (parent:any, args:any, { pubsub }:any) => pubsub.asyncIterator('photo-added')
    },
    newUser: {
        subscribe: (parent:any, args:any, { pubsub }:any) => pubsub.asyncIterator('user-added')
    }
}