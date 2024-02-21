
//import libraries
const dotenv = require("dotenv").config();
const phoenix = require("@phoenixlan/phoenix.js");
const amqp = require("amqplib/callback_api");
const {
    UTCDate
} = require("@date-fns/utc");
const {
    addHours,
    subMonths,
    differenceInMilliseconds,
    differenceInHours
} = require("date-fns");
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    Guild
<<<<<<< HEAD
} = require('discord.js');

phoenix.init("https://api.test.phoenixlan.no");
//change this
phoenix.User.Oauth.setAuthState("", "");
const timeBeforeNextEventRemove = 2;


const DISCORD_TOKEN = process.env.BOT_TOKEN;
//change this
=======
} = require("discord.js");
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> bedd543 (Improved promise awaiting)
=======
=======
=======
    EmbedBuilder
} = require('discord.js');
const dotenv = require('dotenv').config();
const phoenix = require('@phoenixlan/phoenix.js');
const amqp = require('amqplib/callback_api');
>>>>>>> 4149b6e (jvneafkjnfakjnf)
>>>>>>> feaea3b (jvneafkjnfakjnf)
=======

const dotenv = require('dotenv').config();
const phoenix = require('@phoenixlan/phoenix.js');
const amqp = require('amqplib/callback_api');
const {
    UTCDate
} = require("@date-fns/utc");
const {
    addHours,
    subMonths,
    differenceInMilliseconds,
    differenceInHours
} = require("date-fns");
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    Guild
} = require('discord.js');

phoenix.init("https://api.test.phoenixlan.no");
phoenix.User.Oauth.setAuthState("eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsInRpY2tldF93aG9sZXNhbGUiLCJjaGllZjo0ZTUxYzdhYS0xYjJmLTQzMzUtOWEzNC1kMDZmYTU0MjcwMDYiLCJtZW1iZXIiLCJ1c2VyOmZlNmRkZjU5LTc3NWQtNDI1Yi1hNjBmLTc5YTU1ZTdiZDE1YyIsImNoaWVmIiwidGlja2V0X2J5cGFzc190aWNrZXRzYWxlX3N0YXJ0X3Jlc3RyaWN0aW9uIl0sImZsYWciOiJQSE9FTklYe0pXVFNfQVJFX0FXRVNPTUV9Iiwic3ViIjoiZmU2ZGRmNTktNzc1ZC00MjViLWE2MGYtNzlhNTVlN2JkMTVjIiwiaWF0IjoxNjk0Nzk4NTQ0LCJleHAiOjE2OTQ4MDIxNDR9.Y1fx1ndk9iDVjEPC9vDt4UZxz7V1ar4sqALxXD_aW0JHojQ6ROFsdbNquIt35MWPCmvbjHGZkWNNcmRfWbdHNQ", "saphamcWOBXgsVaOuiizRsmQvsgiUFSLhBVeluMW");


>>>>>>> 0d3d7a4 (almost finished)

//set time variables
let halfHour = 1800000;
<<<<<<< HEAD
>>>>>>> 8c7539e (Update index.js)
=======
let oneDay = 86400000;
>>>>>>> f820de5 (Update index.js)
//initialise the api
phoenix.init(process.env.INIT_URL);
//change this to token from login in the api
phoenix.User.Oauth.setAuthState(process.env.TOKEN, process.env.REFRESH_TOKEN);
//variable that controls the months before the next event crew roles should be removed
const timeBeforeNextEventRemove = parseInt(process.env.REMOVE_MONTHS);
//change this, guild id to ensure proper guild selection
let phoenixGuildId = process.env.GUILD_ID;
//set the discord token variable with the token from .env file
const DISCORD_TOKEN = process.env.BOT_TOKEN;


//change this to the rabbitmq address and port
amqp.connect(process.env.RABBITMQ_CONNECT_LINK, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        //change this
        let queue = "";


        channel.assertQueue(queue, {
            durable: true,
        });

        channel.consume(queue, async function (msg) {
            console.log(msg.content.toString());
            removeAllRoles();
            updateRoles();
        }, {
            noAck: true,
        });

    });

