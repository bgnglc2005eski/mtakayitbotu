const Discord = require('discord.js')
const config = require('../configs/config')
const Register = require('../models/Register')
const moment = require('moment'); require('moment-duration-format')
const { MessageButton, MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons');

module.exports = { help: { name: "isimler", aliases: ["names"], private: false },

    execute: async (client, message, args) => {

        if(client.permission(message.author.id, "register")) {

            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if(!member || member.id === message.author.id || member.user.bot) return client.send("Geçerli bir kullanıcı belirtin.", message.author, message.channel)

            
            let data = await Register.findOne({ guild: message.guild.id, user: member.id })

            if(!data) {

                return client.send(`Kullanıcının veritabanında hiç bir kayıt işlemi bulunamadı. ${client.emojis.cache.find(x => x.name === "axze_iptal")}`, message.author, message.channel)

            } else {

            const Kayıtları = new MessageButton()
            .setStyle("green") 
            .setLabel('İsimleri')
            .setID('names'); 
            const KayıtEdenler = new MessageButton()
            .setStyle("green")
            .setLabel('Kayıt Eden Kişiler')
            .setID('registerStaffs')

            const row = new MessageActionRow().addComponents(Kayıtları, KayıtEdenler)

            let embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setDescription(`Kullanıcının isimlerini ve kimler tarafından hangi tarihte kayıt edildiğini öğrenmek için buttonları kullanabilirsin.`)
            .setColor('RANDOM')
            .setFooter(config.Footer)

            let ButtonMessage = await message.channel.send({embed: embed, components: [row]}) 

            const Filter = (button) => button.clicker.user.id === message.author.id;
            const Collector = ButtonMessage.createButtonCollector(Filter, { time: 150000 });

            Collector.on("collect", async (button) => {
                button.reply.defer(); ButtonMessage.delete();

                if(button.id === "names") {

                    let embed1 = new Discord.MessageEmbed()
                    .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
                    .setDescription(`Kullanıcının **${data.names.length}** tane ismi veritabanında kayıtlı, dökümanlar aşağıya listelendi. ${client.emojis.cache.find(x => x.name === "axze_iptal")}\n\n${data.names.map(x => `\`• ${x.displayName}\` (${x.gender}) `).join('\n')}`)
                    .setColor('RANDOM')
                    .setFooter(config.Footer)
                    message.channel.send(embed1)

                }

                if(button.id === "registerStaffs") {

                    let embed2 = new Discord.MessageEmbed()
                    .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
                    .setDescription(`Kullanıcının **${data.names.length}** tane ismi veritabanında kayıtlı, dökümanlar aşağıya listelendi. ${client.emojis.cache.find(x => x.name === "axze_iptal")}\n\n${data.names.map(x => `\`• ${x.displayName}\` (${x.gender}) | \`${message.guild.members.cache.get(x.admin).displayName}\` - **${moment(+x.date).format('LLL')}**`).join('\n')}`)
                    .setColor('RANDOM')
                    .setFooter(config.Footer)
                    message.channel.send(embed2)


                }


            })

            }




        } else { return 201;}


    }
}