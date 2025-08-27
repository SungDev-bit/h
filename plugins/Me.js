const config = require('../settings');
const { malvin, commands } = require('../malvin');
const axios = require('axios');
const moment = require('moment-timezone');
const fs = require('fs');

const { getPrefix } = require('../lib/prefix');

// Function to fetch GitHub repository forks
const fetchGitHubForks = async () => {
    try {
        const repo = config.GITHUB_REPO || 'XdKing2/MALVIN-XD'; // Default repo, e.g., 'octocat/hello-world'
        const response = await axios.get(`https://api.github.com/repos/${repo}`);
        return response.data.forks_count || 'N/A';
    } catch (e) {
        console.error('Error fetching GitHub forks:', e);
        return 'N/A';
    }
};

// Updated runtime function (kept for reference, but not used in the menu)
const runtime = (seconds) => {
    seconds = Math.floor(seconds);
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    let output = '';
    if (days > 0) output += `${days}d `;
    if (hours > 0 || days > 0) output += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) output += `${minutes}m `;
    output += `${secs}s`;

    return output.trim();
};

malvin({
    pattern: 'menu',
    alias: 'm',
    desc: 'Show interactive menu system',
    category: 'main',
    react: '🤖',
    filename: __filename
}, async (malvin, mek, m, { from, reply }) => {
    try {
        // Time info
        const timezone = config.TIMEZONE || 'Africa/Harare';
        const time = moment().tz(timezone).format('HH:mm:ss');
        const date = moment().tz(timezone).format('DD/MM/YYYY');

        const prefix = getPrefix();
        const totalCommands = Object.keys(commands).length;
        const forks = await fetchGitHubForks(); // Fetch GitHub forks

        // Reusable context info
        const contextInfo = {
            mentionedJid: [`${config.OWNER_NUMBER}@s.whatsapp.net`],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.NEWSLETTER_JID || '120363402507750390@newsletter',
                newsletterName: config.OWNER_NAME || 'Malvin Bot',
                serverMessageId: 143
            }
        };

        const menuCaption = `
╭⟬⟭–––––––––––⟬⟭
   🤖 ${config.BOT_NAME}  
–––––––––––––––––––––––
👤 Owner     » @${config.OWNER_NUMBER}  
🌍 Mode      » ${config.MODE.toLowerCase()}  
⏰ Time      » ${time}  
📅 Date      » ${date}  
🛠️ Prefix    » ${prefix}  
📈 Commands  » ${totalCommands}  
🌐 Timezone  » ${timezone}  
🚀 Version   » ${config.version}  
👥 Users     » ${forks}  
⟬⟭–––––––––––⟬⟭

📚 𝑴𝒆𝒏𝒖 𝑵𝒂𝒗𝒊𝒈𝒂𝒕𝒊𝒐𝒏  
✦ Reply with a number  
✦ Or type: *.1* / *.dlmenu*  

⟬⟭–––––〔 🌐 Categories 〕–––––⟬⟭
➊ 📥 Download Menu  
➋ 💬 Group Menu  
➌ 🕹️ Fun Menu  
➍ 👑 Owner Menu  
➎ 🧠 AI Menu  
➏ 🌸 Anime Menu  
➐ 🔁 Convert Menu  
➑ 🧩 Other Menu  
➒ 💫 Reaction Menu  
➓ 🏕️ Main Menu  
⓫ 🎨 Logo Menu  
⓬ ⚙️ Settings Menu  
⓭ 🎵 Audio Menu  
⓮ 🔒 Privacy Menu  
⟬⟭––––––––––––––––––––⟬⟭

💥 Type *${prefix}allmenu* to unlock all commands
> » ${config.DESCRIPTION}
`;

        const sendMenuImage = async () => {
            try {
                return await malvin.sendMessage(
                    from,
                    {
                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/qumhu4.jpg' },
                        caption: menuCaption,
                        contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.error('Image send failed, falling back to text:', e);
                return await malvin.sendMessage(
                    from,
                    { text: menuCaption, contextInfo },
                    { quoted: mek }
                );
            }
        };

        const sendMenuAudio = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await malvin.sendMessage(from, {
                    audio: { url: config.MENU_AUDIO_URL || 'https://files.catbox.moe/z47dgd.mp3' },
                    mimetype: 'audio/mp4',
                    ptt: true
                }, { quoted: mek });
            } catch (e) {
                console.error('Audio send failed:', e);
            }
        };

        let sentMsg;
        try {
            sentMsg = await sendMenuImage();
            await sendMenuAudio();
        } catch (e) {
            console.error('Error sending menu:', e);
            if (!sentMsg) {
                sentMsg = await malvin.sendMessage(
                    from,
                    { text: menuCaption, contextInfo },
                    { quoted: mek }
                );
            }
        }

        const messageID = sentMsg.key.id;

        
        // Menu data (consider moving to a separate file for better maintainability)
        const menuData = {
            '1': {
                title: '📥 *Download Menu* 📥',
                content: `
⟬⟭━━━━━〔 📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐌𝐞𝐧𝐮 〕━━━━━⟬⟭

🌐 𝚂𝚘𝚌𝚒𝚊𝚕 𝙼𝚎𝚍𝚒𝚊 🌍
➤ .fbdl       ➤ .igimagedl  
➤ .igvid      ➤ .pindl  
➤ .tiktok     ➤ .tiktok2  
➤ .twitter    ➤ .yt / .yt2  
➤ .ytpost     ➤ .yts  

💿 𝙵𝚒𝚕𝚎𝚜 & 𝙰𝚙𝚙𝚜 💾
➤ .apk        ➤ .gdrive  
➤ .gitclone   ➤ .mediafire  
➤ .mediafire2  

🎥 𝙼𝚎𝚍𝚒𝚊 𝙲𝚘𝚗𝚝𝚎𝚗𝚝 📹
➤ .getimage   ➤ .img  
➤ .movie      ➤ .moviedl  
➤ .music      ➤ .play  
➤ .series     ➤ .song  
➤ .tovideo    ➤ .tovideo2  
➤ .video2     ➤ .video3  
➤ .xvideo  

📖 𝙼𝚒𝚜𝚌 📚
➤ .bible      ➤ .biblelist  
➤ .news       ➤ .npm  
➤ .pair       ➤ .tts  

⟬⟭━━━━━━━━━━━━━━━━━━━━⟬⟭

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['1'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/jw8h57.jpg'
            },
            '2': {
                title: "👥 *Group Menu* 👥",
                content: `
⟬⟭━━━━━〔 💬 𝐆𝐫𝐨𝐮𝐩 𝐌𝐞𝐧𝐮 〕━━━━━⟬⟭

🔧 𝙼𝚊𝚗𝚊𝚐𝚎𝚖𝚎𝚗𝚝 🛠️
➤ .requestlist   ➤ .acceptall  
➤ .rejectall     ➤ .removemembers  
➤ .removeadmins  ➤ .removeall2  
➤ .groupsprivacy ➤ .updategdesc  
➤ .updategname   ➤ .revoke  
➤ .ginfo         ➤ .newgc  

👥 𝙸𝚗𝚝𝚎𝚛𝚊𝚌𝚝𝚒𝚘𝚗 🤝
➤ .join          ➤ .invite  
➤ .hidetag       ➤ .tagall  
➤ .tagadmins     ➤ .poll  
➤ .broadcast2  

🔒 𝚂𝚎𝚌𝚞𝚛𝚒𝚝𝚢 🛡️
➤ .lockgc        ➤ .unlockgc  
➤ .unmute        ➤ .antilink  
➤ .antilinkkick  ➤ .deletelink  
➤ .antibot       ➤ .delete  
➤ .closetime     ➤ .opentime  
➤ .notify  

👑 𝙰𝚍𝚖𝚒𝚗 🧑‍💼
➤ .add           ➤ .bulkdemote  
➤ .demote        ➤ .out  
➤ .promote       ➤ .remove  

⟬⟭━━━━━━━━━━━━━━━━━━━━⟬⟭

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['2'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/ceeo6k.jpg'
            },
            '3': {
                title: "😄 *Fun Menu* 😄",
                content: `
⟬⟭━━━━━〔 🕹️ 𝐅𝐮𝐧 𝐌𝐞𝐧𝐮 〕━━━━━⟬⟭

🎲 𝙶𝚊𝚖𝚎𝚜 🎮
➤ .8ball         ➤ .coinflip  
➤ .guessnumber   ➤ .rps  
➤ .tictactoe     ➤ .truth  
➤ .dare          ➤ .quiz  
➤ .roll  

😄 𝚂𝚘𝚌𝚒𝚊𝚕 💖
➤ .angry         ➤ .compliment  
➤ .confused      ➤ .cute  
➤ .flirt         ➤ .happy  
➤ .heart         ➤ .kiss  
➤ .lovetest      ➤ .loveyou  
➤ .sad           ➤ .shy  
➤ .couplepp      ➤ .ship  

🔥 𝙴𝚗𝚝𝚎𝚛𝚝𝚊𝚒𝚗𝚖𝚎𝚗𝚝 🎉
➤ .animequote    ➤ .didyouknow  
➤ .fact          ➤ .joke  
➤ .pickupline    ➤ .quote  
➤ .quoteimage    ➤ .spamjoke  

🎨 𝙲𝚛𝚎𝚊𝚝𝚒𝚟𝚎 🖌️
➤ .aura          ➤ .character  
➤ .emoji         ➤ .emix  
➤ .fancy         ➤ .rcolor  
➤ .ringtone  

⚙️ 𝙼𝚒𝚜𝚌 🛠️
➤ .compatibility ➤ .count  
➤ .countx        ➤ .flip  
➤ .hack          ➤ .hot  
➤ .konami        ➤ .marige  
➤ .moon          ➤ .nikal  
➤ .pick          ➤ .pray4me  
➤ .rate          ➤ .remind  
➤ .repeat        ➤ .rw  
➤ .send          ➤ .shapar  
➤ .shout         ➤ .squidgame  
➤ .suspension  

🔞 𝙽𝚂𝙵𝚆 🚫
➤ .anal          ➤ .ejaculation  
➤ .erec          ➤ .nsfw  
➤ .nude          ➤ .orgasm  
➤ .penis         ➤ .sex  
➤ .suspension  

⟬⟭━━━━━━━━━━━━━━━━━━━━⟬⟭

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['3'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/9qoecp.jpg'
            },
            '4': {
                title: "👑 *Owner Menu* 👑",
                content: `
╭═✧〔 👑 *ᴏᴡɴᴇʀ ᴍᴇɴᴜ* 〕✧═╮
│
│ 🔧 *ʙᴏᴛ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ* 🛠️
│ ➟ .admin
│ ➟ .setbotimage
│ ➟ .setbotname
│ ➟ .setownername
│ ➟ .setreacts
│ ➟ .shutdown
│ ➟ .restart
│ ➟ .update
│ ➟ .dev
│ ➟ .delsudo
│ ➟ .setsudo
│ ➟ .listsudo
│
│ 🚫 *ᴜsᴇʀ ᴄᴏɴᴛʀᴏʟ* 🚷
│ ➟ .ban
│ ➟ .unban
│ ➟ .block
│ ➟ .unblock
│ ➟ .listban
│
│ 📢 *ᴄᴏᴍᴍᴜɴɪᴄᴀᴛɪᴏɴ* 📣
│ ➟ .broadcast
│ ➟ .channelreact
│ ➟ .forward
│ ➟ .msg
│ ➟ .post
│
│ 🔍 *ɪɴғᴏʀᴍᴀᴛɪᴏɴ* 🔎
│ ➟ .getpp
│ ➟ .getprivacy
│ ➟ .gjid
│ ➟ .jid
│ ➟ .person
│ ➟ .savecontact
│
│ 🎨 *ᴄᴏɴᴛᴇɴᴛ* 🖼️
│ ➟ .pp
│ ➟ .sticker
│ ➟ .take
│ ➟ .dailyfact
│
│ 🔐 *sᴇᴄᴜʀɪᴛʏ* 🛡️
│ ➟ .anti-call
│ ➟ .clearchats
│
│ ⚙️ *ᴍɪsᴄ* 🛠️
│ ➟ .leave
│ ➟ .vv
│ ➟ .vv2
│ ➟ .vv4
│
╰═════❒

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['4'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/jw8h57.jpg'
            },
            '5': {
                title: "🤖 *AI Menu* 🤖",
                content: `
╭═✦〔 🧠 *ᴀɪ ᴍᴇɴᴜ* 〕✦═╮
│
│ 🤖 *ᴀɪ ᴍᴏᴅᴇʟs* 🧠
│ ⬣ .ai
│ ⬣ .deepseek
│ ⬣ .fluxai
│ ⬣ .llama3
│ ⬣ .malvin
│ ⬣ .metaai
│ ⬣ .openai
│ ⬣ .stabilityai
│ ⬣ .stablediffusion
│
╰════❍

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['5'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/ceeo6k.jpg'
            },
            '6': {
                title: "🎎 *Anime Menu* 🎎",
                content: `
╭═✧〔 🌸 *ᴀɴɪᴍᴇ ᴍᴇɴᴜ* 〕✧═╮
│
│ 🌸 *ᴄʜᴀʀᴀᴄᴛᴇʀs* 🎀
│ ⊸ .animegirl
│ ⊸ .animegirl1
│ ⊸ .animegirl2
│ ⊸ .animegirl3
│ ⊸ .animegirl4
│ ⊸ .animegirl5
│ ⊸ .megumin
│ ⊸ .neko
│ ⊸ .waifu
│
│ 😺 *ᴀɴɪᴍᴀʟs* 🐾
│ ⊸ .awoo
│ ⊸ .cat
│ ⊸ .dog
│
│ 👗 *ᴄᴏsᴘʟᴀʏ* 👘
│ ⊸ .garl
│ ⊸ .maid
│
╰════❍

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['6'] || config.MENU_IMAGE_URL || 'https://i.ibb.co/1Y1NfhHx/malvin-xd.jpg'
            },
            '7': {
                title: "🔄 *Convert Menu* 🔄",
                content: `
╭═✦〔 🔁 *ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ* 〕✦═╮
│
│ 🖼️ *ɪᴍᴀɢᴇs* 📸
│ ✷ .blur
│ ✷ .grey
│ ✷ .imgjoke
│ ✷ .invert
│ ✷ .jail
│ ✷ .nokia
│ ✷ .rmbg
│ ✷ .wanted
│
│ 🎙️ *ᴀᴜᴅɪᴏ* 🎵
│ ✷ .aivoice
│ ✷ .tomp3
│ ✷ .toptt
│ ✷ .tts2
│ ✷ .tts3
│
│ 📄 *ғɪʟᴇs* 📑
│ ✷ .convert
│ ✷ .topdf
│ ✷ .vsticker
│
│ 🔗 *ᴜᴛɪʟɪᴛʏ* 🔧
│ ✷ .ad
│ ✷ .attp
│ ✷ .readmore
│ ✷ .tinyurl
│
╰════❍

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['7'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/jw8h57.jpg'
            },
            '8': {
                title: "📌 *Other Menu* 📌",
                content: `
╭═✧〔 🧩 *ᴏᴛʜᴇʀ ᴍᴇɴᴜ* 〕✧═╮
│
│ 🔍 *ɪɴғᴏ* 📚
│ ├─ .countryinfo
│ ├─ .define
│ ├─ .weather
│ ├─ .wikipedia
│
│ 🌐 *sᴛᴀʟᴋɪɴɢ* 🌍
│ ├─ .tiktokstalk
│ ├─ .xstalk
│ ├─ .ytstalk
│ ├─ .githubstalk
│
│ 🔐 *ᴄᴏᴅɪɴɢ* 💻
│ ├─ .base64
│ ├─ .unbase64
│ ├─ .binary
│ ├─ .dbinary
│ ├─ .urlencode
│ ├─ .urldecode
│
│ ⚙️ *ᴜᴛɪʟɪᴛɪᴇs* 🛠️
│ ├─ .calculate
│ ├─ .caption
│ ├─ .checkmail
│ ├─ .createapi
│ ├─ .gpass
│ ├─ .imgscan
│ ├─ .npm
│ ├─ .otpbox
│ ├─ .srepo
│ ├─ .tempmail
│ ├─ .tempnum
│ ├─ .trt
│ ├─ .vcc
│ ├─ .wastalk
│ ├─ .cancelallreminders
│ ├─ .cancelreminder
│ ├─ .check
│ ├─ .myreminders
│ ├─ .reminder
│ ├─ .tourl
│
│ 📸 *ɪᴍᴀɢᴇs* 🖼️
│ ├─ .remini
│ ├─ .screenshot
│
╰═════❍

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['8'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/ceeo6k.jpg'
            },
            '9': {
                title: "💞 *Reaction Menu* 💞",
                content: `
╭═✦〔 💫 *ʀᴇᴀᴄᴛɪᴏɴ ᴍᴇɴᴜ* 〕✦═╮
│
│ 😄 *ᴘᴏsɪᴛɪᴠᴇ* 💖
│ ⬩ .blush
│ ⬩ .cuddle
│ ⬩ .happy
│ ⬩ .highfive
│ ⬩ .hug
│ ⬩ .kiss
│ ⬩ .lick
│ ⬩ .nom
│ ⬩ .pat
│ ⬩ .smile
│ ⬩ .wave
│
│ 😺 *ᴘʟᴀʏғᴜʟ* 🎉
│ ⬩ .awoo
│ ⬩ .dance
│ ⬩ .glomp
│ ⬩ .handhold
│ ⬩ .poke
│ ⬩ .wink
│
│ 😈 *ᴛᴇᴀsɪɴɢ* 😜
│ ⬩ .bite
│ ⬩ .bonk
│ ⬩ .bully
│ ⬩ .cringe
│ ⬩ .cry
│ ⬩ .kill
│ ⬩ .slap
│ ⬩ .smug
│ ⬩ .yeet
│
╰═════❒

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['9'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/122liy.jpg'
            },
            '10': {
                title: "🏠 *Main Menu* 🏠",
                content: `
╭═✧〔 🏕️ *ᴍᴀɪɴ ᴍᴇɴᴜ* 〕✧═╮
│
│ 🤖 *sᴛᴀᴛᴜs* 📊
│ ⊹ .alive
│ ⊹ .alive2
│ ⊹ .online
│ ⊹ .ping
│ ⊹ .ping2
│ ⊹ .uptime
│ ⊹ .version
│
│ 📅 *sʏsᴛᴇᴍ* ⏰
│ ⊹ .date
│ ⊹ .time
│
│ 📚 *ɪɴғᴏ* ℹ️
│ ⊹ .bothosting
│ ⊹ .env
│ ⊹ .fetch
│ ⊹ .repo
│ ⊹ .support
│
│ 🆘 *ʜᴇʟᴘ* ❓
│ ⊹ .help
│ ⊹ .menu
│ ⊹ .menu2
│ ⊹ .menu3
│ ⊹ .list
│ ⊹ .report
│
│ 👤 *ᴏᴡɴᴇʀ* 👑
│ ⊹ .owner
│
╰═════❍

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['10'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/bmze2e.jpg'
            },
            '11': {
                title: "🎨 *Logo Maker* 🎨",
                content: `
╭═✦〔 🎨 *ʟᴏɢᴏ ᴍᴀᴋᴇʀ* 〕✦═╮
│
│ 🎨 *ᴛʜᴇᴍᴇs* 🌟
│ ⬢ .america
│ ⬢ .blackpink
│ ⬢ .naruto
│ ⬢ .nigeria
│ ⬢ .pornhub
│ ⬢ .sadgirl
│ ⬢ .thor
│ ⬢ .zodiac
│
│ ✨ *ᴇғғᴇᴄᴛs* 💥
│ ⬢ .3dcomic
│ ⬢ .3dpaper
│ ⬢ .boom
│ ⬢ .bulb
│ ⬢ .clouds
│ ⬢ .frozen
│ ⬢ .futuristic
│ ⬢ .galaxy
│ ⬢ .luxury
│ ⬢ .neonlight
│ ⬢ .sunset
│ ⬢ .typography
│ ⬢ .ytlogo
│
│ 🦁 *ᴄʜᴀʀᴀᴄᴛᴇʀs* 🐾
│ ⬢ .angelwings
│ ⬢ .bear
│ ⬢ .cat
│ ⬢ .deadpool
│ ⬢ .devilwings
│ ⬢ .dragonball
│ ⬢ .sans
│
│ 🖌️ *ᴄʀᴇᴀᴛɪᴠᴇ* 🎨
│ ⬢ .birthday
│ ⬢ .castle
│ ⬢ .eraser
│ ⬢ .hacker
│ ⬢ .leaf
│ ⬢ .paint
│ ⬢ .tatoo
│
╰════❍

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['11'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/s6ol5l.jpg'
            },
            '12': {
                title: "⚙️ *Settings Menu* ⚙️",
                content: `
╭═✧〔 ⚙️ *sᴇᴛᴛɪɴɢs ᴍᴇɴᴜ* 〕✧═╮
│
│ 🤖 *ʙᴇʜᴀᴠɪᴏʀ* 🤖
│ ➢ .aichat
│ ➢ .auto-react
│ ➢ .auto-recording
│ ➢ .auto-reply
│ ➢ .auto-seen
│ ➢ .auto-sticker
│ ➢ .auto-typing
│ ➢ .auto-voice
│ ➢ .customreact
│ ➢ .fakerecording
│ ➢ .faketyping
│ ➢ .heartreact
│ ➢ .ownerreact
│ ➢ .status-react
│ ➢ .status-reply
│
│ 🔧 *ɢʀᴏᴜᴘ* 👥
│ ➢ .admin-events
│ ➢ .goodbye
│ ➢ .welcome
│ ➢ .mention-reply
│
│ ⚙️ *sʏsᴛᴇᴍ* 🛠️
│ ➢ .always-online
│ ➢ .mode
│ ➢ .setprefix
│ ➢ .setvar
│
│ 🛡️ *ғɪʟᴛᴇʀs* 🔒
│ ➢ .anti-bad
│ ➢ .antidelete
│
│ 📝 *ᴘʀᴏғɪʟᴇ* 🧑
│ ➢ .autobio
│
╰═══❍

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['12'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/9qoecp.jpg'
            },
            '13': {
                title: "🎵 *Audio Menu* 🎵",
                content: `
╭═✦〔 🎵 *ᴀᴜᴅɪᴏ ᴍᴇɴᴜ* 〕✦═╮
│
│ 🎵 *ᴇғғᴇᴄᴛs* 🎶
│ ⬩ .baby
│ ⬩ .bass
│ ⬩ .blown
│ ⬩ .chipmunk
│ ⬩ .deep
│ ⬩ .demon
│ ⬩ .earrape
│ ⬩ .fast
│ ⬩ .fat
│ ⬩ .nightcore
│ ⬩ .radio
│ ⬩ .reverse
│ ⬩ .robot
│ ⬩ .slow
│ ⬩ .smooth
│ ⬩ .tupai
│
╰═════❍

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['13'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/ceeo6k.jpg'
            },
            '14': {
                title: "🔒 *Privacy Menu* 🔒",
                content: `
╭═✧〔 🔒 *ᴘʀɪᴠᴀᴄʏ ᴍᴇɴᴜ* 〕✧═╮
│
│ 🔒 *sᴇᴛᴛɪɴɢs* 🛡️
│ ✷ .anticall
│ ✷ .blocklist
│ ✷ .getbio
│ ✷ .groupsprivacy
│ ✷ .privacy
│ ✷ .setmyname
│ ✷ .setonline
│ ✷ .setppall
│ ✷ .updatebio
│ ✷ .pmblock
│
╰════❍

> ${config.DESCRIPTION}`,
                image: true,
                imageUrl: config.MENU_IMAGES?.['14'] || config.MENU_IMAGE_URL || 'https://files.catbox.moe/jw8h57.jpg'
            }
        };

        // Message handler with improved cleanup
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || 
                                        receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        
                        try {
                            if (selectedMenu.image) {
                                await malvin.sendMessage(
                                    senderID,
                                    {
                                        image: { url: selectedMenu.imageUrl },
                                        caption: selectedMenu.content,
                                        contextInfo
                                    },
                                    { quoted: receivedMsg }
                                );
                            } else {
                                await malvin.sendMessage(
                                    senderID,
                                    { text: selectedMenu.content, contextInfo },
                                    { quoted: receivedMsg }
                                );
                            }

                            await malvin.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });

                            // Remove handler after successful menu selection
                            malvin.ev.off('messages.upsert', handler);
                        } catch (e) {
                            console.error('Menu reply error:', e);
                            await malvin.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo },
                                { quoted: receivedMsg }
                            );
                            malvin.ev.off('messages.upsert', handler);
                        }
                    } else {
                        await malvin.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-14 to select a menu.\n\n*Example:* Reply with "1" for Download Menu\n\n> ${config.DESCRIPTION}`,
                                contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.error('Handler error:', e);
            }
        };

        malvin.ev.on('messages.upsert', handler);
        // Cleanup after 5 minutes or on successful menu selection
        setTimeout(() => {
            malvin.ev.off('messages.upsert', handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        await malvin.sendMessage(
            from,
            { text: `❌ Menu system is currently busy. Please try again later.\n\n> ${config.DESCRIPTION}` },
            { quoted: mek }
        );
    }
});
