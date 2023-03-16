/*
discord.js: ^14.7.1
*/

import { 
    joinVoiceChannel,
    getVoiceConnection
} from '@discordjs/voice'
import {
    Client,
    GatewayIntentBits
} from 'discord.js'
import { keepAlive } from './server.js'
import { registerCommand } from './register_command.js'
import { chatGPT } from './command/chatGPT.js'
import { joinChannel } from './command/joinChannel.js'
import { textToSpeech } from './command/textToSpeech.js'

keepAlive()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

//Invite link:  https://discord.com/api/oauth2/authorize?client_id=1083732855512899635&permissions=137471948864&scope=bot

process.on('unhandledRejection', (reason, p) => {
    console.log("Reason", reason, "Promise", p);
}).on('uncaughtException', err => {
    console.log("uncaughtException", err);
})




//App commands
registerCommand()

//Main
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on('interactionCreate', async interaction => {
    try {
        if (!interaction.isChatInputCommand()) return;

        // VOICE SPEAK
        if (interaction.commandName === 'say') {
            const voiceMessage = interaction.options.getString('content')
            const voiceConnection = getVoiceConnection(interaction.guildId)
            if (!voiceConnection?.state?.status) {
                await interaction.reply(`Ếch chưa vào kênh. Hãy sử dụng \`/join\` để triệu hồi Ếch`);
                return;
            }

            textToSpeech(voiceMessage, voiceConnection).then(async () => {
                await interaction.reply(`>>> ${voiceMessage}`);
            })
        }

        // CHAT GPT
        if (interaction.commandName === 'gpt') {
            const message = interaction.options.getString('message')
            const type = interaction.options.getString('type')
            const useTTS = interaction.options.getBoolean('tts')
            const voiceConnection = getVoiceConnection(interaction.guildId)

            await interaction.deferReply({ content: "Kết nối với ChatGPT..." })

            chatGPT(message, type, useTTS, voiceConnection, async (replyContent) => {
                await interaction.editReply(replyContent)
            })
        }

        // JOIN CHANNEL
        if (interaction.commandName === 'join') {
            const voiceChannel = interaction.options.getChannel('channel')
            const voiceConnection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            })
            joinChannel(voiceChannel, voiceConnection).then(async () => {
                await interaction.reply(`Ếch xanh đã tham gia **${voiceChannel.name}**.`)
            })
        }

        // PLAY MUSIC

        // DISCONNECT
        if (interaction.commandName === 'disconnect'
            || interaction.commandName === 'leave') {
            const voiceConnection = getVoiceConnection(interaction.guildId)
            voiceConnection?.destroy()

            await interaction.reply(`Ếch xanh đã trở về môi trường hoang dã.`)
        }
    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.TOKEN)