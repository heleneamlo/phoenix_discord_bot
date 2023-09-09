const {
    Client,
    GatewayIntentBits,
    EmbedBuilder
} = require('discord.js');
const dotenv = require('dotenv').config();
const phoenix = require('@phoenixlan/phoenix.js');
const amqp = require('amqplib');

const DISCORD_TOKEN = process.env.BOT_TOKEN;
const RABBITMQ_URL = 'YOUR_RABBITMQ_URL';
const QUEUE_NAME = 'your-queue-name';

const phoenixClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const roleData = [{
    "discord_id": "371352013432422411",
    "member": true,
    "chief": false
}, {
    "discord_id": "853001789849862175",
    "member": true,
    "chief": true
}, {
    "discord_id": "377816145589174285",
    "member": false,
    "chief": false
}, {
    "discord_id": "439121172467154946",
    "member": false,
    "chief": true
}]



async function updateRoles() {
    const targetGuild = phoenixClient.guilds.cache.first();
    roleData.forEach(async (userData) => {
        parseInt(userData.discord_id);
        try {
            const member = await targetGuild.members.fetch(userData.discord_id);
            if (member) {
                // Check and add roles if needed
                if (userData.member && !member.roles.cache.some(role => role.name == 'Crew')) {
                    const memberRole = targetGuild.roles.cache.find(role => role.name == 'Crew');
                    if (memberRole) {
                        member.roles.add(memberRole);
                    }
                }
                if (userData.chief && !member.roles.cache.some(role => role.name == 'Gruppeleder')) {
                    const chiefRole = targetGuild.roles.cache.find(role => role.name == 'Gruppeleder');
                    if (chiefRole) {
                        member.roles.add(chiefRole);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    });
}



phoenixClient.on('ready', () => {
    console.log(`Logged in as ${phoenixClient.user.tag}!`);
    updateRoles();
    setInterval(function () {
        updateRoles();
        console.log("half an hour has gone by, updating roles")
     }, 1800000)
});

phoenixClient.on('guildMemberAdd', member => {
    console.log("shit");
    updateRoles();
})


phoenixClient.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.includes("chief")) {
        message.channel.send("det heter gruppeleder! :rage:")
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
                        name: '!test',
                        value: 'Tester om botten er aktiv',
                    }, {
                        name: '!roles',
                        value: 'Oppdaterer roller.',
                    }, {
                        name: '!liam',
                        value: 'Viser den nåværende tiden i Japan',
                    }, {
                        name: 'REDACTED',
                        value: 'REDACTED',
                    }, )
                    .setTimestamp()
                    .setFooter({
                        text: 'Phoenix bot !help',
                    });
                message.reply({
                    embeds: [helpEmbed]
                });
                break;
            case 'test':
                message.reply('botten er aktiv');
                break;
            case 'roles':
                updateRoles();
                message.reply('roller oppdatert');
                break;
            case 'flag':
                message.reply('PHOENIX{D1SCO_B0T}');
                break;
            case 'liam':
                let liam_tid = new Date().toLocaleTimeString("nb-NO", { timeZone: "JST"})
                message.reply("Liam bor i Japan som ligger 8 timer før Norge, tiden i japan er nå: " + liam_tid)
                break;
            default:
                message.reply('Dette var en kommando som ikke funket, se om du skrev den riktig eller skriv !help for å se alle kommandoer');
                break;
        }
    }
});

phoenixClient.login(DISCORD_TOKEN);
