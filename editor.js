import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import fs from "fs";
import {putObject as upload} from "./awsupload.js";
import init from "./main.js";


ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

async function edit() {
    
try {
    await ffmpeg()
        .input("https://reelsformyinstgrampage123.s3.ap-south-1.amazonaws.com/3.mp4")
        .input("https://reelsformyinstgrampage123.s3.ap-south-1.amazonaws.com/3.mp4")
        .input("https://reelsformyinstgrampage123.s3.ap-south-1.amazonaws.com/3.mp4")
        .mergeToFile('Reel.mp4')
        .output('Reel.mp4')
        .run();

}catch (e) {
    console.log(e);
}
 //   finalVideo();

}
edit();

function finalVideo(){


    fs.readFile("Reel.mp4", (err, data) => {

        if(err){
            console.log(err);
        }else{
            upload(data, "Reel").then(init);
        }
    })
}


export default edit;
