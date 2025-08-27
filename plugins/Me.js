const config = require('../settings');
const { malvin, commands } = require('../malvin');
const moment = require('moment-timezone');
const os = require('os');
const { getPrefix } = require('../lib/prefix');
const { runtime } = require('../lib/functions');

// Tiny caps converter
const toTinyCaps = (text) => {
    const tinyCapsMap = {
        a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
        j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
        s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
    };
    return text.toLowerCase().split('').map(c => tinyCapsMap[c] || c).join('');
};

malvin({
    pattern: 'menu2',
    alias: ['allmenu'],
    desc: 'Show all bot commands',
    category: 'menu',
    react: '⚡️',
    filename: __filename
}, async (malvin, mek, m, { from, sender, reply }) => {
    try {
        const prefix = getPrefix();
        const timezone = config.TIMEZONE || 'Africa/Nairobi';
        const time = moment().tz(timezone).format('HH:mm:ss');
        const date = moment().tz(timezone).format('dddd, DD MMMM YYYY');

        // Menu header with tiny caps
        let menu = `
╭─❖〔 🤖 ${toTinyCaps(config.BOT_NAME || 'Cyberia Bot')} 〕❖─╮
│
│ 👤  User      : @${sender.split('@')[0]}
│ ⏰  Time      : ${time}
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
