import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const accessToken = process.env.access_token;
const appId = process.env.app_id;
let container_id;

function init() {
    const url = `https://graph.facebook.com/v23.0/${appId}/media`;

    const header = {
        "Authorization": `Bearer ${accessToken}`
    }

    const body = {
        "media_type": "REELS",
        "video_url": "https://reelsformyinstgrampage123.s3.ap-south-1.amazonaws.com/Reel.mp4",
        "title": "This is a I am elon musk reel"

    }

    axios.post(url, body, {headers: header}).then((res) => {
        container_id = res.data.id;
    }).then(uploadVideo).catch((err) => {
    })

}

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

export default init;





