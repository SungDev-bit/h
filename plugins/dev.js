const { lee } = require('../lee');

const tinyCaps = (text) => {
  const map = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ',
    h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ',
    o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ',
    v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
  };
  return text.split('').map(c => map[c.toLowerCase()] || c).join('');
};

lee({
  pattern: "dev",
  alias: ["developer", "dev"],
  desc: "Displays the developer info",
  category: "owner",
  react: "👨‍💻",
  filename: __filename
}, async (conn, mek, m, { from, reply, pushname }) => {
  try {
    const name = pushname || "there";

    const caption = `
╭─⌈ *👨‍💻 ${tinyCaps("Cyberia-MD developer")}* ⌋─
│
│ 👋 Hello, *${name}*!
│
│ 🤖 I'm *Lord sung*, the creator & maintainer
│    of this smart WhatsApp bot.
│
│ 👨‍💻 *OWNER INFO:*
│ ───────────────
│ 🧠 Name    : Lord Sung
│ 🎂 Age     : 20
│ 📞 Contact : wa.me/27649342626
│ 📺 YouTube : 
│            https://youtube.com/
│
╰───────────────

> ⚡ *Powered by Lord Sung*
`.trim();

    await conn.sendMessage(
      from,
      {
        image: { url: 'https://files.catbox.moe/lvomei.jpg' },
        caption,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363403627964616@newsletter',
            newsletterName: '🪀『 cyberia md 』🪀',
            serverMessageId: 143
          },
          externalAdReply: {
            title: "cyberia md Bot",
            body: "Created with ❤️ by  dev sung",
            thumbnailUrl: 'https://files.catbox.moe/lvomei.jpg',
            mediaType: 1,
            renderSmallerThumbnail: true,
            showAdAttribution: true,
            mediaUrl: "https://youtube.com/@SangLee-h2i",
            sourceUrl: "https://youtube.com/@SangLee-h2i"
          }
        }
      },
      { quoted: mek }
    );
  } catch (e) {
    console.error("Error in .owner command:", e);
    return reply(`❌ Error: ${e.message || e}`);
  }
});
