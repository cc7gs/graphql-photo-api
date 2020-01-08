
const newPhoto={
    subscribe: (parent:any, args:any, { pubsub }:any) => pubsub.asyncIterator('photo-added')
}
const newUser={
    subscribe: (parent:any, args:any, { pubsub }:any) => pubsub.asyncIterator('user-added')
}

export default{
    newPhoto,
    newUser
}