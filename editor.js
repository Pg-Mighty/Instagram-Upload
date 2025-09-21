import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

function edit(videoArray) {
try {
    ffmpeg()
        .input(videoArray[0])
        .

}catch (e) {
    console.log(e);
}

console.log(ffmpegInstaller.path);
}
