const axios = require("axios")
require('dotenv').config();

const accessToken = process.env.access_token;
const appId = process.env.app_id;

const url = `https://graph.facebook.com/v23.0/${appId}/media`;
let container_id;

const header = {
    "Authorization": `Bearer ${accessToken}`
}

const body ={
    "media_type": "REELS",
    "video_url": "https://statxtract.com/reel.mp4"
}

axios.post(url, body, { headers: header }).then((res)=>{
    container_id = res.data.id;
}).then(uploadVideo).catch(err=>console.log(err.data));



async function uploadVideo(){

     await axios.post(`https://graph.facebook.com/v23.0/${appId}/media_publish` ,
         {
         "creation_id": container_id
     }, {headers:{

         "Content-Type": "application/json",
         "Authorization": `Bearer ${accessToken}`

             }}).then(res=>console.log(res.data)).catch(err=>console.log(err.data));


}








