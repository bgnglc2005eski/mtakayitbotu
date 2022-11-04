const Discord = require('discord.js')
const client = global.client = new Discord.Client({ fetchAllMembers: true })
require('discord-buttons')(client);
require('discord-reply');

const config = require('./src/configs/config')
const mongoose = require('mongoose');
const fs = require('fs');
const pms = require("pretty-ms");

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.logger = require('./src/handlers/terminalLogger');
client.wait = require("util").promisify(setTimeout);

try {

    fs.readdir('./src/cmds/', (err, files) => {
        if (err) client.logger.log(err, "error");
        files.forEach(f => {
            let props = require(`./src/cmds/${f}`);
            client.logger.log(`${props.help.name} loaded command. ✔`, "loaded");
            client.commands.set(props.help.name, props);
            props.help.aliases.forEach(alias => { client.aliases.set(alias, props.help.name) });
        });
    });

    fs.readdir("./src/activities/", (err, files) => {
        if (err) client.logger.log(err, "error");
        files.filter(file => file.endsWith(".js")).forEach(file => {
            let prop = require(`./src/activities/${file}`);
            if(!prop.configurator) return;
            client.on(prop.configurator.name, prop);
            client.logger.log(`${prop.configurator.name} loaded activity. ✔`, "loaded");
        });
    });
    

} catch {
    client.logger.log("Try Failed! ✘", "error")
}

client.long = function async(content, msg, channel) {
    if (!content || typeof content !== "string") return
    const embd = new Discord.MessageEmbed().setAuthor(msg.tag, msg.displayAvatarURL({ dynamic: true })).setColor("RANDOM").setDescription(content)
    channel.send(embd).then(msg => {msg.delete({ timeout: 15000 }).catch(err => {{}})}).catch(err => {{}});}


client.send = function async(content, msg, channel) {
    if (!content || typeof content !== "string") return
    const embd = new Discord.MessageEmbed().setAuthor(msg.tag, msg.displayAvatarURL({ dynamic: true })).setColor("RANDOM").setDescription(content)
    channel.send(embd).then(msg => {msg.delete({ timeout: 7500 }).catch(err => {{}})}).catch(err => {{}});}

client.shuffle = function async(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        } 
        return array 
    }

client.turkishDate = function async(date) {
        if (!date || typeof date !== "number") return
        let convert = pms(date, { verbose: true })
          .replace("minutes", "dakika")
          .replace("minute", "dakika")
          .replace("hours", "saat")
          .replace("hour", "saat")
          .replace("seconds", "saniye")
          .replace("second", "saniye")
          .replace("days", "gün")
          .replace("day", "gün")
          .replace("years", "yıl")
          .replace("year", "yıl");
        return convert
      }

client.permission = async function (userID, type) {

  let member = client.guilds.cache.get(config.GuildID).members.cache.get(userID);
  
  const x = {
    Owner: [],
    Founder: [],
    Ceo: [],
    Register: [],
  }

  let staffPerms = member.hasPermission('ADMINISTRATOR') || member.roles.cache.some(rol => x.Owner.includes(rol.id)) || 
  member.roles.cache.some(rol => x.Founder.includes(rol.id)) || config.Owners.includes(member.id) || member.id == config.OwnerID;

  let staffRole;

  if (type == "register") { staffRole = x.Register.some(x => member.roles.cache.has(x)) || staffPerms; };

  return staffRole;

};

require('./src/handlers/mongooseConnecter')
client.login(config.Token).then(() => client.logger.log("Client Successfully Launched. ✔", "ready")).catch(() => client.logger.log("Client Connection Failed. ✘", "error"))