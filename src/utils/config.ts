
let DB_HOST='';

let CLIENT_ID="e86d1162e89658b55"
let CLIENT_SECRET="307b4ae0edf31e997e6b5bd21624f52cc29e28c";

switch (process.env.NODE_ENV) {
  case "test":
    break;
  case "production":
    DB_HOST="mongodb://test:123@127.0.0.1:27017/graphQL-photo-api"
    break;
  default:
    DB_HOST="mongodb://localhost:27017/graphQL-photo-api"
}


export  {CLIENT_ID,CLIENT_SECRET,DB_HOST}