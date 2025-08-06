
const fs = require('fs');
const path = require('path');
const axios = require("axios")
require('dotenv').config();

const image =path.join(__dirname, 'images', 'Cat.png');

const accessToken = process.env.access_token;
const appId = process.env.app_id;


const url = `https://graph.facebook.com/v23.0/${appId}/media?access_token=${accessToken}`;

axios.post(url).then((res) =>{
    console.log(res)
})