const config = require('../settings');
const { malvin, commands } = require('../malvin');
const axios = require('axios');
const moment = require('moment-timezone');
const fs = require('fs');   // ✅ kept as you wanted
const { getPrefix } = require('../lib/prefix');

// GitHub forks fetcher
const fetchGitHubForks = async () => {
  try {
    const repo = config.GITHUB_REPO || 'XdKing2/MALVIN-XD';
    const res = await axios.get(`https://api.github.com/repos/${repo}`);
    return res.data.forks_count || 'N/A';
  } catch {
    return 'N/A';
  }
};

malvin({
  pattern: 'menu',
  alias: ['m'],
  desc: 'Show interactive menu system',
  category: 'main',
  react: '🤖',
  filename: __filename,
}, async (client, mek, m, { from, reply }) => {   // ✅ renamed malvin → client
  try {
    // Time info
    const timezone = config.TIMEZONE || 'Africa/Harare';
    const time = moment().tz(timezone).format('HH:mm:ss');
    const date = moment().tz(timezone).format('DD/MM/YYYY');

    const prefix = getPrefix();
    const totalCommands = Object.keys(commands).length;
    const forks = await fetchGitHubForks();

    const contextInfo = {
      mentionedJid: [`${config.OWNER_NUMBER}@s.whatsapp.net`],
      forwardingScore: 999,
      isForwarded: true,
      // ⚠️ keep this commented unless your Baileys supports it
      // forwardedNewsletterMessageInfo: {
      //   newsletterJid: config.NEWSLETTER_JID,
      //   newsletterName: 'Cyberia-MD',
      //   serverMessageId: 143,
      // },
    };

    const menuCaption = `
╭⟬⟭–––––––––––⟬⟭
   🤖 ${config.BOT_NAME}
–––––––––––––––––––––––
👤 Owner     » @${config.OWNER_NUMBER}
🌍 Mode      » ${config.MODE.toLowerCase()}
⏰ Time      » ${time}
📅 Date      » ${date}
🛠️ Prefix    » ${prefix}
📈 Commands  » ${totalCommands}
🌐 Timezone  » ${timezone}
🚀 Version   » ${config.version}
👥 Users     » ${forks}
⟬⟭–––––––––––⟬⟭

📚 Menu Navigation
✦ Reply with a number
✦ Or type: *.1* / *.dlmenu*
`.trim();

    // Send main menu
    const sentMsg = await client.sendMessage(
      from,
      {
        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/qumhu4.jpg' },
        caption: menuCaption,
        contextInfo,
      },
      { quoted: mek }
    );

    // ✅ load your menuData inline (or external file if you prefer)
    const menuData = {
      "1": {
        content: "📂 Downloader Menu\n\n1. *.ytmp3* - YouTube audio\n2. *.ytmp4* - YouTube video\n...",
        imageUrl: 'https://files.catbox.moe/qumhu4.jpg'
      },
      "2": {
        content: "🎭 Fun Menu\n\n1. *.joke*\n2. *.meme*\n...",
        imageUrl: 'https://files.catbox.moe/qumhu4.jpg'
      },
      // ... add your other menus (3 → 14) here
    };

    // Handler for replies
    const handler = async (msgData) => {
      try {
        const receivedMsg = msgData.messages[0];
        if (!receivedMsg?.message) return;

        const text = receivedMsg.message.conversation ||
                    receivedMsg.message.extendedTextMessage?.text;
        if (!text) return;

        if (menuData[text]) {
          const selected = menuData[text];
          await client.sendMessage(
            receivedMsg.key.remoteJid,
            {
              image: { url: selected.imageUrl },
              caption: selected.content,
              contextInfo,
            },
            { quoted: receivedMsg }
          );

          await client.sendMessage(receivedMsg.key.remoteJid, {
            react: { text: '✅', key: receivedMsg.key },
          });

          client.ev.off('messages.upsert', handler); // stop listening
        }
      } catch (err) {
        console.error('Menu reply handler error:', err);
      }
    };

    client.ev.on('messages.upsert', handler);
    setTimeout(() => client.ev.off('messages.upsert', handler), 300000); // auto-clean

  } catch (err) {
    console.error('Menu Error:', err);
    return reply('❌ Menu system busy, try again later.');
  }
});
