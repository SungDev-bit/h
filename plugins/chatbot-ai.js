const axios = require('axios');
const { lee, commands } = require('../lee');
const config = require("../settings");
const { setConfig, getConfig } = require("../lib/configdb");

// Default AI state if not set
let AI_ENABLED = "false"; // Default enabled

lee({
    pattern: "aichat",
    alias: ["chatbot", "leebot"],
    desc: "Enable or disable AI chatbot responses",
    category: "settings",
    filename: __filename,
    react: "✅"
}, async (conn, mek, m, { from, args, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 Only the owner can use this command!*");

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        AI_ENABLED = "true";
        await setConfig("AI_ENABLED", "true");
        return reply("🤖 AI chatbot is now enabled");
    } else if (status === "off") {
        AI_ENABLED = "false";
        await setConfig("AI_ENABLED", "false");
        return reply("🤖 AI chatbot is now disabled");
    } else {
        return reply(`Current AI state: ${AI_ENABLED === "true" ? "ON" : "OFF"}\nUsage: ${prefix}aichat on/off`);
    }
});

// Initialize AI state on startup
(async () => {
    const savedState = await getConfig("AI_ENABLED");
    if (savedState) AI_ENABLED = savedState;
})();

// AI Chatbot 
lee({
    on: "body"
}, async (conn, m, store, {
    from,
    body,
    sender,
    isGroup,
    isBotAdmins,
    isAdmins,
    reply
}) => {
    try {
        // Check if AI is disabled
        if (AI_ENABLED !== "true") return;

        // Optional: Prevent bot responding to its own messages or commands
        if (!body || m.key.fromMe || body.startsWith(config.PREFIX)) return;

        // Encode message for the query
        const query = encodeURIComponent(body);
        const prompt = encodeURIComponent("you are Peaky blinder md whatsapp bot made by Sang Lee. a tech genius in Kenya. act smart and enigmatic about personal stuff about him. He is 19 years (2025).Every mesaage you reply put footer \n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙎𝙖𝙣𝙜 𝙇𝙚𝙚🤖");

        // BK9 API Request
        const apiUrl = `https://bk9.fun/ai/BK93?BK9=${prompt}&q=${query}`;

        const { data } = await axios.get(apiUrl);

        if (data && data.status && data.BK9) {
            await conn.sendMessage(from, {
                text: data.BK9
            }, { quoted: m });
        } else {
            reply("⚠️ Sang Lee AI failed to generate a response.");
        }

    } catch (err) {
        console.error("AI Chatbot Error:", err.message);
        reply("❌ An error occurred while contacting the AI.");
    }
});


