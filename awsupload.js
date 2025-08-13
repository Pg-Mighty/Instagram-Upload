import {S3Client , PutObjectCommand} from "@aws-sdk/client-s3"
import env from "dotenv"

env.config()

const client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "sasas",
        secretAccessKey: "sase2",
    },
    })
