import {S3Client , PutObjectCommand} from "@aws-sdk/client-s3"
import env from "dotenv"
import init from "./main.js";

env.config();

function upload(videoBuffer) {
    const buffer = Buffer.from(videoBuffer, "base64");
    putObject(buffer);
}



async function putObject(buffer) {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: "Reel.mp4",
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
    init();

}

export default upload;

