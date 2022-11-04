const { MessageButton, MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons');
const Discord = require('discord.js')
const settings = require('../configs/settings.json')
const config = require('../configs/config')
const Register = require('../models/Register')
const Staff = require('../models/StaffRegister');
const StaffRegister = require('../models/StaffRegister');

module.exports = {
    help: { name: "kayıt", aliases: ["register", "e", "k", "kadın", "erkek", "man", "woman"], private: false },
    execute: async (client, message, args) => {

        if(await client.permission(message.author.id, "register")) {

            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if(!member || member.id === message.author.id || member.user.bot) return client.send("Geçerli bir kullanıcı belirtin.", message.author, message.channel)

            if(!member.manageable || member.roles.highest.position >= message.guild.roles.cache.get(settings.minRole).position) return client.send("Kullanıcı yönetilemiyor/yetkili olduğu için işlem yapamıyorum.", message.author, message.channel)
            if(!member.roles.cache.has(settings.unregisterRole)) return client.send("Kullanıcının üzerinde `kayıtsız` rolü bulunmadığı için işlem yapılamıyor.", message.author, message.channel)
            
            let Name = args.slice(1).filter(arg => isNaN(arg)).map(arg => arg[0].toUpperCase() + arg.slice(1).toLowerCase()).join(" ");
            let Age = args.slice(1).filter(arg => !isNaN(arg))[0] ?? undefined;
    
            if(!Name) return client.send("Geçerli bir isim belirtin.", message.author, message.channel)
            if(!Age || isNaN(Age)) return client.send("Geçerli bir yaş belirtin.", message.author, message.channel)
            if(Name.length > 30) return client.send(`Hata! \`${Name}\` ismi 30 karakterden oluşturulabilir, karakter sınırını geçmeyiniz.`, message.author, message.channel)
            if(Age > 99) return client.send("Yaş iki basamağın üzerine çıkamaz.", message.author, message.channel)
    
            if(settings.taglıAlım === true && !member.user.username.includes(config.Tag) && !member.premiumSince && !member.roles.cache.has(settings.vipRole) && !message.member.hasPermission('ADMINISTRATOR')) return client.send(`${member} üyesi isminde tagımızı taşımıyor, tagımızı alarak sunucumuza kayıt olabilir.`, message.author, message.channel)
            if(Age < settings.yaşLimit && Age === settings.yaşLimit && !message.member.hasPermission('ADMINISTRATOR')) return client.send("Üye\`"+settings.yaşLimit+"\` yaşından küçük veya yaşındaysa kayıt işlemi yapılamaz.", message.author, message.channel)

            const newDisplayName = `${member.user.username.includes(config.Tag) ? config.Tag : config.SecondaryTag} ${Name} | ${Age}`;

            const ErkekButton = new MessageButton()
            .setStyle("green") 
            .setLabel('Erkek')
            .setID('manButton'); 
            const KadınButton = new MessageButton()
            .setStyle("green")
            .setLabel('Kadın')
            .setID('womanButton')
            
            const row = new MessageActionRow().addComponents(ErkekButton, KadınButton)
            let data = await Register.findOne({ guild: message.guild.id, user: member.id })

            if(!data) {

                let embed1 = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
                .setDescription(`${member} üyesinin kayıt işlemini bitirmek için aşağıda bulunan butonlardan cinsiyetini belirtiniz.\n\n${client.emojis.cache.find(x => x.name === "axze_onay")} Kullanıcının farklı isimleri bulunamadı. **[\`0\`]**`)
                .setColor('RANDOM')
                .setFooter(config.Footer)

                let messageSend1 = await message.channel.send({embed: embed1, components: [row]})

                const noDataFilter = (button) => button.clicker.user.id === message.author.id;
                const noDataCollector = messageSend1.createButtonCollector(noDataFilter, { time: 150000 });


                noDataCollector.on("collect", async (button) => {
                    button.reply.defer(); messageSend1.delete();

                    if(button.id === "manButton") {

                        await member.setNickname(`${newDisplayName}`)
                        await member.roles.remove(settings.unregisterRoles)
                        setTimeout(async () => { await member.roles.add(settings.manRoles) }, 1500);
                        client.channels.cache.get(settings.generalChat).send(`${member} aramıza katıldı! tekrardan aramıza hoşgeldin umarım iyi vakit geçirirsin.`).then(x => x.delete({timeout: 15000}))
                        message.react(client.emojis.cache.find(x => x.name === "axze_onay"))
                        
                        let arr = []
                        arr.push({ displayName: newDisplayName, admin: message.author.id, gender: `<@&${settings.manRole}>`, date: Date.now() })
                        new Register({ guild: button.guild.id, user: member.id, names: arr }).save()

                        let erkekEmbed = new Discord.MessageEmbed()
                        .setAuthor(button.guild.name, button.guild.iconURL({dynamic: true}))
                        .setDescription(`${member} üyesine ${settings.manRoles.map(x => `<@&${x}>`)} rolleri verildi ve ismi \`${newDisplayName}\` olarak düzenlendi.`)
                        .setColor('RANDOM')
                        .setFooter(config.Footer)
                        message.channel.send(erkekEmbed)

                        let dataStaff = await StaffRegister.findOne({ guild: button.guild.id, user: message.author.id })
                        if(!dataStaff) {
                        new StaffRegister({ guild: button.guild.id, user: message.author.id, man: 1, woman: 0, total: 1}).save()
                        } else { dataStaff.man++; dataStaff.total++; dataStaff.save();}

                    }
                    if(button.id === "womanButton") {

                        await member.setNickname(`${newDisplayName}`)
                        await member.roles.remove(settings.unregisterRoles)
                        setTimeout(async () => { await member.roles.add(settings.womanRoles) }, 1500);
                        client.channels.cache.get(settings.generalChat).send(`${member} aramıza katıldı! tekrardan aramıza hoşgeldin umarım iyi vakit geçirirsin.`).then(x => x.delete({timeout: 15000}))
                        message.react(client.emojis.cache.find(x => x.name === "axze_onay"))

                        let arr = []
                        arr.push({ displayName: newDisplayName, admin: message.author.id, gender: `<@&${settings.womanRole}>`, date: Date.now() })
                        new Register({ guild: button.guild.id, user: member.id, names: arr }).save()

                        let kadınEmbed = new Discord.MessageEmbed()
                        .setAuthor(button.guild.name, button.guild.iconURL({dynamic: true}))
                        .setDescription(`${member} üyesine ${settings.womanRoles.map(x => `<@&${x}>`)} rolleri verildi ve ismi \`${newDisplayName}\` olarak düzenlendi.`)
                        .setColor('RANDOM')
                        .setFooter(config.Footer)
                        message.channel.send(kadınEmbed)

                        let dataStaff = await StaffRegister.findOne({ guild: button.guild.id, user: message.author.id })
                        if(!dataStaff) {
                        new StaffRegister({ guild: button.guild.id, user: message.author.id, man: 0, woman: 1, total: 1}).save()
                        } else { dataStaff.woman++; dataStaff.total++; dataStaff.save();}

                    }
                })

            } else {

                let embed2 = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
                .setDescription(`${member} üyesinin kayıt işlemini bitirmek için aşağıda bulunan butonlardan cinsiyetini belirtiniz.\n\n${client.emojis.cache.find(x => x.name === "axze_iptal")} Kullanıcının farklı isimleri bulunamadı. **[\`${data.names.length}\`]**\n\n${data.names.map(x => `\`• ${x.displayName}\` (${x.gender}) `).splice(0, 10).join('\n')}\n\nKullanıcının farklı isimlerini görmek için \`!isimler @Üye/ID\` komutunu kullanın.`)
                .setColor('RANDOM')
                .setFooter(config.Footer)

                let messageSend2 = await message.channel.send({embed: embed2, components: [row]})

                const DataFilter = (button) => button.clicker.user.id === message.author.id;
                const DataCollector = messageSend2.createButtonCollector(DataFilter, { time: 150000 });

                DataCollector.on("collect", async (button) => {
                    button.reply.defer(); messageSend2.delete();

                    if(button.id === "manButton") {

                        await member.setNickname(`${newDisplayName}`)
                        await member.roles.remove(settings.unregisterRoles)
                        setTimeout(async () => { await member.roles.add(settings.manRoles) }, 1500);
                        client.channels.cache.get(settings.generalChat).send(`${member} aramıza katıldı! tekrardan aramıza hoşgeldin umarım iyi vakit geçirirsin.`).then(x => x.delete({timeout: 15000}))
                        message.react(client.emojis.cache.find(x => x.name === "axze_onay"))

                        data.names.push({ displayName: newDisplayName, admin: message.author.id, gender: `<@&${settings.manRole}>`, date: Date.now() })
                        data.save();

                        let erkekEmbed = new Discord.MessageEmbed()
                        .setAuthor(button.guild.name, button.guild.iconURL({dynamic: true}))
                        .setDescription(`${member} üyesine ${settings.manRoles.map(x => `<@&${x}>`)} rolleri verildi ve ismi \`${newDisplayName}\` olarak düzenlendi.`)
                        .setColor('RANDOM')
                        .setFooter(config.Footer)
                        message.channel.send(erkekEmbed)

                        let dataStaff = await StaffRegister.findOne({ guild: button.guild.id, user: message.author.id })
                        if(!dataStaff) {
                        new StaffRegister({ guild: button.guild.id, user: message.author.id, man: 1, woman: 0, total: 1}).save()
                        } else { dataStaff.man++; dataStaff.total++; dataStaff.save();}

                    }
                    if(button.id === "womanButton") {

                        await member.setNickname(`${newDisplayName}`)
                        await member.roles.remove(settings.unregisterRoles)
                        setTimeout(async () => { await member.roles.add(settings.womanRoles) }, 1500);
                        client.channels.cache.get(settings.generalChat).send(`${member} aramıza katıldı! tekrardan aramıza hoşgeldin umarım iyi vakit geçirirsin.`).then(x => x.delete({timeout: 15000}))
                        message.react(client.emojis.cache.find(x => x.name === "axze_onay"))

                        data.names.push({ displayName: newDisplayName, admin: message.author.id, gender: `<@&${settings.womanRole}>`, date: Date.now() })
                        data.save();

                        let kadınEmbed = new Discord.MessageEmbed()
                        .setAuthor(button.guild.name, button.guild.iconURL({dynamic: true}))
                        .setDescription(`${member} üyesine ${settings.womanRoles.map(x => `<@&${x}>`)} rolleri verildi ve ismi \`${newDisplayName}\` olarak düzenlendi.`)
                        .setColor('RANDOM')
                        .setFooter(config.Footer)
                        message.channel.send(kadınEmbed)

                        let dataStaff = await StaffRegister.findOne({ guild: button.guild.id, user: message.author.id })
                        if(!dataStaff) {
                        new StaffRegister({ guild: button.guild.id, user: message.author.id, man: 0, woman: 1, total: 1}).save()
                        } else { dataStaff.woman++; dataStaff.total++; dataStaff.save();}

                    }
                })


            }




        } else { return 201; }
    }
}