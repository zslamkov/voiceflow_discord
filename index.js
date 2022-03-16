const Discord = require('discord.js');
const axios = require('axios');

const discordClient = new Discord.Client();

const START_COMMAND = "!start"
let isRunning = false;

require('dotenv').config();

const versionID = process.env.VERSION_ID;
const apiKey = process.env.VF_API_KEY;


discordClient.on('message', async (message) => {
    if (message.author.bot) 
        return;
    


    if (message.content !== START_COMMAND && ! isRunning) 
        return;
    


    const userID = message.author.username;

    async function interact(userID, request) {
        console.log(request);
        const response = await axios({
            method: "POST",
            url: `https://general-runtime.voiceflow.com/state/${versionID}/user/${userID}/interact`,
            headers: {
                Authorization: apiKey
            },
            data: {
                request
            }
        });
        console.log();
        for (const trace of response.data) {
            switch (trace.type) {
                case "text":
                case "speak":
                    {
                        message.channel.send(trace.payload.message);
                        break;
                    }
                case "end":
                    {
                        return false;
                    }
            }
        }
        return true;
    }

    isRunning = message.content === START_COMMAND ? await interact(userID, {type: "launch"}) : await interact(userID, {
        type: "text",
        payload: message.content
    })
    console.log(isRunning);
    if (! isRunning) {
        message.channel.send("Try again by saying the starter command");
    }

})

discordClient.login(process.env.BOT_TOKEN)
