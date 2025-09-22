import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

function edit() {
    
try {
    ffmpeg()
        .input("https://reelsformyinstgrampage123.s3.ap-south-1.amazonaws.com/1.mp4")
        .input("https://reelsformyinstgrampage123.s3.ap-south-1.amazonaws.com/2.mp4")
        .input("https://reelsformyinstgrampage123.s3.ap-south-1.amazonaws.com/3.mp4")
        .mergeToFile('output2.mp4')
        .run();

}catch (e) {
    console.log(e);
}

console.log(ffmpegInstaller.path);
}

export default edit;
