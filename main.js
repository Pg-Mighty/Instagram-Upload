const fs = require('fs');
const path = require('path');
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
    console.log(container_id);
}).catch(err=>console.log(err.data));

/*

async function uploadVideo(){

    const upload_id = await axios.post(`https://rupload.facebook.com/v23.0/${appId}/media_publish`)

}
*/








