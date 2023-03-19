import { entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice"

export const joinChannel = async (voiceChannel, interaction) => {
    if(!voiceChannel){
        return false
    }
    const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    })
    await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5e3)
    console.log(`Joined channel ${voiceChannel.id}, ${voiceChannel.name}`)

    return voiceConnection
}