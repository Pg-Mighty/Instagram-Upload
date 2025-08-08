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
    "upload_type": "resumable"
}




axios.post(url, body, { headers: header }).then((res)=>{
    container_url = res.data.uri;
    console.log(container_url);
}).catch(err=>console.log(err.data));







/*
    const metadata = fs.statSync(videoPath);
    const vid_size = metadata.size;

    const videoBuffer=  fs.readFileSync(videoPath).toString('binary');



    container_url = "https://rupload.facebook.com/ig-api-upload/v23.0/18018571550756447";

axios.post(container_url, videoBuffer, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "offset": "0",
            "file_size": `${vid_size}`
        }
    }).then((res) => {

        console.log(res.data);
    });

*/









