import  fetch from 'node-fetch'
import fs from 'fs'

type ReqGithub={
    client_id:string;
    client_secret:String;
    code:String;
}
const requestGithubToken=(credentials:ReqGithub)=>
{
return fetch(
    'https://github.com/login/oauth/access_token',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(credentials)
    }
).then(res => res.json())
}
const requestGithubUserAccount=(token:string)=>
fetch(`https://api.github.com/user?access_token=${token}`)
.then(res => res.json())

export const authorizeWithGithub=async(credentials:ReqGithub)=>{
    const {access_token}=await requestGithubToken(credentials);
    const githubUser=await requestGithubUserAccount(access_token);
    return {...githubUser,access_token}
}

export const uploadStream=(stream:any,path:any)=>
    new Promise((resolve,reject)=>{
        stream.on('error',(err:any)=>{
            if(stream.truncated){
                fs.unlinkSync(path)
            }
            reject(err)
        }).on('end',resolve)
        .pipe(fs.createWriteStream(path))
    })
