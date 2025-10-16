/*
🔧 Project      : PEAKY BLINDER MD 
👑 Creator      : Sang Lee
📦 Repository   : https://github.com/Thomas-shelby001/PEAKY-BLINDER-MD
📞 Support      : https://wa.me/254105269466
*/

const { lee } = require('../lee');
const config = require('../settings');

lee({
  pattern: "owner",
  react: "📞",
  desc: "Send bot owner's contact",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const ownerName = config.OWNER_NAME || "Sang Lee";
    const ownerNumber = config.OWNER_NUMBER || "254116266407";

    // Build vCard contact
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${ownerName}`,
      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}`,
      "END:VCARD"
    ].join('\n');

    // Send vCard contact
    await conn.sendMessage(from, {
      contacts: {
        displayName: ownerName,
        contacts: [{ vcard }]
      }
    });

    // Send image + caption
    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/7drn23.jpg' },
      caption: `
╭── ❍ 𝙿𝙴𝙰𝙺𝚈-𝙱𝙻𝙸𝙽𝙳𝙴𝚁-𝙼𝙳 ❍
│ ✦ 𝙽𝚊𝚖𝚎   : *${ownerName}*
│ ✦ 𝙽𝚞𝚖𝚋𝚎𝚛 : *${ownerNumber}*
│ ✦ 𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : *${config.version || 'Unknown'}*
╰───────────────⭓
> Stay connected for 🔥 updates!`,
      contextInfo: {
        mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363403627964616@newsletter',
          newsletterName: '𝙿𝙴𝙰𝙺𝚈-𝙱𝙻𝙸𝙽𝙳𝙴𝚁-𝙼𝙳',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error("❌ Error in .owner command:", error);
    reply(`⚠️ An error occurred: ${error.message}`);
  }
});
