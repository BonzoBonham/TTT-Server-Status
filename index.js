const { prefie, token, gamedigConfig } = require("./botconfig.json");
const Discord = require("discord.js");
const Gamedig = require('gamedig');
const bot = new Discord.Client({disableEveryone: true});

//Message codes for the bot functions
const MESSAGE_CODES = {
    "PLAYERS": "players",
    "INVITE": "invite",
    "BOT_INFO": "botinfo"
  };

//queries the current state of the server
const handleGamedigQuery = () => Gamedig.query(gamedigConfig).catch((error) => { console.log("Server is offline") });

//Function called every 30000 ms to update the "game" played by the bot
function activityupdate(){
    handleGamedigQuery().then((state) => {
        var status = state.players.length + " in " + state.map;
        bot.user.setActivity(status, { type: 'PLAYING' })
        console.log("Bot activity status updated!")
    });
};

//Function called every 30000 ms to update the title of the voice channel with the server status
function voicechannelupdate(){
    //Server status query
    handleGamedigQuery().then((state) => {
        var status = state.players.length + " in " + state.map;        statuschannel = bot.channels.get("573022265416089603");
        statuschannel.setName(status);
        console.log("Channel status updated!")
    });
};

//Function called every 30000ms to update the playerlist in the player list channel
function textchannelupdate(){
    //Server status query
    handleGamedigQuery().then((state) => {
        var i = 0;
        playerlist = "";
        playerArray = state.players;
        console.log("getting players...")
        if (playerArray.length == 0) {
            playerlist = "The server is empty right now!";
        }       
        while (i < playerArray.length) {
            playerlist = playerlist + playerArray[i].name + ", ";
            i++;
        }
        statuschannel = bot.channels.get("573022289931796511");
        console.log("Text channel status updated!")

        //Edits last message 
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
        

    });
}

//Sets the "game" being played by the bot every 30 seconds
bot.on("ready", async message => {
    console.log(`${bot.user.username} is online!`);
    console.log("I am ready!");
    bot.setInterval(activityupdate,30000);
    bot.setInterval(voicechannelupdate,30000);
    statuschat = bot.channels.get("573022289931796511");
     statuschat.send(`***Click this link to open up Garry's Mod and connect to the server!***
`);
    statuschat.send(`steam://connect/66.151.244.2:27015`);
    statuschat.send("--------------------------**ONLINE PLAYERS**--------------------------");
    statuschat.send("Initializing...");
    bot.setInterval(textchannelupdate,30000);
});

//List of commands that can be called to the bot
bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = prefie;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (cmd === `${prefix}botinfo`){
        message.channel.send("I was made by Bonzo, for the DMG Discord server!");
    }

    //bot command that returns amount of online players and map being played
    if (cmd === `${prefix}invite`){
        Gamedig.query({
            type: 'garrysmod',
            host: '66.151.244.2'
        }).then((state) => {
            console.log(state);
            message.channel.send(`The server has ${state.players.length} players on, and is on the map ${state.map} right now. Come join us! steam://connect/66.151.244.2:27015`);
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


bot.login(token);