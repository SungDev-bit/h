/*
Project Name : MALVIN XD
Creator      : Malvin King
Repo         : https://github.com/XdKing2/MALVIN-XD
Support      : wa.me/263714757857
*/

const config = require('../settings');
const { malvin } = require('../malvin');
const { runtime } = require('../lib/functions');

const more = String.fromCharCode(8206);
const readMore = more.repeat(100); // Compact expandable section

malvin({
    pattern: "support",
    alias: ["follow", "links"],
    desc: "Display support and follow links for MALVIN XD",
    category: "main",
    react: "📡",
    filename: __filename
}, 
async (malvin, mek, m, {
    from, reply, pushname
}) => {
    try {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const uptimeFormatted = runtime(process.uptime());

        const message = `
╭─❖ ✨ 「 *Cyberia-MD Support Hub* 」 ✨ ❖─╮
│
│ 👤 *Hello, ${pushname}!*
│
│ 👨‍💻 *Developer:* Dev Sung 🇿🇼
│ ⚙️ *Mode:* 𝙼𝙾𝙽𝙾𝚂𝙿𝙰𝙲𝙴 ${config.MODE}
│ ⏳ *Uptime:* 𝙼𝙾𝙽𝙾𝚂𝙿𝙰𝙲𝙴 ${uptimeFormatted}
│ 🔑 *Prefix:* 𝙼𝙾𝙽𝙾𝚂𝙿𝙰𝙲𝙴 ${config.PREFIX}
│ 🛠️ *Version:* 𝙼𝙾𝙽𝙾𝚂𝙿𝙰𝙲𝙴 ${config.version}
│ 🕒 *Time:* 𝙼𝙾𝙽𝙾𝚂𝙿𝙰𝙲𝙴 ${currentTime}
│
╰─❖─────────────────────❖─╯

💫 *Stay connected with Cyberia-MD:* ${readMore}

🔔 *WhatsApp Channel:*  
╰─> https://whatsapp.com/channel/0029VbB3YxTDJ6H15SKoBv3S

🎥 *YouTube Updates:*  
╰─> https://youtube.com/@malvintech

📞 *Contact Developer Directly:*  
╰─> wa.me/12363621958?text=Hi%20dev,%20I%20need%20support!

💡 *Join the XD Community & get the latest tips!*

✨ *Cyberia-MD is fully operational & ready to assist!*  
🚀 *Powered by Dev Sung*
  

        `.trim();

        await malvin.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/lvomei.jpg' },
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402507750390@newsletter',
                    newsletterName: '🪀 sung-xᴅ 🪀',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Support Cmd Error:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
