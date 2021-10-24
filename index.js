var config = require('./config.json');
var Discord = require('discord.js');
const api = require('covidapi')
var client = new Discord.Client();

client.on('ready', async() => {

    var general = client.channels.cache.find(channel => channel.id === '831590799984689215');

    console.log('E');

    setInterval(() => {
        general.send("!covid all");
    }, "10000")

})

client.on('message', async(msg) => {
    if(msg.author.bot) return;
    if(!msg.guild) return;

    var array = ['!covid all'];
    if(!msg.member.hasPermission('ADMINISTRATOR')){
        if(array.some(w => ` ${msg.content.toLowerCase()} `.includes(` ${w} `))){
            msg.delete();
        }
    }
})

client.on('message', async(msg) => {
    if(msg.author.bot) return;
    if(!msg.guild) return;

    var prefix = config.prefix;
    if(!msg.content.toLowerCase().startsWith(prefix)) return;

    var args = msg.content.split(' ');
    var cmd = args.shift().slice(prefix.length).toLowerCase();

    try {
        var file = require(`./commands/${cmd}.js`);
        file.run(client, msg, args);
    } catch(err) {
        console.warn(err);
    }
});

client.on('message', async message => {
    if (message.content === '!covid all') {
        const data = await api.all()
        const coronaembed = new Discord.MessageEmbed()
        .setColor("#1ABC9C")
        .setTitle("Global Cases")
        .setDescription("Number of cases may differ from other sources")
        .addField("cases", data.cases, true)
        .addField("Active", data.active, true)
        .addField("Cases Today", data.todayCases, true)
        .addField("Critical Cases", data.critical, true)
        .addField("Deaths", data.deaths, true)
        .addField("Recovered", data.recovered, true)
        message.channel.send(coronaembed)
    }
})


client.login(config.token)