amqp.connect('amqp://phoenix:testing@127.0.0.1:5672', function (error0, connection) {
    if (error0) {
        throw error0;

    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        let queue = 'position_changes';


        channel.assertQueue(queue, {
            durable: true,
        });

        channel.consume(queue, async function (msg) {
            console.log(msg.content.toString());
            removeAllRoles();
            updateRoles();
        }, {
            noAck: true,
        });

    });

    channel.consume(queue, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
        let messageuuid = msg.content.toString().split(' ');
        console.log(messageuuid);
    }, {
        noAck: true
    });

  });

});
const phoenixClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

async function handleRoleRemoval() {
    const now = new UTCDate();
    const events = await phoenix.getEvents();
    const nextEventTimeOffsetted = events
        .map(event => subMonths(new UTCDate(event["start_time"] * 1000), timeBeforeNextEventRemove))
        .find(time => time.getTime() > now.getTime());
    if (!nextEventTimeOffsetted || differenceInHours(nextEventTimeOffsetted, now) > 24) {
        console.info("Skipping scheduled role removal");
        return;
    }

    console.log("Removing roles");
    removeAllRoles();
}
setInterval(() => {
    handleRoleRemoval();
}, oneDay);


async function removeAllRoles() {
    //ENDRE TIL SERVERID
    const guild = phoenixClient.guilds.cache.get("1057285699050680441");
    //ENDRE TIL SERVERID
    const guild = phoenixClient.guilds.cache.get(phoenixGuildId);
    try {
        let crews = await Promise.all((await phoenix.Crew.getCrews()));
        crews.forEach(async (Crew) => {
            let allCrews = await phoenix.Crew.getCrew(Crew.uuid);
            let readableCrew = allCrews.positions;
            readableCrew.forEach(async (position) => {
                if (position.chief === true) {
                    position.position_mappings.forEach(async (mapping) => {
                        let discordUser = await phoenix.User.getDiscordMapping(mapping.user.uuid);
<<<<<<< HEAD
                        if (discordUser != null && discordUser.discord_id != null) {
                            let roleVar = guild.roles.cache.find(role => role.name === "Gruppeleder");
=======
                        if (discordUser !== null && discordUser.discord_id !== null) {
                            let roleVar = guild.roles.cache.get(process.env.GRUPPELEDER_ID);
>>>>>>> de01492 (added implementation for getting roles by id)
                            let member = await guild.members.fetch(discordUser.discord_id);
                            await member.roles.remove(roleVar);
                        }
                    })
                } else {
                    position.position_mappings.forEach(async (mapping) => {
                        let discordUser = await phoenix.User.getDiscordMapping(mapping.user.uuid);
                        if (discordUser != null && discordUser.discord_id != null) {
                            let roleVar = guild.roles.cache.get(process.env.CREW_ID);
                            let member = await guild.members.fetch(discordUser.discord_id);
                            await member.roles.remove(roleVar);
                        }
                    })
                }
            });
        });
    } catch (error) {
        console.error("an error occured while deleting roles:", error);
    }


async function updateRoles() {
    const targetGuild = phoenixClient.guilds.cache.first();
    let crews = await Promise.all((await phoenix.Crew.getCrews()))
    crews.forEach(async (Crew) => {
        let allCrews = await phoenix.Crew.getCrew(Crew.uuid) })
}
setInterval(() => {
    handleRoleRemoval();
}, 8.64e+7); // 1 day


async function removeAllRoles() {
    //ENDRE TIL SERVERID
    const guild = phoenixClient.guilds.cache.get("1057285699050680441");
    //ENDRE TIL SERVERID
    try {
        let crews = await Promise.all((await phoenix.Crew.getCrews()));
        crews.forEach(async (Crew) => {
            let allCrews = await phoenix.Crew.getCrew(Crew.uuid);
            let readableCrew = allCrews.positions;
            readableCrew.forEach(async (position) => {
                if (position.chief === true) {
                    position.position_mappings.forEach(async (mapping) => {
                        let discordUser = await phoenix.User.getDiscordMapping(mapping.user.uuid);
                        if (discordUser != null && discordUser.discord_id != null) {
                            let roleVar = guild.roles.cache.find(role => role.name === "Gruppeleder");
                            let member = await guild.members.fetch(discordUser.discord_id);
                            await member.roles.remove(roleVar);
                        }
                    })
                } else {
                    position.position_mappings.forEach(async (mapping) => {
                        let discordUser = await phoenix.User.getDiscordMapping(mapping.user.uuid);
                        if (discordUser != null && discordUser.discord_id != null) {
                            let roleVar = guild.roles.cache.find(role => role.name === "Crew");
                            let member = await guild.members.fetch(discordUser.discord_id);
                            await member.roles.remove(roleVar);
                        }
                    })
                }
            });
        });
    } catch (error) {
        console.error("an error occured while deleting roles:", error);
    }

}

async function updateRoles() {
    //ENDRE TIL SERVERID
    const guild = phoenixClient.guilds.cache.get("1057285699050680441");
    //ENDRE TIL SERVERID
    let crews = await Promise.all((await phoenix.Crew.getCrews()));
    crews.forEach(async (Crew) => {
        let allCrews = await phoenix.Crew.getCrew(Crew.uuid);
        let readableCrew = allCrews.positions;
        readableCrew.forEach(async (position) => {
            if (position.chief === true) {
                position.position_mappings.forEach(async (mapping) => {
                    try {
                        let discordUser = await phoenix.User.getDiscordMapping(mapping.user.uuid);
                        if (discordUser != null && discordUser.discord_id != null) {
                            let roleVar = guild.roles.cache.find(role => role.name === "Gruppeleder");
                            let member = await guild.members.fetch(discordUser.discord_id);
                            await member.roles.add(roleVar);
                        }
                    } catch (error) {
                        console.error("an error occured while editing roles:", error);
                        console.log()
                    }
                })
            } else {
                position.position_mappings.forEach(async (mapping) => {
                    try {
                        let discordUser = await phoenix.User.getDiscordMapping(mapping.user.uuid);
                        if (discordUser != null && discordUser.discord_id != null) {
                            let roleVar = guild.roles.cache.find(role => role.name === "Crew");
                            let member = await guild.members.fetch(discordUser.discord_id);
                            await member.roles.add(roleVar);
                        }
                    } catch (error) {
                        console.error("an error occured while editing roles:", error);
                    }
                })
            }
        });
    });
};

async function updateRoles() {
    //change this
    const guild = phoenixClient.guilds.cache.get("1057285699050680441");
    const guild = phoenixClient.guilds.cache.get(phoenixGuildId);
    let crews = await Promise.all((await phoenix.Crew.getCrews()));
    crews.forEach(async (Crew) => {
        let allCrews = await phoenix.Crew.getCrew(Crew.uuid);
        let readableCrew = allCrews.positions;
        readableCrew.forEach(async (position) => {
            if (position.chief === true) {
                position.position_mappings.forEach(async (mapping) => {
                    try {
                        let discordUser = await phoenix.User.getDiscordMapping(mapping.user.uuid);
                        if (discordUser != null && discordUser.discord_id != null) {
                            let roleVar = guild.roles.cache.get(process.env.GRUPPELEDER_ID);
                            let member = await guild.members.fetch(discordUser.discord_id);
                            await member.roles.add(roleVar);
                        }
                    } catch (error) {
                        console.error("an error occured while editing roles:", error);
                    }
                })
            } else {
                position.position_mappings.forEach(async (mapping) => {
                    try {
                        let discordUser = await phoenix.User.getDiscordMapping(mapping.user.uuid);
                        if (discordUser != null && discordUser.discord_id != null) {
                            let roleVar = guild.roles.cache.get(process.env.CREW_ID);
                            let member = await guild.members.fetch(discordUser.discord_id);
                            await member.roles.add(roleVar);
                        }
                    } catch (error) {
                        console.error("an error occured while editing roles:", error);
                    }
                })
            }
        });
    });
};



//when the bot turns on
phoenixClient.on("ready", () => {
    console.log(`Logged in as ${phoenixClient.user.tag}!`);
    updateRoles();
    setInterval(function () {
        updateRoles();
        console.log("half an hour has gone by, updating roles");
    }, halfHour);
});

//when someone joins the server
phoenixClient.on("guildMemberAdd", member => {
    updateRoles();
})


//when there is a new message in the server
phoenixClient.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.includes("chief")) {
        message.channel.send("det heter gruppeleder! :rage:");
    };
<<<<<<< HEAD
    const prefix = '!';

    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

=======
    const prefix = "!";
>>>>>>> bedd543 (Improved promise awaiting)
    //check if message is a command
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        //handle commands
        switch (command) {
            case "help":
                const helpEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle("Phoenix bot kommandoer")
                    .setDescription("Kommandoer du kan bruke")
                    .addFields({
                        name: "!help",
                        value: "Denne kommandoen. viser hvilke kommandoer du kan bruke"
                    }, {
                        name: "!roles",
                        value: "Oppdaterer roller.",
                    }, {
                        name: '!roles',
                        value: 'Oppdaterer roller.',
                    }, {
                        name: '!liam',
                        value: 'Viser den nåværende tiden i Japan',
                    })
                    .setTimestamp()
                    .setFooter({
                        text: "Phoenix bot !help",
                    });
                message.reply({
                    embeds: [helpEmbed]
                });
                break;
<<<<<<< HEAD
            case 'roles':
                //change this
                const guild = phoenixClient.guilds.cache.get("1057285699050680441");
                let role = message.member.roles.cache.find(role => role.name === "Administrasjon")
                if(role){
                //only runs if user has role "Administrasjon" in the discord server
                const guild = phoenixClient.guilds.cache.get(phoenixGuildId);
                let role = message.member.roles.cache.find(role => role.name === "Administrasjon")
                if(role){
                    //removes roles and adds them again to make sure that if someone is removed from the crew, it will remove them first, then add all the people that are supposed to have roles
                    await removeAllRoles();
                    await updateRoles();
                    message.reply('roller oppdatert');
                    break;
                } else {
                        message.reply('du har ikke tillatelse til å gjøre dette, kontakt administrasjonen.');
                        break;
                };
            case 'liam':
=======
            case "roles":
                //only runs if user has role "Administrasjon" in the discord server
                const guild = phoenixClient.guilds.cache.get(phoenixGuildId);
                const role = message.member.roles.cache.get(process.env.ADMINISTRASJON_ID);
                if (role) {
                    //removes roles and adds them again to make sure that if someone is removed from the crew, it will remove them first, then add all the people that are supposed to have roles
                    await Promise.all([
                        await removeAllRoles(),
                        await updateRoles(),
                    ]);
                    message.reply("roller oppdatert");
                } else {
                    message.reply("du har ikke tillatelse til å gjøre dette, kontakt administrasjonen.");
                };
                break;
            case "liam":
>>>>>>> bedd543 (Improved promise awaiting)
                //getting time in japan, where liam lives
                let liam_tid = new Date().toLocaleTimeString("nb-NO", {
                    timeZone: "JST"
                });
                message.reply("Liam bor i Japan som ligger " + 7 + " timer før Norge, tiden i japan er nå: " + liam_tid);
                break;
            case 'flag':
                message.reply('PHOENIX{D1SCO_B0T}');
                break;
            default:
                message.reply("Dette var en kommando som ikke funket, se om du skrev den riktig eller skriv !help for å se alle kommandoer");
                break;
        }
    }
});
<<<<<<< HEAD
<<<<<<< HEAD

