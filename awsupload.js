import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import env from "dotenv";
import edit from "./editor.js";

env.config();

const client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.aws_access_key,
        secretAccessKey: process.env.aws_secret,
    }
});

/**
 * Iterates through the video array and uploads each buffer to S3.
 * @param {string[]} videoArray - Array of base64 encoded video strings.
 */
async function upload(videoArray) {
    console.log(`Starting upload of ${videoArray.length} videos...`);

    for (let i = 0; i < videoArray.length; i++) {
        try {
            const buffer = Buffer.from(videoArray[i], "base64");
            await putObject(buffer, i + 1);
            console.log(`Uploaded video ${i + 1}/${videoArray.length}`);
        } catch (error) {
            console.error(`Error uploading video ${i + 1}:`, error);
        }
    }

    // Call the editor after all uploads are finished
    console.log("Uploads complete. Starting editor...");
    edit();
}

/**
 * Uploads a single buffer to the specified S3 bucket.
 * @param {Buffer} buffer - The video data buffer.
 * @param {number|string} index - The index used for the filename.
 */
export async function putObject(buffer, index) {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${index}.mp4`,
        Body: buffer,
        ContentType: "video/mp4"
    };

    const putConfig = new PutObjectCommand(params);
    await client.send(putConfig);
}

export default upload;