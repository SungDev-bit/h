const { lee } = require('../lee');
const axios = require("axios");

// ---------------------
// Command: .tinyurl
// ---------------------
lee({
  pattern: "tinyurl",
  alias: ["shorten", "shorturl", "tiny"],
  desc: "Shorten a long URL with an optional custom alias.",
  category: "convert",
  use: ".tinyurl <long_url>|<alias>",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const input = args.join(" ");
    const [longUrl, alias] = input.split("|");

    // Step 1: Validate the provided long URL
    if (!longUrl || !isValidUrl(longUrl)) {
      return reply("❌ Please provide a valid URL. Example: `.tinyurl https://example.com/very-long-url`");
    }

    let shortUrl;

    // Step 2: Handle alias logic if present
    if (alias) {
      shortUrl = await handleCustomAlias(alias, longUrl, reply);
      if (shortUrl) {
        return replyWithUrl(conn, from, longUrl, shortUrl, mek);
      }
    } else {
      // Step 3: No alias provided, shorten URL using TinyURL API
      shortUrl = await shortenUrl(longUrl);
      return replyWithUrl(conn, from, longUrl, shortUrl, mek);
    }

  } catch (error) {
    console.error("Error shortening URL:", error);
    reply(`❌ An error occurred: ${error.message}`);
  }
});

// ---------------------
// Helper Functions
// ---------------------

// Validate if a URL starts with http:// or https://
function isValidUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}

// Check if a custom alias is available and return the shortened URL
async function handleCustomAlias(alias, longUrl, reply) {
  try {
    const aliasCheckUrl = `https://tinyurl.com/${alias}`;

    // Check if alias is already taken
    const aliasCheckResponse = await axios.head(aliasCheckUrl);
    if (aliasCheckResponse.status === 200) {
      return reply(`❌ The alias '${alias}' is already taken. Please choose another alias.`);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Alias is available, create the custom URL
      return `https://tinyurl.com/${alias}`;
    } else {
      throw new Error('Error checking alias availability');
    }
  }
  return null; // Return null if alias check fails
}

// Shorten a URL using TinyURL API
async function shortenUrl(longUrl) {
  const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
  return response.data;
}

// Send the URL shortening result with an image
async function replyWithUrl(conn, from, longUrl, shortUrl, mek) {
  const caption = `
*𝙿𝙴𝙰𝙺𝚈-𝙱𝙻𝙸𝙽𝙳𝙴𝚁-𝙼𝙳 ᴜʀʟ sʜᴏʀᴛᴇɴᴇʀ*
  
🔎*ᴏʀɪɢɪɴᴀʟ ʟɪɴᴋ:* ${longUrl}

🔍*sʜᴏʀᴛᴇɴᴇᴅ ʟɪɴᴋ:* ${shortUrl}

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙿𝙴𝙰𝙺𝚈-𝙱𝙻𝙸𝙽𝙳𝙴𝚁-𝙼𝙳`;

  await conn.sendMessage(from, {
    image: { url: `https://files.catbox.moe/2857dd.jpg` }, // Image URL
    caption: caption,
    contextInfo: {
      mentionedJid: [mek.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363403627964616@newsletter',
        newsletterName: '『 PEAKY-BLINDER-MD 』',
        serverMessageId: 143
      }
    }
  }, { quoted: mek });
}
