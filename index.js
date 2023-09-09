const {
    Client,
    GatewayIntentBits,
    EmbedBuilder
} = require('discord.js');
const dotenv = require('dotenv').config();
const phoenix = require('@phoenixlan/phoenix.js');
const amqp = require('amqplib/callback_api');

const DISCORD_TOKEN = process.env.BOT_TOKEN;
amqp.connect('amqp://phoenix:testing@127.0.0.1:5672', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'position_changes';


    channel.assertQueue(queue, {
      durable: true
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

async function updateRoles() {
    const targetGuild = phoenixClient.guilds.cache.first();
    let crews = await Promise.all((await phoenix.Crew.getCrews()))
    crews.forEach(async (Crew) => {
        let allCrews = await phoenix.Crew.getCrew(Crew.uuid) })
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
            default:
                message.reply('Dette var en kommando som ikke funket, se om du skrev den riktig eller skriv !help for å se alle kommandoer');
                break;
        }
    }
});
phoenix.init("https://api.test.phoenixlan.no");
phoenix.User.Oauth.setAuthState("eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJ0aWNrZXRfd2hvbGVzYWxlIiwibWVtYmVyIiwidXNlcjplNWQ1ZGMxOC1kZjk5LTRkMWYtYjQ0OC1iYWEyYTg5ZWY3MGUiLCJhZG1pbiIsImNoaWVmOjIzODZkMGE1LTdjYTMtNGVlOS1iNTExLTI2MTNhMjE2ZWZhOSIsImNoaWVmIiwidGlja2V0X2J5cGFzc190aWNrZXRzYWxlX3N0YXJ0X3Jlc3RyaWN0aW9uIl0sImZsYWciOiJQSE9FTklYe0pXVFNfQVJFX0FXRVNPTUV9Iiwic3ViIjoiZTVkNWRjMTgtZGY5OS00ZDFmLWI0NDgtYmFhMmE4OWVmNzBlIiwiaWF0IjoxNjkyNjM1OTU5LCJleHAiOjE2OTI2Mzk1NTl9.Bz_Bjg9tFaaJdFHu6fLWMZh7r9eM0EstxIoaIQAAyKw2fdOpvRdh5fQ9rRu883KYAi2yNYn93WSFb8UmW4IfmQ", "FqzfMCdgrsKlMZKLgQhpSUkOWjxCQVLwNATzAlMR");
phoenixClient.login(DISCORD_TOKEN);
