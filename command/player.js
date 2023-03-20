import { AudioPlayerStatus, createAudioPlayer, NoSubscriberBehavior } from "@discordjs/voice"
import playdl from "play-dl"
import { pauseButton, playingButton, stopButton } from "./musicButton.js"
import { musicEmbed } from "./musicEmbed.js"
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
            const { video_details } = await playdl.video_basic_info(nextUrl)
            const user_details = interaction.user
            console.log("__PLAY", video_details.title, user_details.username);

            const isValidate = await PlayMusic(nextUrl, player)
            
            const embed = musicEmbed("play", video_details, user_details)
            if(embed === false){
                await interaction.channel.send("PLAY FAILED")
            }else{
                player.emit("endEmbed", player)
                await interaction.channel.send({
                    embeds: [embed],
                    components: [playingButton()]
                })
            }
        }else if(songsQueue.length < 1 && status === 'idle'){
            await interaction.channel.send("> **Không có nhạc trong hàng chờ!**")
        }
    })
    player.addListener('pausePlaying', async (songsQueue, player, status, interaction) => {
        if(status === 'playing'
            || status === 'buffering'){
            player.pause()
        }
    })
    player.addListener('resumePlaying', async (songsQueue, player, status, interaction) => {
        if(status === 'pause'){
            player.unpause()
        }
    })
    player.addListener('skipPlaying', async (songsQueue, player, status, interaction) => {
        player.stop(true)
    })
    player.addListener('stopPlaying', async (songsQueue, player, status, interaction) => {
        if(songsQueue.length > 0){
            songsQueue.splice(0, songsQueue.length)
        }
        player.stop(true)
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