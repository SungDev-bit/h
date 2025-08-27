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
  pattern: "dev",
  alias: ["developer", "dev"],
  desc: "Displays the developer info",
  category: "owner",
  react: "👨‍💻",
  filename: __filename
}, async (malvin, mek, m, { from, reply, pushname }) => {   // ✅ use client
  try {
    const name = pushname || "there";

    const caption = `
╭─❖ 🌸 「 *${tinyCaps("Cyberia Developer")}* 」 🌸 ❖─╮
│
│ 👋 ʜᴇʏ, *${name}*!
│
│ 🤖 ɪ'ᴍ *Dev Sung*, ᴄʀᴇᴀᴛᴏʀ & ᴍᴀɪɴᴛᴀɪɴᴇʀ
│    ᴏғ ᴛʜɪs sᴍᴀʀᴛ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ!
│
│ 👨‍💻 *Owner Info* 💼
│ ────────────────
│ 🧠 Name    : Dev Sung
│ 🎂 Age     : 20+
│ 📞 Contact : wa.me/27649342626
│ 📺 YouTube : for updates
│            https://youtube.com/@malvintech2
│
╰─❖ 🌟 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʏʙᴇʀɪᴀ 🌟 ❖─╯
`.trim();

    await client.sendMessage(
      from,
      {
        image: { url: 'https://files.catbox.moe/lvomei.jpg' },
        caption,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402507750390@newsletter',
            newsletterName: '🪀『 Cyberia-MD』🪀',
            serverMessageId: 143
          },
          externalAdReply: {
            title: "Cyberia-MD Bot",
            body: "Created with ❤️ by Dev Sung",
            thumbnailUrl: 'https://files.catbox.moe/lvomei.jpg',  // ⚠️ might need buffer on some versions
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
    console.error("Error in .dev command:", e);
    return reply(`❌ Error: ${e.message || e}`);
  }
});│ 📺 YouTube : for updates
│            https://youtube.com/@malvintech2
│
╰─❖ 🌟 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʏʙᴇʀɪᴀ 🌟 ❖─╯
`.trim();

    await malvin.sendMessage(
      from,
      {
        image: { url: 'https://files.catbox.moe/lvomei.jpg' },
        caption,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402507750390@newsletter',
            newsletterName: '🪀『 Cyberia-MD』🪀',
            serverMessageId: 143
          },
          externalAdReply: {
            title: "Cyberia-MD Bot",
            body: "Created with ❤️ by dev sung",
            thumbnailUrl: 'https://files.catbox.moe/lvomei.jpg',
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
