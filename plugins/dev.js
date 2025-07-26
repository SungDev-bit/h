const { malvin } = require('../malvin');

const tinyCaps = (text) => {
  const map = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ',
    h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ',
    o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ',
    v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
  };
  return text.split('').map(c => map[c.toLowerCase()] || c).join('');
};

malvin({
  pattern: "owner",
  alias: ["developer", "dev"],
  desc: "Displays the developer info",
  category: "owner",
  react: "👨‍💻",
  filename: __filename
}, async (conn, mek, m, { from, reply, pushname }) => {
  try {
    const name = pushname || "there";

    const caption = `
╭─⌈ *👨‍💻 ${tinyCaps("draĸonιѕ-мd developer")}* ⌋─
│
│ 👋 Hello darling, *${name}*!
│
│ 🤖 I'm *Dev Sung*, the creator & maintainer
│    of this smart WhatsApp bot.
│
│ 👨‍💻 *OWNER INFO:*
│ ───────────────
│ 🧠 Name    : Dev Sung
│ 🎂 Age     : 20+
│ 📞 Contact : wa.me/1(236)362-1958
│ 📺 YouTube : Malvin King Tech
│            https://youtube.com/@malvintech2
│
╰───────────────

> ⚡ *Powered by draĸonιѕ-мd*
`.trim();

    await conn.sendMessage(
      from,
      {
        image: { url: 'https://files.catbox.moe/ygfz2e.jpg' },
        caption,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402507750390@newsletter',
            newsletterName: '🪀『 draĸonιѕ-мd 』🪀',
            serverMessageId: 143
          },
          externalAdReply: {
            title: "draĸonιѕ-мd",
            body: "Created with ❤️ by Dev Sung",
            thumbnailUrl: 'https://files.catbox.moe/gbj8gz.jpg',
            mediaType: 1,
            renderSmallerThumbnail: true,
            showAdAttribution: true,
            mediaUrl: "https://youtube.com/@malvintech2",
            sourceUrl: "https://youtube.com/@malvintech2"
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
