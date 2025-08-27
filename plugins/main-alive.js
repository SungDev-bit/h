const { malvin } = require('../malvin');
const moment = require('moment-timezone');
const config = require('../settings');
const os = require('os');

const botStartTime = Date.now();
const ALIVE_IMG = config.ALIVE_IMAGE || 'https://files.catbox.moe/v2f5bk.jpg';
const NEWSLETTER_JID = config.NEWSLETTER_JID || '120363402507750390@newsletter';
const AUDIO_URL = config.AUDIO_URL || 'https://files.catbox.moe/pjlpd7.mp3';

// ✅ Full tiny caps mapping
const tinyCapsMap = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
  j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
  s: 'ѕ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
};

const toTinyCaps = (str) =>
  str.split('').map((ch) => tinyCapsMap[ch.toLowerCase()] || ch).join('');

const formatStatusInfo = (pushname, harareTime, harareDate, hrs, mins, secs, config) => `
╭═❖〔 🔥 CYBERIA-MD ALIVE STATUS 〕❖═╮
│
│ 👋 Hello, ${pushname}! 🙃
│
│ ⏰ Time       : ${harareTime}
│ 📆 Date       : ${harareDate}
│ ⏳ Uptime     : ${hrs}h ${mins}m ${secs}s
│ 🧩 RAM Usage  : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│
│ 📢 Notice:
│ I am not responsible for any WhatsApp bans
│ that may occur due to the usage of this bot.
│ Please use responsibly and at your own risk ⚠️
│
│ 🔗 Repo       : ${config.REPO || 'Not Set'}
│
╰═❖〔 🥰 Powered by Cyberia-MD 〕❖═╯
`.trim();

malvin({
  pattern: 'alive',
  alias: ['uptime', 'runtime'],
  desc: 'Check if the bot is active.',
  category: 'info',
  react: '🚀',
  filename: __filename,
}, async (client, mek, m, { reply, from }) => {   // ✅ fixed shadowing
  try {
    const pushname = m.pushName || 'User';
    const harareTime = moment().tz('Africa/Harare').format('HH:mm:ss');
    const harareDate = moment().tz('Africa/Harare').format('dddd, MMMM Do YYYY');

    const runtimeMs = Date.now() - botStartTime;
    const runtimeSeconds = Math.floor((runtimeMs / 1000) % 60);
    const runtimeMinutes = Math.floor((runtimeMs / (1000 * 60)) % 60);
    const runtimeHours = Math.floor(runtimeMs / (1000 * 60 * 60));

    const statusInfo = formatStatusInfo(
      pushname,
      harareTime,
      harareDate,
      runtimeHours,
      runtimeMinutes,
      runtimeSeconds,
      config
    );

    // Send alive image & caption
    await client.sendMessage(from, {
      image: { url: ALIVE_IMG },
      caption: statusInfo,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        // ⚠️ optional: depends on Baileys version
        // forwardedNewsletterMessageInfo: {
        //   newsletterJid: NEWSLETTER_JID,
        //   newsletterName: toTinyCaps('🔥 Cyberia-MD🥰'),
        //   serverMessageId: 143,
        // },
      },
    }, { quoted: mek });

    // Send alive audio
    await client.sendMessage(from, {
      audio: { url: AUDIO_URL },
      mimetype: 'audio/mp4',
      ptt: true,
    }, { quoted: mek });

  } catch (error) {
    console.error('❌ Error in alive command:', error.message);
    return reply(toTinyCaps(`
      An error occurred while processing the alive command.
      Error: ${error.message}
    `).trim());
  }
});
