const { MessageButton, MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons');
const Discord = require('discord.js')
const settings = require('../configs/settings.json')
const config = require('../configs/config')
const Register = require('../models/Register')

module.exports = {
    help: { name: "isim", aliases: ["isim-değiştir"], private: false },
    execute: async (client, message, args) => {

        if(await client.permission(message.author.id, "register")) {

            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if(!member || member.id === message.author.id || member.user.bot) return client.send("Geçerli bir kullanıcı belirtin.", message.author, message.channel)

            if(!member.manageable || member.roles.highest.position >= message.guild.roles.cache.get(settings.minRole).position) return client.send("Kullanıcı yönetilemiyor/yetkili olduğu için işlem yapamıyorum.", message.author, message.channel)
            //if(member.roles.cache.has(settings.unregisterRole)) return client.send("Kullanıcıyı `.kayıt` komutu ile kayıt edin.", message.author, message.channel) buranın // kısmını sakın çıkarma.
            
            let Name = args.slice(1).filter(arg => isNaN(arg)).map(arg => arg[0].toUpperCase() + arg.slice(1).toLowerCase()).join(" ");
            let Age = args.slice(1).filter(arg => !isNaN(arg))[0] ?? undefined;
    
            if(!Name) return client.send("Geçerli bir isim belirtin.", message.author, message.channel)
            if(!Age || isNaN(Age)) return client.send("Geçerli bir yaş belirtin.", message.author, message.channel)
            if(Name.length > 30) return client.send(`Hata! \`${Name}\` ismi 30 karakterden oluşturulabilir, karakter sınırını geçmeyiniz.`, message.author, message.channel)
            if(Age > 99) return client.send("Yaş iki basamağın üzerine çıkamaz.", message.author, message.channel)
    
            const newDisplayName = `${member.user.username.includes(config.Tag) ? config.Tag : config.SecondaryTag} ${Name} | ${Age}`;

            let data = await Register.findOne({ guild: message.guild.id, user: member.id })

            if(!data) {
                let arr = []
                arr.push({ displayName: newDisplayName, admin: message.author.id, gender: `İsim değişikliği`, date: Date.now() })
                new Register({ guild: message.guild.id, user: member.id, names: arr }).save()
            } else {
                data.names.push({ displayName: newDisplayName, admin: message.author.id, gender: `İsim değişikliği`, date: Date.now() })
                data.save();
            }

            await member.setNickname(`${newDisplayName}`)

            let embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setDescription(`${member} üyenin ismi \`${newDisplayName}\` olarak güncellendi.`)
            .setColor('RANDOM')
            .setFooter(config.Footer)
            message.channel.send(embed)


        } else { return 201; }
    }
}