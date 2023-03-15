/*
discord.js: ^14.7.1
*/

const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { default: axios } = require('axios');
const { 
    REST, 
    Routes, 
    Client, 
    GatewayIntentBits, 
    SlashCommandBuilder,
    ChannelType
} = require('discord.js');
const { createReadStream } = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const googleTTS = require('google-tts-api')
const fs = require('fs')
const pathToFfmpeg = require('ffmpeg-static')

const tokenArr = [
    "MTA4MzczMjg1NTUxMjg5OTYzNQ",
    "GJ2Vld",
    "4pIJpRoY9y1loEvz0zXaaW56F_BIMOF2Hiaufc"
]
const TOKEN = tokenArr.join('.');
const CLIENT_ID = "1083732855512899635";

//Invite link:  https://discord.com/api/oauth2/authorize?client_id=1083732855512899635&permissions=137471948864&scope=bot



//App commands
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: [
                new SlashCommandBuilder()
                    .setName('say')
                    .setDescription('Say something in voice channel')
                    .addStringOption(option => 
                        option.setName('content')
                            .setDescription('Type what you want bot to say')
                            .setRequired(true)
                    )
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('join')
                    .setDescription('Join a voice channel')
                    .addChannelOption((option) => 
                        option.setName('channel')
                            .setDescription('The channel to join')
                            .setRequired(true)
                            .addChannelTypes(ChannelType.GuildVoice)
                    )
                    .toJSON(),
            ],
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();



//Main

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

var currentConnection = null

client.on('interactionCreate', async interaction => {
    try {
        if (!interaction.isChatInputCommand()) return;
        
        // VOICE SPEAK
        if (interaction.commandName === 'say') {
            const voiceMessage = interaction.options.getString('content')
            const voiceConnection = getVoiceConnection(interaction.guildId)

            const player = createAudioPlayer()
            voiceConnection.subscribe(player)
            
            const voiceURL = googleTTS.getAudioUrl(voiceMessage, {
                lang: 'vi',
                slow: false,
                host: 'https://translate.google.com',
                splitPunct: ',.?',
            })
            const { data } = await axios.get(voiceURL, {
                responseType: 'arraybuffer',
                headers: {
                    "Content-Type": 'audio/mpeg'
                }
            })
            const writer = fs.createWriteStream('./audio.mp3')
            writer.write(data)

            const resource = createAudioResource(createReadStream('./audio.mp3'))
            player.play(resource)

            await interaction.reply(`${voiceMessage}`);
        }

        // JOIN CHANNEL
        if (interaction.commandName === 'join') {
            const voiceChannel = interaction.options.getChannel('channel')
            const voiceConnection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            })
            currentConnection = voiceConnection
            await interaction.reply(`Join channel **${voiceChannel.name}**`)
        }

        // DISCONNECT
        if (interaction.commandName === 'disconnect') {
            const voiceConnection = getVoiceConnection(interaction.guildId)
            voiceConnection.disconnect()

            await interaction.reply(`Bot has disconnected`)
        }
    } catch (error) {
        console.log(error);
    }
});

client.login(TOKEN)