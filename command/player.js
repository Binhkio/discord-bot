import { AudioPlayerStatus, createAudioPlayer, NoSubscriberBehavior } from "@discordjs/voice"
import { PlayMusic } from "./playMusic.js"

export const createPlayer = (Music, interaction) => {
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause
        }
    })
    player.addListener('keepPlaying', async (songsQueue, player, status, interaction) => {
        if(songsQueue.length > 0 && status === 'idle'){
            const nextUrl = songsQueue.shift()
            const isValidate = await PlayMusic(nextUrl, player)
            if(isValidate !== true){
                await interaction.channel.send(`**Link không tồn tại**\n> ${nextUrl}`)
            }else{
                await interaction.channel.send(`**Đang phát**\n> ${nextUrl}`)
            }
        }else if(songsQueue.length < 1 && status === 'idle'){
            await interaction.channel.send("Không có nhạc trong hàng chờ!")
        }
    })
    player.addListener('pausePlaying', async (songsQueue, player, status, interaction) => {
        if(status === 'playing'
            || status === 'buffering'){
            player.pause()
            if(!interaction.replied)
                await interaction.reply("> **Tạm dừng**")
            else
                await interaction.editReply("> **Tạm dừng**")
        }
    })
    player.addListener('resumePlaying', async (songsQueue, player, status, interaction) => {
        if(status === 'pause'){
            player.unpause()
            if(!interaction.replied)
                await interaction.reply("> **Tiếp tục**")
            else
                await interaction.editReply("> **Tiếp tục**")
        }
    })
    player.addListener('skipPlaying', async (songsQueue, player, status, interaction) => {
        if(songsQueue.length > 0){
            if(status === 'playing'
                || status === 'buffering'){
                player.stop(true)
            }
            if(interaction.replied === false)
                await interaction.reply("> **Chuyển nhạc**")
        }else{
            await interaction.reply("Không có nhạc trong hàng chờ!")
        }
    })
    player.addListener('stopPlaying', async (songsQueue, player, status, interaction) => {
        if(songsQueue.length > 0){
            songsQueue.splice(0, songsQueue.length)
        }
        if(status === 'playing'){
            player.stop(true)
        }
        await interaction.reply("> **Dừng phát nhạc**")
    })
    player.on(AudioPlayerStatus.Playing, () => {
        console.log('Playing...\tSongs queue: ', Music.songsQueue.length);
        Music.status = 'playing'
    })
    player.on(AudioPlayerStatus.Idle, () => {
        console.log('Idle...\tSongs queue: ', Music.songsQueue.length);
        Music.status = 'idle'
        if(Music.songsQueue.length > 0){
            player.emit('keepPlaying', Music.songsQueue, Music.player, Music.status, interaction)
        }
    })
    player.on(AudioPlayerStatus.Buffering, () => {
        console.log('Buffering...\tSongs queue: ', Music.songsQueue.length);
        Music.status = 'buffering'
    })
    player.on(AudioPlayerStatus.Paused, () => {
        console.log('Paused...\tSongs queue: ', Music.songsQueue.length);
        Music.status = 'pause'
    })
    player.on('error', err => {
        console.log("Player ERROR", err)
    })

    return player
}