const { MessageButton, MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons');
const Discord = require('discord.js')
const settings = require('../configs/settings.json')
const config = require('../configs/config')
const Register = require('../models/Register')
const Staff = require('../models/StaffRegister');
const StaffRegister = require('../models/StaffRegister');

module.exports = {
    help: { name: "rolsüzver", aliases: ["rolsüz"], private: false },
    execute: async (client, message, args) => {

        if(!message.member.hasPermission("MANAGE_ROLES")) return 201;

        let rolsuz = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)
        rolsuz.forEach(async(x) => { x.roles.set(settings.unregisterRoles) })
        client.long("Toplamda **"+rolsuz.size+"** kişi rolsüzdü ve Unregister rolü verildi!", message.author, message.channel)

    }
}