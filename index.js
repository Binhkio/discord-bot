/*
discord.js: ^14.7.1
*/

import {
    AudioPlayerStatus,
    EndBehaviorType,
    getVoiceConnection,
} from '@discordjs/voice'
import {
    AttachmentBuilder,
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
import { buttonControll, recordControll } from './command/buttonControll.js'
import { musicEmbed } from './command/musicEmbed.js'
import { createListeningStream } from './command/recordVoice.js'
import ffmpeg from 'ffmpeg'
import fs from "fs"
import { recordButton } from './command/musicButton.js'
import { choosedEmbed, searchEmbed } from './command/searchEmbed.js'
import { searchSelector } from './command/searchSelector.js'
import { casesPrice } from './command/csgo/casesPrice.js'
import { csgoEmbed } from './command/csgo/csgoEmbed.js'

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
            },
            record: {
                isListening: false,
            }
        })
    })
})

const handleSay = async (interaction) => {
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
const handleGpt = async (interaction) => {
    await interaction.reply("GPT không khả dụng")
    // const message = interaction.options.getString('message')
    // const type = interaction.options.getString('type')

    // await interaction.deferReply({ content: "Kết nối với ChatGPT..." })

    // chatGPT(message, type, async (replyContent) => {
    //     await interaction.editReply(replyContent)
    // })
}
const handleJoin = async (interaction) => {
    const voiceChannel = interaction.options.getChannel('channel')
    if(!getVoiceConnection(interaction.guildId)){
        joinChannel(voiceChannel, interaction).then(async (voiceConnection) => {
            await textToSpeech("Ếch xanh đã tham gia kênh chat", voiceConnection,
                guildList.get(interaction.guildId).music?.subscription,
                () => {})
        })
        await interaction.reply(`Ếch xanh đã tham gia **${voiceChannel.name}**.`)
    }
}
const handlePlay = async (interaction) => {
    const url = interaction?.options?.getString('url') || interaction?.values[0].split('|')[1]
    const now = interaction?.options?.getBoolean('now')

    let voiceConnection = getVoiceConnection(interaction.guildId)
    if (!voiceConnection) {
        const channel = guildList.get(interaction.guildId).allGuildVoiceMembers.get(interaction.member.user.id)
        voiceConnection = await joinChannel(channel, interaction)
        if(voiceConnection === false){
            interaction.reply(">>> **Không tìm được thông tin kênh**\n_(Hãy dùng `/join` để gọi Ếch vào kênh)_")
            return;
        }
    }

    const Music = guildList.get(interaction.guildId).music
    if(!Music.player){
        console.log("Create new Player");
        const player = createPlayer(Music, interaction)
        Music.subscription = voiceConnection.subscribe(player)
        Music.player = player
    }

    console.log("/play ", url)
    if(playdl.yt_validate(url) !== "video"){
        if(playdl.yt_validate(url) === "playlist"){
            return await interaction.reply("> Nếu muốn thêm playlist, hãy dùng \`/addlist\`")
        }
        return await interaction.reply("> **Link video không hợp lệ**")
    }

    if(!now){
        Music.songsQueue.push(url)
        if(!interaction.replied){
            await interaction.deferReply()
        }
        
        if(Music.status === 'idle'
        && Music.songsQueue.length === 1){
            Music.player.emit('keepPlaying', Music.songsQueue, Music.player, Music.status, interaction)
        }
        
        const { video_details } = await playdl.video_basic_info(url)
        const user_details = interaction.user
        await interaction.editReply({ embeds: [musicEmbed("add", video_details, user_details)]})
    }else{
        Music.songsQueue.unshift(url)
        Music.player.emit('skipPlaying', Music.songsQueue, Music.player, Music.status, interaction)
    }
}
const handleAddList = async (interaction) => {
    const url = interaction.options.getString('url')
    const now = interaction.options.getBoolean('now')

    console.log("/addlist ", url);
    if(playdl.yt_validate(url) !== "playlist"){
        if(playdl.yt_validate(url) === "video"){
            return await interaction.reply("> Nếu muốn thêm nhạc, hãy dùng \`/play\`")
        }
        return await interaction.reply(`> **Link không tồn tại**`)
    }

    let voiceConnection = getVoiceConnection(interaction.guildId)
    if (!voiceConnection) {
        const channel = guildList.get(interaction.guildId).allGuildVoiceMembers.get(interaction.member.user.id)
        voiceConnection = await joinChannel(channel, interaction)
        if(voiceConnection === false){
            interaction.reply(">>> **Không tìm được thông tin kênh**\n_(Hãy dùng `/join` để gọi Ếch vào kênh)_")
            return;
        }
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
        await interaction.deferReply()
        
        const video_details = await playdl.playlist_info(url)
        const user_details = interaction.user
        await interaction.editReply({ embeds: [musicEmbed("list", video_details, user_details)]})
        
        if(Music.status === 'idle'
        && Music.songsQueue.length === listMusicUrl.length){
            Music.player.emit('keepPlaying', Music.songsQueue, Music.player, Music.status, interaction)
        }
    }else{
        Music.songsQueue = listMusicUrl.concat(Music.songsQueue)
        Music.player.emit('skipPlaying', Music.songsQueue, Music.player, Music.status, interaction)
    }
}
const handleSearch = async (interaction) => {
    const name = interaction.options.getString('name')
    
    // Search
    try {
        const data = await playdl.search(name, {
            limit: 10,
            source: {
                youtube: "video",
            }
        })

        interaction.reply({
            embeds: [searchEmbed(interaction, data)],
            components: [searchSelector(data)],
        })
    } catch (error) {
        console.log("Search error", error);
    }
}
const handlePause = async (interaction) => {
    const Music = guildList.get(interaction.guildId).music
    if(!Music.player){
        await interaction.reply("Không có nhạc trong hàng chờ!")
    }else{
        Music.player.emit("pausePlaying", Music.songsQueue, Music.player, Music.status, interaction)
        if(!interaction.replied){
            interaction.reply("> **Tạm dừng**")
        }
    }
}
const handleResume = async (interaction) => {
    const Music = guildList.get(interaction.guildId).music
    if(!Music.player){
        await interaction.reply("Không có nhạc trong hàng chờ!")
    }else{
        Music.player.emit("resumePlaying", Music.songsQueue, Music.player, Music.status, interaction)
        if(!interaction.replied){
            interaction.reply("> **Tiếp tục**")
        }
    }
}
const handleSkip = async (interaction) => {
    const Music = guildList.get(interaction.guildId).music
    if(!Music.player){
        await interaction.reply("Không có nhạc trong hàng chờ!")
    }else{
        Music.player.emit("skipPlaying", Music.songsQueue, Music.player, Music.status, interaction)
        if(!interaction.replied){
            interaction.reply("> **Chuyển nhạc**")
        }
    }
}
const handleStop = async (interaction) => {
    const Music = guildList.get(interaction.guildId).music
    if(Music.status !== 'playing'){
        await interaction.reply("> **Dừng phát nhạc**")
    }else{
        Music.player.emit("stopPlaying", Music.songsQueue, Music.player, Music.status, interaction)
        if(!interaction.replied){
            interaction.reply("> **Tắt nhạc...**")
        }
    }
}
const handleDisconnect = async (interaction, channel) => {
    if(!channel){
        const voiceConnection = getVoiceConnection(interaction.guildId)
        voiceConnection?.destroy()
        await interaction.reply(`> **Ếch xanh đã thoát.**`)
    }else{
        const voiceConnection = getVoiceConnection(channel.guild.id)
        voiceConnection?.destroy()
        await channel.send(`> **Ếch xanh đã thoát.**`)
    }
}
const handleRecord = async (interaction) => {
    // let voiceConnection = getVoiceConnection(interaction.guildId)
    // if (!voiceConnection) {
    //     const channel = guildList.get(interaction.guildId).allGuildVoiceMembers.get(interaction.user.id)
    //     voiceConnection = await joinChannel(channel, interaction)
    //     if(voiceConnection === false){
    //         interaction.reply(">>> **Không tìm được thông tin kênh**\n_(Hãy dùng `/join` để gọi Ếch vào kênh)_")
    //         return;
    //     }
    // }
    
    // const receiver = voiceConnection.receiver
    // receiver.speaking.on('start', (userId) => {
    //     const receiverSubcription = receiver.subscribe(userId, {
    //         end: {
    //             behavior: EndBehaviorType.AfterSilence,
    //         }
    //     })
    //     receiverSubcription.on('data', (data) => {
    //         console.log("Receiver data", data);
    //     })
    //     receiverSubcription.once('end', () => {
    //         console.log("End receiver...");
    //     })
    //     receiverSubcription.on('error', (err) => {
    //         console.log("Receiver error", err);
    //     })
    // })

    // const isListening = guildList.get(interaction.guildId).record.isListening
    // if(isListening === true){
    //     recordControll("stop_record", voiceConnection, interaction)
    // }else{
    //     recordControll("start_record", voiceConnection, interaction)
    // }

    await interaction.reply({
        embeds: [musicEmbed("record", {title: "RECORDING YOUR VOICE"}, {avatarURL: interaction.user.avatarURL()})],
        components: [recordButton("init")]
    })
}
const handleCsgoCases = async (interaction) => {
    await interaction.deferReply()
    const steamId = interaction.options.getString('steamid')
    const casesPrices = await casesPrice(steamId)
    await interaction.editReply({
        embeds: [csgoEmbed('price', casesPrices, {
            user: interaction.user,
            steamId: steamId,
        })]
    })
}


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
        const id = newState.member.id
        if(newState.member.user.id === process.env.CLIENT_ID){
            guildList.get(newState.guild.id).voiceChannel = newState.channel.id
            newState.channel.members.forEach(member => {
                guildList.get(newState.guild.id).voiceMembers.set(member.user.id, member)
            })
        }else if(guildList.get(newState.guild.id).voiceMembers.has(process.env.CLIENT_ID)
                && newState.channel.id === guildList.get(newState.guild.id).voiceChannel){
            guildList.get(newState.guild.id).voiceMembers.set(newState.member.user.id, newState.member)
            const name = newState.member.nickname || newState.member.user.tag.split("#")[0]
            const nowHour = new Date().getHours()
            const greetingTime = nowHour < 12 ? 'buổi sáng'
                    : nowHour < 18 ? 'buổi chiều'
                    : 'buổi tối'
            const greeting = newState.member.user.id === process.env.MASTER_ID
                ? `Chào ${greetingTime} sếp ${name}, chúc sếp ${greetingTime} tốt lành`
                : `Chào ${greetingTime} ${name}`
            await textToSpeech(greeting, voiceConnection,
                guildList.get(newState.guild.id).music?.subscription,
                () => {
                    voiceConnection.subscribe(guildList.get(newState.guild.id).music?.player)
                })
        }
        console.log(`Member ${id} joined`);
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
                guildList.get(oldState.guild.id).music?.subscription,
                () => {
                    voiceConnection.subscribe(guildList.get(oldState.guild.id).music?.player)
                })
        }
        console.log("[old] Total members: ", guildList.get(oldState.guild.id).voiceMembers.size);
        if(guildList.get(oldState.guild.id).voiceMembers.size == 0){
            handleDisconnect(null, oldState.channel)
        }
    }
})

