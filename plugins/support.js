/*
Project Name : PEAKY-BLINDER-MD 
Creator      : Sang Led
Repo         : https://github.com/Thomas-shelby001/PEAKY-BLINDER-MD 
Support      : wa.me/254116266407
*/

const config = require('../settings');
const { lee } = require('../lee');
const { runtime } = require('../lib/functions');

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

lee({
    pattern: "support",
    alias: ["follow", "links"],
    desc: "Display support and follow links",
    category: "main",
    react: "📡",
    filename: __filename
}, 
async (conn, mek, m, {
    from, reply, pushname
}) => {
    try {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const uptimeFormatted = runtime(process.uptime());

        const message = `
╭─『 *𝑷𝑬𝑨𝑲𝒀-𝑩𝑳𝑰𝑵𝑫𝑬𝑹-𝑴𝑫 - 𝗦𝗨𝗣𝗣𝗢𝗥𝗧* 』─
│ 👤 *Developer* : Sang Lee 🇰🇪
│ ⚙️ *Mode*      : ${config.MODE}
│ ⏱️ *Uptime*    : ${uptimeFormatted}
│ 💠 *Prefix*    : ${config.PREFIX}
│ 🔖 *Version*   : ${config.version}
│ 🕰️ *Time*      : ${currentTime}
╰─────────────

📢 *Follow & Support PEAKY-BLINDER-MD* ${readMore}

🔔 *Official WhatsApp Channel*
🔗 https://whatsapp.com/channel/0029VbAuEfj29754YgFtRf33

🎬 *YouTube Channel*
🔗 https://youtube.com/@SangLee-h2i

👨‍💻 *Developer Contact*
🔗 wa.me/254116266407?text=Hi%20Sang Lee,%20IPEAKY BLINDER MD%20Fan%20here!

> 💡 Powered by *Sang Lee*
        `.trim();

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/2857dd.jpg' },
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363403627964616@newsletter',
                    newsletterName: '☠️『 𝙿𝙴𝙰𝙺𝚈-𝙱𝙻𝙸𝙽𝙳𝙴𝚁-𝙼𝙳 』☠️',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Support Cmd Error:", e);
        reply(`⚠️ An error occurred:\n${e.message}`);
    }
});
