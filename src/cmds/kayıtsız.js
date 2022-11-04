const Discord = require('discord.js')
const config = require('../configs/config')
const settings = require('../configs/settings.json')

module.exports = { help: { name: "kayıtsız", aliases: ["unregister", "unreg"] }, 
    execute: async (client, message, args) => {

        if(await client.permission(message.author.id, "register")) {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!member || member.id === message.author.id || member.user.bot) return client.send("Geçerli bir kullanıcı belirtin.", message.author, message.channel)

        if(!member.manageable || member.roles.highest.position >= message.guild.roles.cache.get(settings.minRole).position) return client.send("Kullanıcı yönetilemiyor/yetkili olduğu için işlem yapamıyorum.", message.author, message.channel)
        if(member.roles.cache.has(settings.unregisterRole)) return client.send("Kullanıcının üzerinde `kayıtsız` rolü zaten var, kullanıcıy kayıtsıza atamazsınız.", message.author, message.channel)
        

        if(member.user.username.includes(config.Tag)) {
            await member.setNickname(`${config.Tag} İsim | Yaş`)
           await member.roles.set(settings.unregisterRoles)
           await member.roles.add(settings.familyRole) 
        } else {
            await member.setNickname(`${config.SecondaryTag} İsim | Yaş`)
            await member.roles.set(settings.unregisterRoles) 
        }

        let embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setDescription(`**${member.user.tag}** üyesi ${message.author} tarafından tüm rolleri alınarak kayıtsıza atıldı.`)
        .setColor('RANDOM')
        .setTimestamp()
        message.channel.send(embed)

    } else { return 201; }

    }
}