client.on('messageCreate', async (message) => {
    if(message.editable === true
        && message.author.bot === true
        && message.author.id === process.env.CLIENT_ID
        && message.content === ''
        && message.components.length > 0)
    {
        if(message.components[0].components.length === 3){
            const player = guildList.get(message.guildId).music?.player
            if(player){
                const title = message.embeds[0]?.title
                const url = message.embeds[0]?.url
                const avatarURL = message.embeds[0]?.author?.iconURL
                if(title && url && avatarURL){
                    player.prependOnceListener("endEmbed", async (player) => {
                        await message.edit({
                            embeds: [musicEmbed("end", {title: title, url: url}, {avatarURL: avatarURL})],
                            components: []
                        })
                    })
                }
            }
        }
    }
})

client.on('interactionCreate', async interaction => {
    try {
        if(interaction.isButton()){
            const Music = guildList.get(interaction.guildId).music
            if(interaction.customId.includes("_record")){
                return await recordControll(interaction.customId, interaction)
            }
            await buttonControll(interaction, Music)
        }
        
        if(interaction.isStringSelectMenu()){
            if(interaction.customId === "search-choice"){
                const data = interaction.values[0].split('|')
                interaction.update({
                    embeds: [choosedEmbed(interaction, {
                        title: data[0],
                        url: data[1]
                    })],
                    components: [],
                })
                return await handlePlay(interaction)
            }
        }

        if (!interaction.isChatInputCommand()) return;
        
        // VOICE SPEAK
        if (interaction.commandName === 'say') {
            await handleSay(interaction)
        }

        // CHAT GPT
        if (interaction.commandName === 'gpt') {
            await handleGpt(interaction)
        }

        // JOIN CHANNEL
        if (interaction.commandName === 'join') {
            await handleJoin(interaction)
        }

        // PLAY MUSIC
        if (interaction.commandName === 'play') {
            await handlePlay(interaction)
        }

        // PLAY LIST
        if (interaction.commandName === 'addlist') {
            await handleAddList(interaction)
        }

        // SEARCH
        if (interaction.commandName === 'search') {
            await handleSearch(interaction)
        }


        // PAUSE
        if (interaction.commandName === 'pause') {
            await handlePause(interaction)
        }

        // RESUME
        if (interaction.commandName === 'resume') {
            await handleResume(interaction)
        }

        // SKIP
        if (interaction.commandName === 'skip') {
            await handleSkip(interaction)
        }

        // STOP
        if (interaction.commandName === 'stop') {
            await handleStop(interaction)
        }

        // RECORD
        if (interaction.commandName === 'record') {
            await handleRecord(interaction)
        }

        // HTML SAMPLE
        if (interaction.commandName === 'csgo') {
            const option = interaction.options.getString('option')
            switch(option){
                case 'cases-price':{
                    await handleCsgoCases(interaction)
                    break
                }
                default:
                    break
            }
        }

        // DISCONNECT
        if (interaction.commandName === 'disconnect'
            || interaction.commandName === 'leave') {
            await handleDisconnect(interaction, null)
        }
    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.TOKEN)