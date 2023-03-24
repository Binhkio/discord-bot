import { pauseButton, playingButton, recordButton, stopButton } from "./musicButton.js";

export const buttonControll = async (interaction, Music) => {
    console.log("Clicked button:", interaction.customId);
    if(!Music.player){
        return await interaction.reply("> **Không khả dụng**")
    }
    switch (interaction.customId) {
        case "pause":{
            if(Music.status === 'playing'
            || Music.status === 'buffering'){
                await interaction.update({components: [pauseButton()]})
                Music.player.emit("pausePlaying", Music.songsQueue, Music.player, Music.status, interaction)
            }else if(Music.status === 'pause'){
                await interaction.update({components: [playingButton()]})
                Music.player.emit("resumePlaying", Music.songsQueue, Music.player, Music.status, interaction)
            }
            break;
        }
        case "skip":{
            await interaction.update({components: [stopButton()]})
            Music.player.emit("skipPlaying", Music.songsQueue, Music.player, Music.status, interaction)
            break;
        }
        case "stop":{
            await interaction.update({components: [stopButton()]})
            Music.player.emit("stopPlaying", Music.songsQueue, Music.player, Music.status, interaction)
            break;
        }
        default:
            break;
    }
}

export const recordControll = async (action, interaction) => {
    switch (action) {
        case "start_record":{
            await interaction.update({components: [recordButton("recording")]})
            break;
        }
        case "pause_record":{
            await interaction.update({components: [recordButton("pausing")]})
            break;
        }
        case "resume_record":{
            await interaction.update({components: [recordButton("recording")]})
            break;
        }
        case "stop_record":{
            await interaction.update({components: []})
            break;
        }
        default:
            break;
    }
}