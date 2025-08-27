const config = require('../settings');
const moment = require('moment-timezone');
const { malvin, commands } = require('../malvin');
const { runtime } = require('../lib/functions');
const os = require('os');
const { getPrefix } = require('../lib/prefix');

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

        const userId = (typeof sender === 'string' ? sender : sender?.id || 'user').split('@')[0];

        // Menu header
        let menu = `
╭──❖ 🌸 *${toTinyCaps(config.BOT_NAME || 'Cyberia Bot')}* 🌸 ❖──╮
│
│ 👤 User      : @${userId}
│ ⏰ Time      : ${time}
│ 📅 Date      : ${date}
│ 🔄 Uptime    : ${runtime(process.uptime())}
│ ⚙️ Mode      : ${config.MODE || 'Public'}
│ 📡 Platform  : ${os.platform()}
│ ⌨️ Prefix    : [ ${prefix} ]
│ 🧩 Plugins   : ${Array.isArray(commands) ? commands.length : 0}
│ 👑 Developer : ${config.OWNER_NAME || 'Dev-Sung'}
│ 🚀 Version   : ${config.version || '2.5.0'}
│
╰──❖─────────────────────────❖──╯
`;

        // Group commands by category
        const categories = {};
        for (const cmd of commands || []) {
            if (cmd.category && !cmd.dontAdd && cmd.pattern) {
                categories[cmd.category] = categories[cmd.category] || [];
                categories[cmd.category].push(cmd.pattern.split('|')[0]);
            }
        }

        // Add sorted categories
        for (const cat of Object.keys(categories).sort()) {
            menu += `\n╭─❖ ✦ ${toTinyCaps(cat)} ${toTinyCaps('Menu')} ✦ ❖─╮\n`;
            for (const cmd of categories[cat].sort()) {
                menu += `│ ➤ ${prefix}${cmd}\n`;
            }
            menu += `╰──❖────────────────────❖──╯\n`;
        }

        menu += `\n> ${config.DESCRIPTION || toTinyCaps('Explore the bot commands!')}`;

        // Context info
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
                            newsletterJid: config.NEWSLETTER_JID || '120363402507750390@newsletter',
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
});│ ⏰ Time      : ${time}
│ 📅 Date      : ${date}
│ 🔄 Uptime    : ${runtime(process.uptime())}
│ ⚙️ Mode      : ${config.MODE || 'Public'}
│ 📡 Platform  : ${os.platform()}
│ ⌨️ Prefix    : [ ${prefix} ]
│ 🧩 Plugins   : ${commands.length}
│ 👑 Developer : ${config.OWNER_NAME || 'Dev-Sung'}
│ 🚀 Version   : ${config.version || '2.5.0'}
│
╰──❖─────────────────────────❖──╯
`;

        // Group commands by category
        const categories = {};
        for (const cmd of commands) {
            if (cmd.category && !cmd.dontAdd && cmd.pattern) {
                categories[cmd.category] = categories[cmd.category] || [];
                categories[cmd.category].push(cmd.pattern.split('|')[0]);
            }
        }

        // Add sorted categories
        for (const cat of Object.keys(categories).sort()) {
            menu += `\n╭─❖ ✦ ${toTinyCaps(cat)} ${toTinyCaps('Menu')} ✦ ❖─╮\n`;
            for (const cmd of categories[cat].sort()) {
                menu += `│ ➤ ${prefix}${cmd}\n`;
            }
            menu += `╰──❖────────────────────❖──╯\n`;
        }

        menu += `\n> ${config.DESCRIPTION || toTinyCaps('Explore the bot commands!')}`;

        // Context info
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
});
