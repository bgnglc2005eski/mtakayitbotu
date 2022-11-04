const { MessageButton, MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons');
const Discord = require('discord.js')
const settings = require('../configs/settings.json')
const config = require('../configs/config')
const Register = require('../models/StaffRegister')

module.exports = {
    help: { name: "topteyit", aliases: ["topregister"], private: false },
    execute: async (client, message, args) => {

        if(await client.permission(message.author.id, "register")) {

            let data = await Register.find().sort({ total: "descending" });

            let text = `:tada: Top 15 Teyit Listesi :tada:\n\n${data.length ? data.map((d, index) => `\`${index+1}.\` <@${d.user}> | Toplam \`${d.total}\` kayıt.`).splice(0, 15).join("\n") : "Liste Bulunamadı!"}`

            let embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setDescription(`${text}`)
            .setColor('BLACK')
            .setFooter(config.Footer)
            message.channel.send(embed)

        } else { return 201; }
    }
}