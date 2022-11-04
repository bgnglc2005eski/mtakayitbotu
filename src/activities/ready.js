const Discord = require('discord.js')
const client = global.client
const config = require('../configs/config')

module.exports = async () => {
    await client.wait(1000);
    client.user.setPresence({activity: { name: config.Message }, status: config.Status })
    if(config.VoiceID && client.channels.cache.get(config.VoiceID)) client.channels.cache.get(config.VoiceID).join().catch()
} 

module.exports.configurator = { name: "ready" }