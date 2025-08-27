const config = require('../settings');
const { malvin, commands } = require('../malvin');
const axios = require('axios');
const moment = require('moment-timezone');
const fs = require('fs');

const { getPrefix } = require('../lib/prefix');

// Fetch GitHub repository forks
const fetchGitHubForks = async () => {
    try {
        const repo = config.GITHUB_REPO || 'NaCkS-ai/Cyberia-MD';
        const response = await axios.get(`https://api.github.com/repos/${repo}`);
        return response.data.forks_count || 'N/A';
    } catch (e) {
        console.error('Error fetching GitHub forks:', e);
        return 'N/A';
    }
};

// Runtime formatter
const runtime = (seconds) => {
    seconds = Math.floor(seconds);
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${days ? days + 'd ' : ''}${hours ? hours + 'h ' : ''}${minutes ? minutes + 'm ' : ''}${secs}s`.trim();
};

malvin({
    pattern: 'menu',
    alias: 'm',
    desc: 'Show interactive menu system',
    category: 'main',
    react: '🤖',
    filename: __filename
}, async (malvin, mek, m, { from, reply }) => {
    try {
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
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.NEWSLETTER_JID || '120363402507750390@newsletter',
                newsletterName: config.OWNER_NAME || 'dev sung',
                serverMessageId: 143
            }
        };

        // Improved Menu Layout
        const menuCaption = `
╔══════════════════════╗
║ 🤖 ${config.BOT_NAME} ║
╠══════════════════════╣
║ 👤 Owner       : @${config.OWNER_NUMBER}
║ 🌍 Mode        : ${config.MODE.toLowerCase()}
║ ⏰ Time        : ${time}
║ 📅 Date        : ${date}
║ 🛠️ Prefix      : ${prefix}
║ 📈 Commands    : ${totalCommands}
║ 🌐 Timezone    : ${timezone}
║ 🚀 Version     : ${config.version}
║ 👥 Daily Users : ${forks}
╚══════════════════════╝

📚 *Menu Navigation*
» Reply with a number (1-14) to select a menu
» Example: Reply "1" for Download Menu

╔══════════════════════╗
║ 🌐 Category List     ║
╠══════════════════════╣
║ 1️⃣ 📥 Download Menu
║ 2️⃣ 💬 Group Menu
║ 3️⃣ 🕹️ Fun Menu
║ 4️⃣ 👑 Owner Menu
║ 5️⃣ 🧠 AI Menu
║ 6️⃣ 🌸 Anime Menu
║ 7️⃣ 🔄 Convert Menu
║ 8️⃣ 🧩 Other Menu
║ 9️⃣ 💫 Reaction Menu
║ 🔟 🏕️ Main Menu
║ 11️⃣ 🎨 Logo Menu
║ 12️⃣ ⚙️ Settings Menu
║ 13️⃣ 🎵 Audio Menu
║ 14️⃣ 🔒 Privacy Menu
╚══════════════════════╝

💥 *${prefix}allmenu* for full commands
> » ${config.DESCRIPTION}
`;

        const sendMenuImage = async () => {
            try {
                return await malvin.sendMessage(
                    from,
                    { image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/lvomei.jpg' }, caption: menuCaption, contextInfo },
                    { quoted: mek }
                );
            } catch (e) {
                console.error('Image send failed, falling back to text:', e);
                return await malvin.sendMessage(
                    from,
                    { text: menuCaption, contextInfo },
                    { quoted: mek }
                );
            }
        };

        const sendMenuAudio = async () => {
            try {
                if (!config.MENU_AUDIO_URL) return;
                await new Promise(resolve => setTimeout(resolve, 1000));
                await malvin.sendMessage(from, {
                    audio: { url: config.MENU_AUDIO_URL },
                    mimetype: 'audio/mp4',
                    ptt: true
                }, { quoted: mek });
            } catch (e) {
                console.error('Audio send failed:', e);
            }
        };

        const sentMsg = await sendMenuImage();
        await sendMenuAudio();
        const messageID = sentMsg.key.id;

        const menuData = {}; // KEEP THE ORIGINAL MENU DATA AS IS (1-14)

        // Menu reply handler
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                if (!isReplyToMenu) return;

                const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
                const senderID = receivedMsg.key.remoteJid;

                if (menuData[receivedText]) {
                    const selectedMenu = menuData[receivedText];
                    try {
                        if (selectedMenu.image) {
                            await malvin.sendMessage(
                                senderID,
                                { image: { url: selectedMenu.imageUrl }, caption: selectedMenu.content, contextInfo },
                                { quoted: receivedMsg }
                            );
                        } else {
                            await malvin.sendMessage(senderID, { text: selectedMenu.content, contextInfo }, { quoted: receivedMsg });
                        }
                        await malvin.sendMessage(senderID, { react: { text: '✅', key: receivedMsg.key } });
                        malvin.ev.off('messages.upsert', handler);
                    } catch (e) {
                        console.error('Menu reply error:', e);
                        await malvin.sendMessage(senderID, { text: selectedMenu.content, contextInfo }, { quoted: receivedMsg });
                        malvin.ev.off('messages.upsert', handler);
                    }
                } else {
                    await malvin.sendMessage(senderID, {
                        text: `❌ *Invalid Option!* ❌\nReply with a number 1-14 to select a menu.\nExample: "1" for Download Menu\n> ${config.DESCRIPTION}`,
                        contextInfo
                    }, { quoted: receivedMsg });
                }
            } catch (e) {
                console.error('Handler error:', e);
            }
        };

        malvin.ev.on('messages.upsert', handler);
        setTimeout(() => malvin.ev.off('messages.upsert', handler), 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        await malvin.sendMessage(
            from,
            { text: `❌ Menu system is busy. Please try again later.\n> ${config.DESCRIPTION}` },
            { quoted: mek }
        );
    }
});│ ⏰  Time      : ${time}
│ 📅  Date      : ${date}
│ 🔄  Uptime    : ${runtime(process.uptime())}
│ ⚙️  Mode      : ${config.MODE || 'Public'}
│ 📡  Platform  : ${os.platform()}
│ ⌨️  Prefix    : [ ${prefix} ]
│ 🧩  Plugins   : ${commands.length}
│ 👑  Developer : ${config.OWNER_NAME || 'Dev Sung'}
│ 🚀  Version   : ${config.version || '2.5.0'}
│
╰─❖────────────────────────────❖─╯
`;

        // Group commands by category
        const categories = {};
        for (const cmd of commands) {
            if (cmd.category && !cmd.dontAdd && cmd.pattern) {
                categories[cmd.category] = categories[cmd.category] || [];
                categories[cmd.category].push(cmd.pattern.split('|')[0]);
            }
        }

        // Add sorted categories with tiny caps
        for (const cat of Object.keys(categories).sort()) {
            menu += `\n\n╭═✦〔 ${toTinyCaps(cat)} ${toTinyCaps('Menu')} 〕✦═╮\n`;
            for (const cmd of categories[cat].sort()) {
                menu += `│ ➸ ${prefix}${cmd}\n`;
            }
            menu += `╰════════════`;
        }

        menu += `\n\n> ${config.DESCRIPTION || toTinyCaps('Explore the bot commands!')}`;

        // Context info for image message
        const imageContextInfo = {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.NEWSLETTER_JID || '120363402507750390@newsletter',
                newsletterName: config.OWNER_NAME || toTinyCaps('Sung Tech'),
                serverMessageId: 143
            }
        };

        // Send menu image
        await malvin.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/lvomei.jpg' },
                caption: menu,
                contextInfo: imageContextInfo
            },
            { quoted: mek }
        );

        // Send audio if configured
        if (config.MENU_AUDIO_URL) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await malvin.sendMessage(
                from,
                {
                    audio: { url: config.MENU_AUDIO_URL },
                    mimetype: 'audio/mp4',
                    ptt: true,
                    contextInfo: {
                        mentionedJid: [sender],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterName: config.OWNER_NAME || toTinyCaps('Sung Tech'),
                            serverMessageId: 143
                        }
                    }
                },
                { quoted: mek }
            );
        }

    } catch (e) {
        console.error('Menu Error:', e.message);
        await reply(`❌ ${toTinyCaps('Error')}: Failed to show menu. Try again.\n${toTinyCaps('Details')}: ${e.message}`);
    }
});    const contextInfo = {
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
