const { MessageButton, MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons');
const Discord = require('discord.js')
const settings = require('../configs/settings.json')
const config = require('../configs/config')
const Register = require('../models/StaffRegister')
const moment = require('moment'); require('moment-duration-format')

module.exports = {
    help: { name: "kayıtlarım", aliases: ["kayıtlar", "teyitler", "teyitlerim"], private: false },
    execute: async (client, message, args) => {

        if(await client.permission(message.author.id, "register")) {

            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
            let data = await Register.findOne({ guild: message.guild.id, user: member.id })
            let embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setDescription(`${member} yetkilisinin \`${moment(Date.now()).format('LLL')}\` tarihinden beri güncel kayıtları.\n\n\`•\` Toplam Kayıtlar: **${data ? data.total : 0}**\n\`•\` Toplam Erkek: **${data ? data.man : 0}**\n\`•\` Toplam Kadın: **${data ? data.woman : 0}**`)
            .setColor('BLACK')
            message.channel.send(embed)
        } else { return 201; }
    }
}