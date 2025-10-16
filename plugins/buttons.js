const axios = require('axios');
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, downloadContentFromMessage, areJidsSameUser, getContentType } = require('@whiskeysockets/baileys')
const {lee , commands} = require('../lee')
//const prefix = config.PREFIX;


lee({
    pattern: "button",
    react: "🦄",
    desc: "downlod song",
    category: "downlod",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let pan = `> MADE BY lord sung`;
const url = "https://files.catbox.moe/lvomei.jpg"
async function image(url) {
  const { imageMessage } = await generateWAMessageContent({
    image: {
      url
    }
  }, {
    upload: conn.waUploadToServer
  });
  return imageMessage;
}
let msg = generateWAMessageFromContent(
  m.chat,
  {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: pan
          },
          carouselMessage: {
            cards: [
              {
                header: proto.Message.InteractiveMessage.Header.create({
          ...(await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/lvomei.jpg' } }, { upload: conn.waUploadToServer })),
          title: ``,
          gifPlayback: true,
          subtitle: 'LORD SUNG',
          hasMediaAttachment: false
        }),
                body: {
                  text: ` BUTTON TEST`
                },
                nativeFlowMessage: {
                  buttons: [
                    {
      name: "quick_reply",
      buttonParamsJson: `{"display_text":"Menu",
      "id": ",menu"}`
             },
                    {
     name: "quick_reply",
     buttonParamsJson: `{"display_text":"Alive",
     "id": ",alive"}`
             },
             {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":" WhatsApp Channel ","url":"https://whatsapp.com/channel/0029VbB3YxTDJ6H15SKoBv3S"}`
                    },
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":" Gitbub Repo ","url":"https://github.com/NaCkS-ai/Cyberia-MD","merchant_url":"https://github.com/NaCkS-ai/Cyberia-MD"}`
                    },
                  ],
                },
              },
            ],
            messageVersion: 1,
          },
        },
      },
    },
  },
  {}
);

await conn.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id,
});

}catch(e){
console.log(e)
reply(`${e}`)
}
})
