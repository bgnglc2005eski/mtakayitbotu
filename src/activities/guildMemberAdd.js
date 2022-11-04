const Discord = require('discord.js')
const client = global.client
const settings = require('../configs/settings.json')
const moment = require('moment');const config = require('../configs/config');
 require('moment-duration-format')

module.exports = async(member) => { 

    let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;

    if(isMemberFake) {
        await member.roles.set(settings.suspect)
    } else {
        client.channels.cache.get(settings.welcomeLog).send(`:tada: Selam ${member}! Aramıza hoş geldin.\n\nHesabın **${moment(member.user.createdTimestamp).format("LLL")}** tarihinde (${moment(member.user.createdTimestamp).fromNow()}) oluşturulmuş.\nSunucumuzun kurallarını <#${settings.rulesChannel}> kanalından okuyabilirsiniz. Ceza-i işlemler kuralları okuduğunu varsayarak gerçekleştirilecek\nSol tarafta bulunan odalarda ses teyit vererek kayıt olabilirsin.\n\nSunucumuzun tagını alarak (\`${config.Tag}\`) ailemizin bir parçası olabilirsin. Sunucumuz seninle beraber **${member.guild.members.cache.size}** kişi ulaştı.`)
        if(member.user.username.includes(config.Tag)) {            
            await member.setNickname(`${config.Tag} İsim | Yaş`)
            await member.roles.add(settings.familyRole)
            setTimeout(async () => { await member.roles.add(settings.unregisterRoles) }, 1500);
        } else {
            await member.setNickname(`${config.SecondaryTag} İsim | Yaş`)
            setTimeout(async () => { await member.roles.add(settings.unregisterRoles) }, 1500);
        }
    }
}

module.exports.configurator = { name: "guildMemberAdd" }