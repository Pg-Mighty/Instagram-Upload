const fs = require('fs');
const path = require('path');
const axios = require("axios")
require('dotenv').config();

const videoPath =path.join(__dirname, 'video', 'reel.mp4');


const accessToken = process.env.access_token;
const appId = process.env.app_id;

const url = `https://graph.facebook.com/v23.0/${appId}/media`;
let container_url;

const header = {
    "Authorization": `Bearer ${accessToken}`,
    "Content-Type": "multipart/form-data"
}

const body ={
    "media_type": "REELS",
    "video_url": "https://drive.usercontent.google.com/u/0/uc?id=1ApR_d2vPY1W9u2oEGe24Dk9yGkiDfCj0&export=download"
}

axios.post(url, body, { headers: header }).then((res)=>{
    console.log(res.data);
}).catch(err=>console.log(err.data));











