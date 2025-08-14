import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const accessToken = process.env.access_token;
const appId = process.env.app_id;

const url = `https://graph.facebook.com/v23.0/${appId}/media`;
let container_id;



const header = {
    "Authorization": `Bearer ${accessToken}`
}

const body ={
    "media_type": "REELS",
    "video_url": "https://statxtract.com/Reel.mp4",
    "title": "Mars Cutting #asmr #ai #Musical #Video #veo3",

}

axios.post(url, body, { headers: header }).then((res)=>{
    container_id = res.data.id;
}).then(uploadVideo).catch((err)=>{})



    async function uploadVideo(){

       await new Promise(resolve => setTimeout(resolve, 30000));
        try {
            const response = await axios.post(`https://graph.facebook.com/v23.0/${appId}/media_publish`, {"creation_id": container_id},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                })
            console.log(response.status);
        }catch(err){
            console.log(err);
        }



    }








