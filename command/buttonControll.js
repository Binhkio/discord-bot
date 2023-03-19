import { pauseButton, playingButton, stopButton } from "./musicButton.js";

export const buttonControll = (interaction, Music) => {
    console.log("Clicked button:", interaction.customId);
    switch (interaction.customId) {
        case "pause":{
            if(Music.status === 'playing'
            || Music.status === 'buffering'){
                Music.player.emit("pausePlaying", Music.songsQueue, Music.player, Music.status, interaction)
                interaction.update({components: [pauseButton()]})
            }else if(Music.status === 'pause'){
                Music.player.emit("resumePlaying", Music.songsQueue, Music.player, Music.status, interaction)
                interaction.update({components: [playingButton()]})
            }
            break;
        }
        case "skip":{
            Music.player.emit("skipPlaying", Music.songsQueue, Music.player, Music.status, interaction)
            interaction.update({components: [playingButton()]})
            break;
        }
        case "stop":{
            Music.player.emit("stopPlaying", Music.songsQueue, Music.player, Music.status, interaction)
            interaction.update({components: [stopButton()]})
            break;
        }
        default:
            break;
    }
}