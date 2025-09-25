import {S3Client , PutObjectCommand} from "@aws-sdk/client-s3"
import env from "dotenv"
import init from "./main.js";
import edit from "./editor.js";

env.config();

function upload(videoArray) {

    for (let i=0; i<videoArray.length; i++) {

        const buffer = Buffer.from(videoArray[i], "base64");
        putObject(buffer, i + 1)
    }

    edit();

}



export async function putObject(buffer , index) {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${index}.mp4`,
        Body: buffer,
        ContentType: "video/mp4"
    }

    const client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.aws_access_key,
            secretAccessKey: process.env.aws_secret,
        }
    });

    const putConfig = new PutObjectCommand(params)
    await client.send(putConfig);

}

export default upload;

