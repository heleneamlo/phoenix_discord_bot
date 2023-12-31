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
//change this
phoenix.User.Oauth.setAuthState("", "");
const timeBeforeNextEventRemove = 2;


const DISCORD_TOKEN = process.env.BOT_TOKEN;
//change this
amqp.connect('amqp://', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        //change this
        let queue = '';


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
    if (!nextEventTimeOffsetted || differenceInHours(nextEventTimeOffsetted, now) > 25) {
        console.info("Skipping scheduled role removal");
        return;
    }

    console.log("Removing roles");
    removeAllRoles();
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
    //change this
    const guild = phoenixClient.guilds.cache.get("1057285699050680441");
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



phoenixClient.on('ready', () => {
    console.log(`Logged in as ${phoenixClient.user.tag}!`);
    updateRoles();
    setInterval(function () {
        updateRoles();
        console.log("half an hour has gone by, updating roles");
    }, 1800000);
});

phoenixClient.on('guildMemberAdd', member => {
    updateRoles();
})


phoenixClient.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.includes("chief")) {
        message.channel.send("det heter gruppeleder! :rage:");
    };
    const prefix = '!';

    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        switch (command) {
            case 'help':
                const helpEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Phoenix bot kommandoer')
                    .setDescription('Kommandoer du kan bruke')
                    .addFields({
                        name: '!help',
                        value: 'Denne kommandoen. viser hvilke kommandoer du kan bruke'
                    }, {
                        name: '!roles',
                        value: 'Oppdaterer roller.',
                    }, {
                        name: '!liam',
                        value: 'Viser den nåværende tiden i Japan',
                    })
                    .setTimestamp()
                    .setFooter({
                        text: 'Phoenix bot !help',
                    });
                message.reply({
                    embeds: [helpEmbed]
                });
                break;
            case 'roles':
                //change this
                const guild = phoenixClient.guilds.cache.get("1057285699050680441");
                let role = message.member.roles.cache.find(role => role.name === "Administrasjon")
                if(role){
                    await removeAllRoles();
                    await updateRoles();
                    message.reply('roller oppdatert');
                    break;
                } else {
                        message.reply('du har ikke tillatelse til å gjøre dette, kontakt administrasjonen.');
                        break;
                };
            case 'liam':
                let liam_tid = new Date().toLocaleTimeString("nb-NO", {
                    timeZone: "JST"
                });
                message.reply("Liam bor i Japan som ligger 8 timer før Norge, tiden i japan er nå: " + liam_tid);
                break;
            default:
                message.reply('Dette var en kommando som ikke funket, se om du skrev den riktig eller skriv !help for å se alle kommandoer');
                break;
        }
    }
});


phoenixClient.login(DISCORD_TOKEN);
