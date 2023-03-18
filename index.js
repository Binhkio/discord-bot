/*
discord.js: ^14.7.1
*/

import {
    getVoiceConnection,
} from '@discordjs/voice'
import {
    Client,
    GatewayIntentBits
} from 'discord.js'
import { keepAlive } from './server.js'
import { registerCommand } from './register_command.js'
import { joinChannel } from './command/joinChannel.js'
import { textToSpeech } from './command/textToSpeech.js'
import { createPlayer } from './command/player.js'
import playdl from "play-dl"
import { getListMusic } from './command/getListMusic.js'

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

// Variable
const guildList = new Map()

// Event
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach(guild => {
        guildList.set(guild.id, {
            allGuildVoiceMembers: new Map(),
            voiceMembers: new Map(),
            voiceChannel: '',
            music: {
                status: 'idle',
                songsQueue: [],
                subscription: null,
            }
        })
    })
})


client.on("voiceStateUpdate", async (oldState, newState) => {
    if(newState.channel 
        && newState.channel.members.size !== guildList.get(newState.guild.id).voiceMembers.size){
        // Thong tin thanh vien trong tat ca cac kenh
        guildList
            .get(newState.guild.id)
            .allGuildVoiceMembers
            .set(newState.member.user.id, newState.channel)

        // Thong tin thanh vien trong kenh hien tai
        const voiceConnection = getVoiceConnection(newState.guild.id)
        if(newState.member.user.id === process.env.CLIENT_ID){
            guildList.get(newState.guild.id).voiceChannel = newState.channel.id
            newState.channel.members.forEach(member => {
                guildList.get(newState.guild.id).voiceMembers.set(member.user.id, member)
            })
        }else if(guildList.get(newState.guild.id).voiceMembers.has(process.env.CLIENT_ID)
                && newState.channel.id === guildList.get(newState.guild.id).voiceChannel){
            guildList.get(newState.guild.id).voiceMembers.set(newState.member.user.id, newState.member)
            const name = newState.member.nickname || newState.member.user.tag.split("#")[0]
            await textToSpeech(`Chào ${name}`, voiceConnection,
                guildList.get(newState.guild.id).music?.subscription,
                () => {
                    voiceConnection.subscribe(guildList.get(newState.guild.id).music?.player)
                })
        }
        console.log("[new] Total members: ", guildList.get(newState.guild.id).voiceMembers.size);
    } else if(oldState.channel
        && oldState.channel.members.size !== guildList.get(oldState.guild.id).voiceMembers.size){
        // Thong tin thanh vien trong tat ca cac kenh
        guildList.get(oldState.guild.id).allGuildVoiceMembers.delete(oldState.member.user.id)
        
        // Thong tin thanh vien trong kenh hien tai
        const voiceConnection = getVoiceConnection(oldState.guild.id)
        if(oldState.member.user.id === process.env.CLIENT_ID){
            guildList.get(oldState.guild.id).voiceMembers = new Map()
        }else if(guildList.get(oldState.guild.id).voiceMembers.has(process.env.CLIENT_ID)
                && oldState.channel.id === guildList.get(oldState.guild.id).voiceChannel){
            guildList.get(oldState.guild.id).voiceMembers.delete(oldState.member.user.id)
            const name = oldState.member.nickname || oldState.member.user.tag.split("#")[0]
            await textToSpeech(`Tạm biệt ${name}`, voiceConnection,
                guildList.get(newState.guild.id).music?.subscription,
                () => {
                    voiceConnection.subscribe(guildList.get(newState.guild.id).music?.player)
                })
        }
        console.log("[old] Total members: ", guildList.get(oldState.guild.id).voiceMembers.size);
    }
})

