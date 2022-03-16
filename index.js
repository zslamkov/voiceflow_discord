const Discord = require('discord.js');
const axios = require('axios');

const discordClient = new Discord.Client();

const START_COMMAND = "!start"
let isRunning = false;

const versionID = "61ef4e83e2474a000616e171";
const apiKey = "VF.DM.61fc8bc91da27f001cd4c523.NiMbViG7rfsWv1Ag";


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

discordClient.login("OTMzNzMwNzQ2MjE1MDU1NDAw.YelyhQ.yckA1uU0KY2HdZRw2OhIRpTVHjY")
