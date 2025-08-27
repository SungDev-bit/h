const { malvin } = require("../malvin");
const config = require("../settings");
const os = require("os");
const { runtime } = require('../lib/functions');
const moment = require("moment");

const ALIVE_IMG = "https://files.catbox.moe/v2f5bk.jpg";

malvin({
    pattern: "alive2",
    desc: "Check bot's status & uptime",
    category: "main",
    react: "💡",
    filename: __filename
}, async (client, mek, m, { reply, from }) => {   // ✅ renamed malvin -> client
    try {
        const pushname = m.pushName || "User";
        const now = moment();
        const currentTime = now.format("HH:mm:ss");
        const currentDate = now.format("dddd, MMMM Do YYYY");

        const uptime = runtime(process.uptime());

        const toTinyCap = (text) =>
            text.split("").map(char => {
                const tiny = {
                    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ',
                    h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ',
                    o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ',
                    v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
                };
                return tiny[char.toLowerCase()] || char;
            }).join("");

        const msg = `
╭─❖ 🌟 「 *${toTinyCap("cyberia status")}* 」🌟 ❖─╮
│
│ 👋 ʜᴇʏ, *${pushname}*!
│ ⏰ ᴛɪᴍᴇ       : *${currentTime}*
│ 📅 ᴅᴀᴛᴇ       : *${currentDate}*
│ 🧭 ᴜᴘᴛɪᴍᴇ     : *${uptime}*
│ ⚙️ ᴍᴏᴅᴇ       : *${config.MODE || "default"}*
│ 🔰 ᴠᴇʀꜱɪᴏɴ     : *${config.version || "1.0.0"}*
│
╰─❖ 🌸 ʙᴏᴛ sᴛᴀᴛᴜs 🌸 ❖─╯

✅ ᴄʏʙᴇʀɪᴀ ɪs ᴀʟɪᴠᴇ & ᴏᴘᴇʀᴀᴛɪᴏɴᴀʟ!
🚀 ꜱʏsᴛᴇᴍ: ᴢᴏᴏᴍɪɴɢ ᴏɴ sᴍᴏᴏᴛʜ ʀᴜɴ!
✨ ᴛʜᴀɴᴋ ʏᴏᴜ ғᴏʀ ᴄʜᴇᴄᴋɪɴɢ ɪɴ!
💖 ʜᴀᴠᴇ ᴀ ᴍᴀɢɪᴄᴀʟ ᴅᴀʏ!
        `.trim();

        await client.sendMessage(from, {
            image: { url: ALIVE_IMG },
            caption: msg,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {   // ⚠️ may throw on older Baileys
                    newsletterJid: '120363402507750390@newsletter',
                    newsletterName: 'cyberia ᴀʟɪᴠᴇ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("Error in .alive2:", err);
        return reply(`❌ *Alive Command Error:*\n${err.message}`);
    }
});│
│ 👋 ʜᴇʏ, *${pushname}*!
│ ⏰ ᴛɪᴍᴇ       : *${currentTime}*
│ 📅 ᴅᴀᴛᴇ       : *${currentDate}*
│ 🧭 ᴜᴘᴛɪᴍᴇ     : *${uptime}*
│ ⚙️ ᴍᴏᴅᴇ       : *${config.MODE}*
│ 🔰 ᴠᴇʀꜱɪᴏɴ     : *${config.version}*
│
╰─❖ 🌸 ʙᴏᴛ sᴛᴀᴛᴜs 🌸 ❖─╯

✅ ᴄʏʙᴇʀɪᴀ ɪs ᴀʟɪᴠᴇ & ᴏᴘᴇʀᴀᴛɪᴏɴᴀʟ!
🚀 ꜱʏsᴛᴇᴍ: ᴢᴏᴏᴍɪɴɢ ᴏɴ sᴍᴏᴏᴛʜ ʀᴜɴ!
✨ ᴛʜᴀɴᴋ ʏᴏᴜ ғᴏʀ ᴄʜᴇᴄᴋɪɴɢ ɪɴ!
💖 ʜᴀᴠᴇ ᴀ ᴍᴀɢɪᴄᴀʟ ᴅᴀʏ!
        `.trim();

        await malvin.sendMessage(from, {
            image: { url: ALIVE_IMG },
            caption: msg,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402507750390@newsletter',
                    newsletterName: 'cyberia ᴀʟɪᴠᴇ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("Error in .alive:", err);
        return reply(`❌ *Alive Command Error:*\n${err.message}`);
    }
});