client.on('interactionCreate', async interaction => {
    try {
        if (!interaction.isChatInputCommand()) return;

        // VOICE SPEAK
        if (interaction.commandName === 'say') {
            const voiceMessage = interaction.options.getString('content')
            let voiceConnection = getVoiceConnection(interaction.guildId)
            if (!voiceConnection) {
                voiceConnection = 
                    await joinChannel(
                        guildList.get(interaction.guildId).allGuildVoiceMembers.get(interaction.member.user.id),
                        interaction)
            }
            
            textToSpeech(voiceMessage, voiceConnection,
                guildList.get(interaction.guildId).music?.subscription,
                () => {
                    voiceConnection.subscribe(guildList.get(interaction.guildId).music?.player)
                }).then(async () => {
                await interaction.reply(`>>> ${voiceMessage}`);
            })
        }

        // CHAT GPT
        if (interaction.commandName === 'gpt') {
            await interaction.reply("GPT không khả dụng")
            // const message = interaction.options.getString('message')
            // const type = interaction.options.getString('type')

            // await interaction.deferReply({ content: "Kết nối với ChatGPT..." })

            // chatGPT(message, type, async (replyContent) => {
            //     await interaction.editReply(replyContent)
            // })
        }

        // JOIN CHANNEL
        if (interaction.commandName === 'join') {
            const voiceChannel = interaction.options.getChannel('channel')
            if(!getVoiceConnection(interaction.guildId)){
                joinChannel(voiceChannel, interaction).then(async (voiceConnection) => {
                    await textToSpeech("Ếch xanh đã tham gia kênh chat", voiceConnection,
                        guildList.get(interaction.guildId).music?.subscription,
                        () => {})
                    await interaction.reply(`Ếch xanh đã tham gia **${voiceChannel.name}**.`)
                })
            }
        }

        // PLAY MUSIC
        if (interaction.commandName === 'play') {
            const url = interaction.options.getString('url')
            const now = interaction.options.getBoolean('now')

            if(playdl.yt_validate(url) !== "video"){
                interaction.reply(`**Link không tồn tại**`)
                return;
            }

            let voiceConnection = getVoiceConnection(interaction.guildId)
            if (!voiceConnection) {
                const channel = guildList.get(interaction.guildId).allGuildVoiceMembers.get(interaction.member.user.id)
                voiceConnection = await joinChannel(channel, interaction)
            }
            
            const Music = guildList.get(interaction.guildId).music
            if(!Music.player){
                console.log("Create new Player");
                const player = createPlayer(Music, interaction)
                Music.subscription = voiceConnection.subscribe(player)
                Music.player = player
            }

            if(!now){
                Music.songsQueue.push(url)
                if(Music.status === 'idle'
                && Music.songsQueue.length === 1){
                    Music.player.emit('keepPlaying', Music.songsQueue, Music.player, Music.status, interaction)
                }
                await interaction.reply(`**Thêm vào hàng chờ**\n> ${url}`)
            }else{
                Music.songsQueue.unshift(url)
                Music.player.emit('skipPlaying', Music.songsQueue, Music.player, Music.status, interaction)
            }
        }

        // PLAY LIST
        if (interaction.commandName === 'addlist') {
            const url = interaction.options.getString('url')
            const now = interaction.options.getBoolean('now')

            if(playdl.yt_validate(url) !== "playlist"){
                interaction.reply(`**Link không tồn tại**`)
                return;
            }

            let voiceConnection = getVoiceConnection(interaction.guildId)
            if (!voiceConnection) {
                const channel = guildList.get(interaction.guildId).allGuildVoiceMembers.get(interaction.member.user.id)
                voiceConnection = await joinChannel(channel, interaction)
            }

            const listMusic = await getListMusic(url)
            const listMusicUrl = listMusic.videos.map(video => video.url)
            
            const Music = guildList.get(interaction.guildId).music
            if(!Music.player){
                console.log("Create new Player");
                const player = createPlayer(Music, interaction)
                Music.subscription = voiceConnection.subscribe(player)
                Music.player = player
            }

            if(!now){
                Music.songsQueue = Music.songsQueue.concat(listMusicUrl)
                if(Music.status === 'idle'
                && Music.songsQueue.length === listMusicUrl.length){
                    Music.player.emit('keepPlaying', Music.songsQueue, Music.player, Music.status, interaction)
                }
                await interaction.reply(`**Thêm danh sách nhạc**\n> ${url}`)
            }else{
                Music.songsQueue = listMusicUrl.concat(Music.songsQueue)
                Music.player.emit('skipPlaying', Music.songsQueue, Music.player, Music.status, interaction)
            }
        }

        // PAUSE
        if (interaction.commandName === 'pause') {
            const Music = guildList.get(interaction.guildId).music
            if(!Music.player){
                await interaction.reply("Không có nhạc trong hàng chờ!")
            }else{
                Music.player.emit("pausePlaying", Music.songsQueue, Music.player, Music.status, interaction)
            }
        }

        // RESUME
        if (interaction.commandName === 'resume') {
            const Music = guildList.get(interaction.guildId).music
            if(!Music.player){
                await interaction.reply("Không có nhạc trong hàng chờ!")
            }else{
                Music.player.emit("resumePlaying", Music.songsQueue, Music.player, Music.status, interaction)
            }
        }

        // SKIP
        if (interaction.commandName === 'skip') {
            const Music = guildList.get(interaction.guildId).music
            if(!Music.player){
                await interaction.reply("Không có nhạc trong hàng chờ!")
            }else{
                Music.player.emit("skipPlaying", Music.songsQueue, Music.player, Music.status, interaction)
            }
        }

        // STOP
        if (interaction.commandName === 'stop') {
            const Music = guildList.get(interaction.guildId).music
            if(Music.status !== 'playing'){
                await interaction.reply("> **Dừng phát nhạc**")
            }else{
                Music.player.emit("stopPlaying", Music.songsQueue, Music.player, Music.status, interaction)
            }
        }

        // DISCONNECT
        if (interaction.commandName === 'disconnect'
            || interaction.commandName === 'leave') {
            const voiceConnection = getVoiceConnection(interaction.guildId)
            voiceConnection?.destroy()

            await interaction.reply(`Ếch xanh đã thoát.`)
        }
    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.TOKEN)