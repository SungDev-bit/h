const config = require('../settings');
const axios = require('axios');
const { malvin, commands } = require('../malvin');

// ᴜᴛɪʟɪᴛʏ ꜰᴜɴᴄᴛɪᴏɴ ᴛᴏ ɢᴇᴛ ʀᴇꜱᴘᴏɴꜱᴇ ᴛɪᴍᴇ
const getResponseTime = (startTime) => {
  const diff = process.hrtime(startTime);
  return (diff[0] * 1000 + diff[1] / 1e6).toFixed(2); // ʀᴇᴛᴜʀɴꜱ ᴛɪᴍᴇ ɪɴ ᴍꜱ
};

malvin({
  pattern: "live",
  desc: "check if the bot is alive and operational",
  category: "main",
  react: "🌸",
  filename: __filename
},
async (malvin, mek, m, { from, sender, pushname, reply }) => {
  const startTime = process.hrtime(); // ꜱᴛᴀʀᴛ ᴛʀᴀᴄᴋɪɴɢ ʀᴇꜱᴘᴏɴꜱᴇ ᴛɪᴍᴇ
  try {
    // 🌸 anime-style caption 🌸
    const caption = `
🌸 ʜᴇʏ *${pushname}*~!  
╰─➤ ɪ'ᴍ ᴀʟɪᴠᴇ, ᴀᴡᴀᴋᴇ ✨ ᴀɴᴅ ʀᴇᴀᴅʏ ᴛᴏ ꜱᴇʀᴠᴇ ~ 💖

╭───★ ✿ *Cyberia-MD Status* ✿ ★───╮
│ 🍡 *ɴᴀᴍᴇ*      : Cyberia-MD 
│ 👑 *ᴄʀᴇᴀᴛᴏʀ*   : Dev Sung
│ ⚙️ *ᴠᴇʀꜱɪᴏɴ*   : ${config.version || '2.5.0'}
│ 📂 *ꜱᴄʀɪᴘᴛ*    : ᴘʟᴜɢɪɴꜱ
│ 🕒 *ʀᴇꜱᴘᴏɴꜱᴇ* : ${getResponseTime(startTime)} ms ⚡
╰───────────🌸───────╯

🍀 *I’m your kawaii WhatsApp assistant!*  
Helping with ✨ data, 📰 searches & more 💫

🌸 *Rules of the bot* 🌸
1. 🚫 ɴᴏ ꜱᴘᴀᴍᴍɪɴɢ  
2. 🚫 ɴᴏ ᴅɪʀᴇᴄᴛ ᴄᴀʟʟꜱ  
3. 🚫 ᴅᴏɴ'ᴛ ʙᴏᴛʜᴇʀ ᴏᴡɴᴇʀ  
4. 💖 ᴜꜱᴇ ᴍᴇ ᴡɪᴛʜ ʀᴇꜱᴘᴇᴄᴛ  

🎀 ᴛʏᴘᴇ *.ᴀʟʟᴍᴇɴᴜ* ᴛᴏ ᴇxᴘʟᴏʀᴇ ✨  

© ${new Date().getFullYear()} ✿ Dev Sung ✿
    `.trim();

    // ᴠᴀʟɪᴅᴀᴛᴇ ɪᴍᴀɢᴇ ᴜʀʟ
    const imageUrl = 'https://files.catbox.moe/v2f5bk.jpg';
    try {
      await axios.head(imageUrl);
    } catch (imgErr) {
      console.warn('ɪᴍᴀɢᴇ ᴜʀʟ ɪɴᴀᴄᴄᴇꜱꜱɪʙʟᴇ:', imgErr.message);
      return reply('⚠️ ᴜɴᴀʙʟᴇ ᴛᴏ ʟᴏᴀᴅ ʙᴏᴛ ɪᴍᴀɢᴇ. ʙᴏᴛ ɪꜱ ᴀʟɪᴠᴇ, ʙᴜᴛ ɪᴍᴀɢᴇ ꜰᴀɪʟᴇᴅ 🌸');
    }

    // ꜱᴇɴᴅ ᴍᴇꜱꜱᴀɢᴇ
    await malvin.sendMessage(from, {
      image: { url: imageUrl },
      caption,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363402507750390@newsletter',
          newsletterName: '🌸 sung ᴛᴇᴄʜ 🌸',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (err) {
    console.error('ᴇʀʀᴏʀ ɪɴ ʟɪᴠᴇ ᴄᴏᴍᴍᴀɴᴅ:', err);
    const errorMessage = err.message.includes('network')
      ? '⚠️ ɴᴇᴛᴡᴏʀᴋ ɪꜱꜱᴜᴇ ᴅᴇᴛᴇᴄᴛᴇᴅ. ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.'
      : `❌ ᴇʀʀᴏʀ: ${err.message}`;
    await reply(errorMessage);
  }
});
