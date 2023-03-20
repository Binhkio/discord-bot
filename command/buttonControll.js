import { pauseButton, playingButton, stopButton } from "./musicButton.js";

export const buttonControll = async (interaction, Music) => {
    console.log("Clicked button:", interaction.customId);
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