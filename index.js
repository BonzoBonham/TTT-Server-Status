const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
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
        return message.channel.send("hi, bonzo made me")
    }

    if (cmd === `${prefix}info`){
        //test richembed command
        let botembed = new Discord.RichEmbed()
        .setDescription("Bonzo gang")
        .setColor("#00ff00")
        .addField("Bot Name", bot.user.username);

        return message.channel.send(botembed);
    }
});

bot.login(botconfig.token);