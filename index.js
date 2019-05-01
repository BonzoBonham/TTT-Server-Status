const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const Gamedig = require('gamedig');
const bot = new Discord.Client({disableEveryone: true});

//Function called every 30000 ms to update the "game" played by the bot
function update(){

    //Server status query
    Gamedig.query({
        type: 'garrysmod',
        host: '66.151.244.2'
    }).then((state) => {
        var status = state.players.length + " of " + state.maxplayers + " in map " + state.map;
        bot.user.setActivity(status, { type: 'PLAYING' })
        console.log("Status updated!")
    }).catch((error) => {
        console.log("Server is offline");
    });
};

//Function called every 30000 ms to update the title of the voice channel with the server status
function voicechannelupdate(){

    //Server status query
    Gamedig.query({
        type: 'garrysmod',
        host: '66.151.244.2'
    }).then((state) => {
        var status = state.players.length + " of " + state.maxplayers + " in map " + state.map;
        statuschannel = bot.channels.get("573005197270319107");
        statuschannel.setName(status);
        console.log("Status updated!")
    }).catch((error) => {
        console.log("Server is offline");
    });
};

function textchannelupdate(){
    //Server status query
    Gamedig.query({
        type: 'garrysmod',
        host: '66.151.244.2'
    }).then((state) => {
        var i = 0;
        playerlist = ""
        playerArray = state.players;
        console.log("getting players...")
        while (i < playerArray.length) {
            playerlist = playerlist + playerArray[i].name + ", ";
            i++;
        }
        console.log(playerlist);
        statuschannel = bot.channels.get("573008157585047554");
        console.log("Status updated!")

        statuschannel.fetchMessages({ limit: 1 }).then(messages => {
            lastMessage = messages.first();
            console.log("fetchin messages...")
            if (!lastMessage.author.bot) {
              console.log("last message's author is not a bot!")
            }
        }).catch(console.error);
        
        lastMessage.edit(`${playerlist}`)
        .then(msg => console.log(`New message content: ${msg}`))
        .catch(console.error);
        

    }).catch((error) => {
        console.log("Server is offline");
    });
}

//Sets the "game" being played by the bot every 30 seconds
bot.on("ready", async message => {
    console.log(`${bot.user.username} is online!`);
    console.log("I am ready!");
    bot.setInterval(update,30000);
    bot.setInterval(voicechannelupdate,30000);
    statuschat = bot.channels.get("573008157585047554");
    statuschat.send("steam://connect/66.151.244.2:27015");
    statuschat.send("Initializing...");
    bot.setInterval(textchannelupdate,3000);
});

//List of commands that can be called to the bot
bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    /*if (cmd === `${prefix}bonzo`){
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
    }*/

    /*
    if (cmd === `${prefix}info`){
        //test richembed command
        let botembed = new Discord.RichEmbed()
        .setDescription("Bonzo gang")
        .setColor("#00ff00")
        .addField("Bot Name", bot.user.username);

        return message.channel.send(botembed);
    }*/

    /*
    if (cmd === `${prefix}dmg`){
        let dmgstatus = new Discord.RichEmbed()
        .setTitle("This is the title")
        .setDescription("This is the description aaaaaaaaaaaaaaaaaaaaaaaah");

        return message.channel.send(dmgstatus);
    }*/

    /*
    if (cmd === `${prefix}updatebonzo`){
       // message.delete().catch(O_o=>{});
        message.edit('i say this now')
        .then(msg => console.log(`New message content: ${msg}`))
        .catch(console.error);
    }*/

    //bot command that returns amount of online players and map being played
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

    //bot command that returns the names of every online player
    if (cmd === `${prefix}players`){
        Gamedig.query({
            type: 'garrysmod',
            host: '66.151.244.2'
        }).then((state) => {
            console.log(state);
            var i = 0;
            var playerlist = "";
            console.log(playerlist)
            playerArray = state.players;
            console.log(playerArray);
            while (i < playerArray.length) {
                console.log("ahhhhhhhhhhhhhhhhhhhhhhh");
                console.log(playerArray[i]);
                playerlist = playerlist + playerArray[i].name + ", ";
                i++;
            }
            message.author.send (playerlist);
            message.channel.send ("Check your DM's for a list of online players!");  
        }).catch((error) => {
            console.log("Server is offline");
        });
    }

});

bot.login(botconfig.token);