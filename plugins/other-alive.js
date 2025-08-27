const config = require('../settings');
const axios = require('axios');
const { malvin } = require('../malvin');

// ᴜᴛɪʟɪᴛʏ ꜰᴜɴᴄᴛɪᴏɴ ᴛᴏ ɢᴇᴛ ʀᴇꜱᴘᴏɴꜱᴇ ᴛɪᴍᴇ
const getResponseTime = (startTime) => {
  const diff = process.hrtime(startTime);
  return (diff[0] * 1000 + diff[1] / 1e6).toFixed(2); // ᴍꜱ
};

malvin({
  pattern: "live",
  desc: "Check if Cyberia-MD is alive and operational",
  category: "main",
  react: "🟢",
  filename: __filename
}, async (malvin, mek, m, { from, sender, pushname, reply }) => {
  const startTime = process.hrtime();
  try {
    const caption = `
🌸✨ *Cyberia-MD is Alive!* ✨🌸

👋 Hello @${pushname}
🕒 Time : ${new Date().toLocaleTimeString('en-ZA', { timeZone: config.TIMEZONE || 'Africa/Harare' })}
📅 Date : ${new Date().toLocaleDateString('en-ZA', { timeZone: config.TIMEZONE || 'Africa/Harare', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
⏱️ Response Time: ${getResponseTime(startTime)} ms
⚙️ Version: ${config.version || '2.5.0'}
🧠 Bot Type: WhatsApp Assistant

🔖 Type *.allmenu* to explore all commands.

© ${new Date().getFullYear()} Dev Sung
`.trim();

    const imageUrl = config.ALIVE_IMAGE_URL || 'https://files.catbox.moe/v2f5bk.jpg';

    // Check if image is accessible
    await axios.head(imageUrl).catch(() => {
      return reply('⚠️ Unable to load bot image, but Cyberia-MD is alive!');
    });

    await malvin.sendMessage(from, {
      image: { url: imageUrl },
      caption,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363402507750390@newsletter',
          newsletterName: 'Dev Sung',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (err) {
    console.error('Error in live command:', err);
    const errorMessage = err.message.includes('network')
      ? '⚠️ Network issue detected. Please try again later.'
      : `❌ Error: ${err.message}`;
    await reply(errorMessage);
  }
});
