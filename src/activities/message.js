const client = global.client
const config = require('../configs/config')
const ms = require('ms')

module.exports = async(message) => {

    if(message.author.bot || !message.guild) return;
    const prefix = config.Prefixs.filter(x => message.content.startsWith(x))[0];
    if(!prefix) return;
    let command = message.content.split(" ")[0].slice(prefix.length);
    let args = message.content.split(" ").slice(1);
    const cmd = client.commands.get(command) || client.commands.array().find((x) => x.help.aliases && x.help.aliases.includes(command));
    if(!cmd || (cmd.help.private === true && message.author.id !== config.OwnerID) || cmd.help.off) return
    cmd.execute(client, message, args)

}

module.exports.configurator = { name: "message" }