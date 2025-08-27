const config = require('../settings');
const { malvin } = require('../malvin');
const moment = require('moment-timezone');

// Bot start time for uptime calculation
const botStartTime = process.hrtime.bigint();

// Cache for timezone formatting
const formatCache = new Map();

const emojiSets = {
    reactions: ['⚡', '🚀', '💨', '🎯', '🌟', '💎', '🔥', '✨', '🌀', '🔹'],
    status: [
        { threshold: 0.3, text: '🚀 Super Fast' },
        { threshold: 0.6, text: '⚡ Fast' },
        { threshold: 1.0, text: '⚠️ Medium' },
        { threshold: Infinity, text: '🐢 Slow' }
    ]
};

malvin({
    pattern: 'ping',
    alias: ['speed', 'pong','p'],
    desc: 'Check bot\'s response time and status',
    category: 'main',
    react: '⚡',
    filename: __filename
}, async (malvin, mek, m, { from, sender, reply }) => {
    try {
        // High-resolution start time
        const start = process.hrtime.bigint();

        // Random emoji reaction
        const reactionEmoji = emojiSets.reactions[Math.floor(Math.random() * emojiSets.reactions.length)];
        await malvin.sendMessage(from, { react: { text: reactionEmoji, key: mek.key } }).catch(() => {});

        // Calculate response time in seconds
        const responseTime = Number(process.hrtime.bigint() - start) / 1e9;

        // Determine status based on response time
        const statusText = emojiSets.status.find(s => responseTime < s.threshold)?.text || '🐢 Slow';

        // Time info (cache formatting)
        const timezone = config.TIMEZONE || 'Africa/Harare';
        const cacheKey = `${timezone}:${moment().format('YYYY-MM-DD HH:mm')}`;
        let time, date;
        if (formatCache.has(cacheKey)) {
            ({ time, date } = formatCache.get(cacheKey));
        } else {
            time = moment().tz(timezone).format('HH:mm:ss');
            date = moment().tz(timezone).format('DD/MM/YYYY');
            formatCache.set(cacheKey, { time, date });
            if (formatCache.size > 100) formatCache.clear();
        }

        // Uptime
        const uptimeSeconds = Number(process.hrtime.bigint() - botStartTime) / 1e9;
        const uptime = moment.duration(uptimeSeconds, 'seconds').humanize();

        // Memory usage
        const memory = process.memoryUsage();
        const memoryUsage = `${(memory.heapUsed / 1024 / 1024).toFixed(2)}/${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`;

        // System info
        const nodeVersion = process.version;

        // Owner & bot info
        const ownerName = config.OWNER_NAME || 'Dev Sung';
        const botName = config.BOT_NAME || 'Cyberia-MD';
        const repoLink = config.REPO || 'https://github.com/NaCkS-ai/Cyberia-MD';

        // Dynamic loading bar based on response time (max 10 blocks)
        const barCount = Math.min(10, Math.max(1, Math.floor(10 - responseTime * 10)));
        const loadingBar = '▰'.repeat(barCount) + '▱'.repeat(10 - barCount);

        // Final output
        const pingMsg = `
✨🌸 ʀᴇᴀᴅʏ sᴛᴀᴛᴜs! 🌸✨

💫 *${statusText}* 💫

⚡ ᴿᴱˢᴾᴼᴺˢᴱ ᵀᴵᴹᴱ : ${responseTime.toFixed(2)}s
⏰ ᴛɪᴍᴇ           : ${time} (${timezone})
📅 ᴅᴀᴛᴇ           : ${date}
⏱️ ᴜᴘᴛɪᴍᴇ          : ${uptime}
💾 ᴍᴇᴍᴏʀʏ ᴜsᴀɢᴇ     : ${memoryUsage}
🖥️ ɴᴏᴅᴇ ᴠᴇʀꜱɪᴏɴ     : ${nodeVersion}

💻 ᴅᴇᴠᴇʟᴏᴘᴇʀ       : ${ownerName}
🤖 ʙᴏᴛ ɴᴀᴍᴇ        : ${botName}

🌟 ᴅᴏɴ'ᴛ ꜰᴏʀɢᴇᴛ ᴛᴏ *sᴛᴀʀ* & *ꜰᴏʀᴋ* ᴛʜᴇ ʀᴇᴘᴏ!
🔗 ʀᴇᴘᴏ ʟɪɴᴋ        : ${repoLink}

💖 Loading Status:  
${loadingBar}

🌸 Have a magical day! 🌸
`.trim();

        await malvin.sendMessage(from, {
            text: pingMsg,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402507750390@newsletter',
                    newsletterName: `🚀 ${botName} 🚀`,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Success reaction
        await malvin.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error('❌ Ping command error:', e);
        await reply(`❌ Error: ${e.message || 'Failed to process ping command'}`);
        await malvin.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});        // High-resolution start time
        const start = process.hrtime.bigint();

        // Random emoji and loading bar
        const reactionEmoji = emojiSets.reactions[Math.floor(Math.random() * emojiSets.reactions.length)];
        const loadingBar = emojiSets.bars[Math.floor(Math.random() * emojiSets.bars.length)];

        // React with emoji (with retry)
        let attempts = 0;
        const maxAttempts = 2;
        while (attempts < maxAttempts) {
            try {
                await malvin.sendMessage(from, { react: { text: reactionEmoji, key: mek.key } });
                break;
            } catch (reactError) {
                attempts++;
                if (attempts === maxAttempts) throw new Error('Failed to send reaction');
            }
        }

        // Calculate response time in seconds
        const responseTime = Number(process.hrtime.bigint() - start) / 1e9;

        // Determine status based on response time
        const statusText = emojiSets.status.find(s => responseTime < s.threshold)?.text || '🐢 Slow';

        // Time info (cache formatting for performance)
        const timezone = config.TIMEZONE || 'Africa/Harare';
        const cacheKey = `${timezone}:${moment().format('YYYY-MM-DD HH:mm:ss')}`;
        let time, date;
        if (formatCache.has(cacheKey)) {
            ({ time, date } = formatCache.get(cacheKey));
        } else {
            time = moment().tz(timezone).format('HH:mm:ss');
            date = moment().tz(timezone).format('DD/MM/YYYY');
            formatCache.set(cacheKey, { time, date });
            if (formatCache.size > 100) formatCache.clear(); // Prevent memory leak
        }

        // Uptime
        const uptimeSeconds = Number(process.hrtime.bigint() - botStartTime) / 1e9;
        const uptime = moment.duration(uptimeSeconds, 'seconds').humanize();

        // Memory usage
        const memory = process.memoryUsage();
        const memoryUsage = `${(memory.heapUsed / 1024 / 1024).toFixed(2)}/${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`;

        // System info
        const nodeVersion = process.version;

        // Owner & bot name
        const ownerName = config.OWNER_NAME || 'Dev Sung';
        const botName = config.BOT_NAME || 'Cyberia-MD;
        const repoLink = config.REPO || 'https://github.com/NaCkS-ai/Cyberia-MD;

        // Final output
        const pingMsg = `

✨🌸 ʀᴇᴀᴅʏ sᴛᴀᴛᴜs! 🌸✨

💫 *${statusText}* 💫

⚡ ᴿᴱˢᴾᴼᴺˢᴱ ᵀᴵᴹᴱ : ${responseTime.toFixed(2)}s
⏰ ᴛɪᴍᴇ           : ${time} (${timezone})
📅 ᴅᴀᴛᴇ           : ${date}
⏱️ ᴜᴘᴛɪᴍᴇ          : ${uptime}
💾 ᴍᴇᴍᴏʀʏ ᴜsᴀɢᴇ     : ${memoryUsage}
🖥️ ɴᴏᴅᴇ ᴠᴇʀꜱɪᴏɴ     : ${nodeVersion}

💻 ᴅᴇᴠᴇʟᴏᴘᴇʀ       : ${ownerName}
🤖 ʙᴏᴛ ɴᴀᴍᴇ        : ${botName}

🌟 ᴅᴏɴ'ᴛ ꜰᴏʀɢᴇᴛ ᴛᴏ *sᴛᴀʀ* & *ꜰᴏʀᴋ* ᴛʜᴇ ʀᴇᴘᴏ!
🔗 ʀᴇᴘᴏ ʟɪɴᴋ        : ${repoLink}

💖 Loading Status:  
${loadingBar}

🌸 Have a magical day! 🌸
`.trim();

        // Send message with retry
        attempts = 0;
        while (attempts < maxAttempts) {
            try {
                await malvin.sendMessage(from, {
                    text: pingMsg,
                    contextInfo: {
                        mentionedJid: [sender],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363402507750390@newsletter',
                            newsletterName: `🚀 ${botName} 🚀`,
                            serverMessageId: 143
                        }
                    }
                }, { quoted: mek });
                break;
            } catch (sendError) {
                attempts++;
                if (attempts === maxAttempts) throw new Error('Failed to send message');
            }
        }

        // Success reaction
        await malvin.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error('❌ Ping command error:', e);
        await reply(`❌ Error: ${e.message || 'Failed to process ping command'}`);
        await malvin.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});
