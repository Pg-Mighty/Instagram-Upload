
const fs = require('fs');
const path = require('path');
const axios = require("axios")
require('dotenv').config();

const image =path.join(__dirname, 'images', 'Cat.png');




const url = `https://graph.facebook.com/v23.0/${}/media?access_token=${}`;

axios.post(url).then((res) =>{
    console.log(res)
})