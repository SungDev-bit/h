const fs = require('fs');
const path = require('path');
const config = require('../settings')
const {lee , commands} = require('../lee')


// Composing (Auto Typing)
lee({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    if (config.AUTO_TYPING === 'true') {
        await conn.sendPresenceUpdate('composing', from); // send typing 
    }
});
