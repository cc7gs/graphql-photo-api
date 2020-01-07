import {authorizeWithGithub} from '../lib'
import  fetch from 'node-fetch'
import {ObjectID}from 'mongodb'
import {Fn} from './types'
import {CLIENT_ID,CLIENT_SECRET} from '../utils/config'

const postPhoto:Fn=async(parent,args,{db,pubsub,currentUser})=>{
  //1. 检查登录是否登录
  if(!currentUser){
    throw new Error('Only an authorized user can post a photo');
  }
  //2. 保存当前用户至图片
  const newPhoto={
    ...args.input,
    userID: currentUser.githubLogin,
    created: new Date()
  }
  //3. 入库、并获取id
  const {insertedIds}=await db.collection('photos').insert(newPhoto)
  newPhoto.id=insertedIds[0] 
  
  pubsub.publish('photo-added', { newPhoto })

  return newPhoto
}
const tagPhoto:Fn=async(parent,args,{db})=>{
  await db.collection('tags')
  .replaceOne(args, args, { upsert: true })

return db.collection('photos')
  .findOne({ _id: new ObjectID(args.photoID) }) 
}
const githubAuth:Fn=async(parent,{code},{db,pubsub})=>{
 //1. 从github获取用户数据 
 let {
    message,
    access_token,
    avatar_url,
    login,
    name
  } = await authorizeWithGithub({
    client_id: CLIENT_ID!,
    client_secret: CLIENT_SECRET!,
    code
  });

  if(message){
      throw new Error(message)
  }

  let latestUserInfo={
      name,
      githubLogin:login,
      githubToken:access_token,
      avatar:avatar_url
  }
  const {ops:[user],result}=await db
  .collection('users')
  .replaceOne({githubLogin:login},latestUserInfo,{upsert:true})
 //@TOFIXME:
  result.ok && pubsub.publish('user-added', { newUser: user })
  
  return {user,token:access_token}
}
const addFakeUsers:Fn=async (parent,{count},{db,pubsub})=>{
  const randomUserApi=`https://randomuser.me/api/?results=${count}`
  
  const {results}=await fetch(randomUserApi).then(res=>res.json())
  
  const users=results.map((r:any)=>({
    githubLogin:r.login.username,
    name:`${r.name.first} ${r.name.last}`,
    avatar:r.picture.thumbnail,
    githubToken:r.login.sha1
  }));
 await db.collection('users').insert(users)

 const newUsers=await db.collection('users').find()
    .sort({ _id: -1 })
    .limit(count)
    .toArray()

  newUsers.forEach(newUser => pubsub.publish('user-added', {newUser}))
  return users
}
const fakeUserAuth:Fn=async(parent,{githubLogin},{db})=>{
  const user=await db.collection('users').findOne({githubLogin})
  if(!user){
    throw new Error(`cannot find user with githubLogin ${githubLogin}`)
  }
  return {
    token:user.githubToken,
    user
  }
}
export default {
    postPhoto,
    tagPhoto,
    githubAuth,
    addFakeUsers,
    fakeUserAuth
}