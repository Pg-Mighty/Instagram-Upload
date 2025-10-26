/*
import cron from 'node-cron';
import main from './promptGen.js';

cron.schedule("34 18 * * *", main );*/

import axios from "axios";
import fs from "fs";

const text = fs.readFileSync("request.txt");
const as = text.toString();

const form = new FormData();
form.append("f.req", as);

const options = {
    method: 'POST',
    url: 'https://gemini.google.com/_/BardChatUi/data/batchexecute',
    headers: {
        cookie: 'NID=525%3DV7Pbcf8eaAJPmy0mT4CtkWIXMacc9OXRZwgYPDUkqJPUmIlty_-YagUeNwzyKHKGrudzSXoH0cFACiHpjdLdX4LYevYXoNCd3bI2wwggpDrNikyrbLYkzTtHejTwdWG28fNgyaGj0HOnCCCa5vWggTZwvgWrI6QHp9T0aku1iyb13TBJ0O5K2Xl6w_l8HW_VPbD_H93XiWoRE5Zk',
        'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
        'User-Agent': 'insomnia/11.4.0'
    },
    data: '[form]'
};

axios.request(options).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error);
});
