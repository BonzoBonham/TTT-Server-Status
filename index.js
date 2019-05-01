const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const Gamedig = require('gamedig');
const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async() => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("BOT Opie is gay");
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (cmd === `${prefix}bonzo`){
        //hello world command

        message.channel.send("hi, bonzo made me");

        let chan = bot.channels.get("566030799573483524");
        let lastMessage;

        chan.fetchMessages({ limit: 1 }).then(messages => {
            lastMessage = messages.first();
            console.log("fetchin messages...")
            if (!lastMessage.author.bot) {
              console.log("last message's author is not a bot!")
            }
        })
        .catch(console.error);
        
        setTimeout(function(){ 
            lastMessage.edit('i say this now')
            .then(msg => console.log(`New message content: ${msg}`))
            .catch(console.error);
        }, 3000);
        return;
    }

    if (cmd === `${prefix}info`){
        //test richembed command
        let botembed = new Discord.RichEmbed()
        .setDescription("Bonzo gang")
        .setColor("#00ff00")
        .addField("Bot Name", bot.user.username);

        return message.channel.send(botembed);
    }

    if (cmd === `${prefix}dmg`){
        let dmgstatus = new Discord.RichEmbed()
        .setTitle("This is the title")
        .setDescription("This is the description aaaaaaaaaaaaaaaaaaaaaaaah");

        return message.channel.send(dmgstatus);
    }

    if (cmd === `${prefix}updatebonzo`){
       // message.delete().catch(O_o=>{});
        message.edit('i say this now')
        .then(msg => console.log(`New message content: ${msg}`))
        .catch(console.error);
    }

    if (cmd === `${prefix}stat`){
        Gamedig.query({
            type: 'garrysmod',
            host: '66.151.244.2'
        }).then((state) => {
            console.log(state);
            message.channel.send(`The server has ${state.players.length} players on right now.`);
            message.channel.send(`The server is on the map ${state.map} right now.`)
        }).catch((error) => {
            console.log("Server is offline");
        });
     }

});

bot.login(botconfig.token);