<<<<<<< HEAD

//logging in to the discord bot api with the bot token
=======
>>>>>>> 0fb5340 (wttf)
=======
phoenix.init("https://api.test.phoenixlan.no");
phoenix.User.Oauth.setAuthState("eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJ0aWNrZXRfd2hvbGVzYWxlIiwibWVtYmVyIiwidXNlcjplNWQ1ZGMxOC1kZjk5LTRkMWYtYjQ0OC1iYWEyYTg5ZWY3MGUiLCJhZG1pbiIsImNoaWVmOjIzODZkMGE1LTdjYTMtNGVlOS1iNTExLTI2MTNhMjE2ZWZhOSIsImNoaWVmIiwidGlja2V0X2J5cGFzc190aWNrZXRzYWxlX3N0YXJ0X3Jlc3RyaWN0aW9uIl0sImZsYWciOiJQSE9FTklYe0pXVFNfQVJFX0FXRVNPTUV9Iiwic3ViIjoiZTVkNWRjMTgtZGY5OS00ZDFmLWI0NDgtYmFhMmE4OWVmNzBlIiwiaWF0IjoxNjkyNjM1OTU5LCJleHAiOjE2OTI2Mzk1NTl9.Bz_Bjg9tFaaJdFHu6fLWMZh7r9eM0EstxIoaIQAAyKw2fdOpvRdh5fQ9rRu883KYAi2yNYn93WSFb8UmW4IfmQ", "FqzfMCdgrsKlMZKLgQhpSUkOWjxCQVLwNATzAlMR");
>>>>>>> feaea3b (jvneafkjnfakjnf)
phoenixClient.login(DISCORD_TOKEN);
=======


phoenixClient.login(DISCORD_TOKEN);
>>>>>>> 0d3d7a4 (almost finished)
