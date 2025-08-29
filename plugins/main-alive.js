const { malvin } = require('../malvin');
const moment = require('moment-timezone');
const config = require('../settings');
const os = require('os');
const { runtime } = require('../lib/functions');

const botStartTime = Date.now();
const ALIVE_IMG = config.ALIVE_IMAGE || 'https://files.catbox.moe/v2f5bk.jpg';
const NEWSLETTER_JID = config.NEWSLETTER_JID || '120363402507750390@newsletter';
const AUDIO_URL = config.AUDIO_URL || 'https://files.catbox.moe/pjlpd7.mp3';

// Tiny caps mapping for lowercase letters
const tinyCapsMap = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
  j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'q', r: 'ʀ',
  s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
};

// Function to convert string to tiny caps
const toTinyCaps = (str) => {
  return str
    .split('')
    .map((char) => tinyCapsMap[char.toLowerCase()] || char)
    .join('');
};

// ✨ Anime-style Alive Status ✨
const formatStatusInfo = (pushname, harareTime, harareDate, runtimeHours, runtimeMinutes, runtimeSeconds, config) => `
╭─❖ 🌸 *Ａｎｉｍｅ Ａｌｉｖｅ Ｓｔａｔｕｓ* 🌸 ❖─╮
│
│ (≧▽≦)/~ ʜᴇʟʟᴏ, *${pushname}*! 💮
│
│ ⏰ ᴛɪᴍᴇ: *${harareTime}*
│ 📆 ᴅᴀᴛᴇ: *${harareDate}*
│ ⏳ ᴜᴘᴛɪᴍᴇ: *${runtimeHours}ʜ ${runtimeMinutes}ᴍ ${runtimeSeconds}s*
│ 💾 ʀᴀᴍ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}ᴍʙ / ${Math.round(os.totalmem() / 1024 / 1024)}ᴍʙ
│
│ ⚠️ *Ｎｏｔｉｃｅ* ⚠️
│ Use this bot wisely, Senpai~
│ I won’t take responsibility if
│ Wʜᴀᴛsᴀᴘᴘ-sama gets angry (╥﹏╥)
│
│ 🔗 ʀᴇᴘᴏ: ${config.REPO}
│
╰─❖──────────────❖─╯

🌸 *Cyberia-MD is Alive!* 🌸  
⚔️ Sʏsᴛᴇᴍ: Stable & Running Smooth  
(✿◠‿◠)ﾉﾞ Stay Otaku, Senpai 💮
`.trim();

malvin({
  pattern: 'alive',
  alias: ['uptime', 'runtime'],
  desc: 'Check if the bot is active.',
  category: 'info',
  react: '🚀',
  filename: __filename,
}, async (malvin, mek, m, { reply, from }) => {
  try {
    const pushname = m.pushName || 'User';
    const harareTime = moment().tz('Africa/Harare').format('HH:mm:ss');
    const harareDate = moment().tz('Africa/Harare').format('dddd, MMMM Do YYYY');
    const runtimeMilliseconds = Date.now() - botStartTime;
    const runtimeSeconds = Math.floor((runtimeMilliseconds / 1000) % 60);
    const runtimeMinutes = Math.floor((runtimeMilliseconds / (1000 * 60)) % 60);
    const runtimeHours = Math.floor(runtimeMilliseconds / (1000 * 60 * 60));

    if (!ALIVE_IMG || !ALIVE_IMG.startsWith('http')) {
      throw new Error('Invalid ALIVE_IMG URL. Please set a valid image URL.');
    }

    const statusInfo = formatStatusInfo(
      pushname,
      harareTime,
      harareDate,
      runtimeHours,
      runtimeMinutes,
      runtimeSeconds,
      config
    );

    await malvin.sendMessage(from, {
      image: { url: ALIVE_IMG },
      caption: statusInfo,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: NEWSLETTER_JID,
          newsletterName: toTinyCaps('🌸 Cyberia-MD ⚔️'),
          serverMessageId: 143,
        },
      },
    }, { quoted: mek });

    await malvin.sendMessage(from, {
      audio: { url: AUDIO_URL },
      mimetype: 'audio/mp4',
      ptt: true,
    }, { quoted: mek });

  } catch (error) {
    console.error('❌ Error in alive command:', error.message);
    const errorMessage = toTinyCaps(`
      An error occurred while processing the alive command.
      Error Details: ${error.message}
      Please report this issue or try again later.
    `).trim();
    return reply(errorMessage);
  }
});
